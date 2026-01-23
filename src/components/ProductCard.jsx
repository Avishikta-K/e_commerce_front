import React, { useRef } from 'react'; // Import useRef
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { runFlyToCartAnimation } from '../utils/flyToCart'; // Import the helper

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const imgRef = useRef(null); // Create a reference to the image

  const cartItem = useSelector((state) => 
    state.cart.cartItems.find((item) => item.id === product.id)
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();

    // If it's the first item (quantity is 0), play the flying animation
    if (quantity === 0) {
      runFlyToCartAnimation(imgRef.current, () => {
        dispatch(addToCart(product)); // Add to Redux AFTER animation
      });
    } else {
      // If simply increasing quantity (1 -> 2), no need to fly, just add instantly
      dispatch(addToCart(product));
    }
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    dispatch(removeFromCart(product.id));
  };

  return (
    <div className="group block border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 bg-white relative">
      
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {/* Attach the ref to the image so we can clone it */}
          <img 
            ref={imgRef}
            // 👇 THIS IS THE FIX: It swaps 'localhost' for your live server link
            src={product.image ? product.image.replace("http://localhost:5000", "https://fashion-store-ak.onrender.com") : ''} 
            alt={product.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" 
          />
        </div>
      </Link>

      <div className="p-4">
        <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{product.category}</span>
        <h3 className="text-lg font-bold mt-1 text-gray-900 truncate">{product.name}</h3>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-xl font-bold text-gray-900">${product.price}</p>

          <div className="h-10">
            {quantity === 0 ? (
              <button 
                onClick={handleAddToCart}
                className="bg-gray-100 hover:bg-black hover:text-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <FaPlus size={14} />
              </button>
            ) : (
              <div className="flex items-center bg-black text-white rounded-full px-1 h-10 shadow-md animate-fadeIn">
                <button onClick={handleRemoveFromCart} className="w-8 h-full flex items-center justify-center">
                  <FaMinus size={10} />
                </button>
                <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                <button onClick={handleAddToCart} className="w-8 h-full flex items-center justify-center">
                  <FaPlus size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;