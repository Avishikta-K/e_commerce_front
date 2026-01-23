import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, addToCart } from '../redux/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { usePageTransition } from '../context/TransitionContext';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const dispatch = useDispatch();

  const { navigateWithTransition } = usePageTransition();

  const shippingCost = totalPrice > 100 ? 0 : 15;
  const finalTotal = totalPrice + shippingCost;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-100 p-6 rounded-full mb-4"
        >
          <FaShoppingBag size={48} className="text-gray-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        
        <button 
          onClick={() => navigateWithTransition('/shop')}
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          Start Shopping <FaArrowRight />
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Shopping Cart ({totalQuantity} Items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- LEFT COLUMN: CART ITEMS --- */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={item.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>

                  {/* --- NEW: RENDER COLOR & SIZE HERE --- */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5">
                    {item.size && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">Color:</span>
                        <span 
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" 
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        />
                      </div>
                    )}
                  </div>
                  {/* ----------------------------------- */}

                  <p className="text-blue-600 font-bold mt-1">${item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))} 
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {item.quantity === 1 ? <FaTrash size={12} /> : <FaMinus size={10} />}
                  </button>
                  
                  <span className="font-semibold text-gray-900 w-4 text-center">{item.quantity}</span>
                  
                  <button 
                    onClick={() => dispatch(addToCart(item))} 
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                {/* Subtotal for Item */}
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-lg">${item.price * item.quantity}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24"
          >
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Estimate</span>
                <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                  {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax Estimate</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="h-px bg-gray-200 mb-6"></div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-gray-900">Order Total</span>
              <span className="text-2xl font-bold text-gray-900">${finalTotal}</span>
            </div>

            <button 
              onClick={() => navigateWithTransition('/checkout')}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all active:scale-[0.98]"
            >
              Checkout
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Secure Checkout • Free Shipping over $100
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Cart;