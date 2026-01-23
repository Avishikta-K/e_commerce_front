import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { products as staticProducts } from '../data/products'; // Rename to staticProducts
import { FaStar, FaSpinner } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // State for the active product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selection States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // --- FETCH DATA EFFECT ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // 1. Try to fetch from your API (Database)
        const response = await fetch(`https://fashion-store-ak.onrender.com/api/products/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          // Auto-select first color if available
          if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        } else {
          throw new Error("Not found in DB");
        }
      } catch (error) {
        // 2. Fallback: If API fails (e.g. ID is "1"), look in static file
        // We assume static IDs are numbers, API IDs are strings
        const staticItem = staticProducts.find((p) => p.id === parseInt(id) || p.id === id);
        if (staticItem) {
          setProduct(staticItem);
        } else {
          console.error("Product not found anywhere");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validation: Require size only if the product HAS sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size!");
      return;
    }

    dispatch(addToCart({ 
      ...product, 
      size: selectedSize,
      color: selectedColor 
    })); 
    alert("Item added to cart!");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl text-gray-400" /></div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-2xl text-gray-500">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center bg-gray-50 rounded-xl p-6">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-[600px] w-full object-contain drop-shadow-xl rounded-lg" 
          />
        </div>

        {/* Details Info */}
        <div className="md:w-1/2">
          <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">{product.category || 'Collection'}</span>
          <h2 className="text-4xl font-black mb-4 text-gray-900 mt-2">{product.name}</h2>
          
          <div className="flex items-center mb-6">
             <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
             </div>
             <span className="text-gray-400 text-sm ml-2">(150 Reviews)</span>
          </div>

          <p className="text-3xl font-bold text-blue-600 mb-6">₹{product.price}</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            {product.description}
          </p>
          
          {/* DYNAMIC COLORS SECTION */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
                <span className="font-bold text-gray-800 block mb-2">Select Color:</span>
                <div className="flex gap-3">
                    {product.colors.map((c, index) => (
                        <button 
                            key={index}
                            onClick={() => setSelectedColor(c)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                selectedColor === c ? 'border-gray-900 scale-110 ring-2 ring-offset-2 ring-gray-300' : 'border-transparent hover:scale-110'
                            }`}
                            style={{ backgroundColor: c, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                            title={c}
                        />
                    ))}
                </div>
            </div>
          )}

          {/* DYNAMIC SIZES SECTION */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <span className="font-bold text-gray-800 block mb-2">Select Size:</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)}
                    className={`px-6 py-3 border rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === s 
                        ? 'bg-black text-white border-black shadow-lg transform -translate-y-1' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-xl active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;