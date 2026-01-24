import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import { placeOrder } from '../redux/orderSlice';
import { createOrder } from '../utils/api'; // <--- IMPORT API FUNCTION

// --- Internal Component: Success Animation Modal (Unchanged) ---
const OrderSuccessModal = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full mx-4 animate-fade-in-up">
        <div className="relative w-32 h-32 mb-6 overflow-visible">
          <svg className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 128 128" style={{ overflow: 'visible' }}>
              <line x1="-50" y1="40" x2="0" y2="40" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" style={{ animation: 'speed-streak 1s ease-out forwards', transformOrigin: 'center left' }} />
              <line x1="-70" y1="64" x2="-20" y2="64" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" style={{ animation: 'speed-streak 1s ease-out 0.1s forwards', transformOrigin: 'center left' }} />
              <line x1="-40" y1="88" x2="10" y2="88" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" style={{ animation: 'speed-streak 1s ease-out 0.05s forwards', transformOrigin: 'center left' }} />
          </svg>
          <svg viewBox="0 0 24 24" className="relative z-10 w-full h-full text-black" style={{ animation: 'run-cart 1s ease-out forwards' }}>
            <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <div className="absolute z-20 -top-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg flex items-center justify-center" style={{ animation: 'pop-tick 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.8s forwards', opacity: 0 }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Thank you for your purchase. Your order is being processed.</p>
        
        <button onClick={onNavigate} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition active:scale-95">
          View Order History
        </button>

        <style>{`
          @keyframes run-cart { 0% { transform: translateX(-100px) skewX(-10deg); opacity: 0; } 60% { transform: translateX(10px) skewX(5deg); opacity: 1; } 80% { transform: translateX(-5px) skewX(-2deg); } 100% { transform: translateX(0) skewX(0); } }
          @keyframes speed-streak { 0% { transform: translateX(-60px) scaleX(0.1); opacity: 0; } 30% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateX(40px) scaleX(1.8); opacity: 0; } }
          @keyframes pop-tick { 0% { transform: scale(0) rotate(-45deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
          @keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 20px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
          .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

// --- Main Checkout Component ---
const Checkout = () => {
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', city: '', zip: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.zip) {
      alert("Please fill in the required fields");
      return;
    }

    setLoading(true);

    // 1. Prepare Data for Backend
    const orderPayload = {
        customer: formData,
        items: cartItems.map(item => ({
            productId: item.id || item._id, 
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            color: item.color,
            size: item.size
        })),
        totalAmount: totalPrice
    };

    try {
        // --- UPDATED: Use createOrder from API (Sends Token Automatically) ---
        const data = await createOrder(orderPayload);

        // Success Logic
        const reduxOrderFormat = {
            id: data._id,
            date: new Date(data.date).toLocaleDateString(),
            total: data.totalAmount.toFixed(2),
            status: data.status,
            items: data.items,
            shippingInfo: data.customer
        };
        
        dispatch(placeOrder(reduxOrderFormat));
        dispatch(clearCart());
        setIsOrderSuccess(true);

    } catch (error) {
        console.error("Order Error:", error);
        alert(error.message || "Failed to place order.");
    } finally {
        setLoading(false);
    }
  };

  if (isOrderSuccess) {
    return <OrderSuccessModal onNavigate={() => navigate('/orders')} />;
  }

  if (cartItems.length === 0 && !isOrderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => navigate('/shop')} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">Go Shopping</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Form Section */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span>1. Shipping Information</span>
          </h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition" placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition" placeholder="john@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition" placeholder="123 Street Name" required />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition" placeholder="New York" required />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition" placeholder="10001" required />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id || item._id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div className="flex items-center gap-3">
                   {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md border border-gray-200"/>}
                   <div>
                     <p className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</p>
                     
                     <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                       <span>Qty: {item.quantity}</span>
                       
                       {item.size && (
                         <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-700">
                           {item.size}
                         </span>
                       )}

                       {item.color && (
                         <span 
                           className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" 
                           style={{ backgroundColor: item.color }} 
                           title={item.color} 
                         />
                       )}
                     </div>

                   </div>
                </div>
                <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full text-white py-4 rounded-lg mt-6 font-bold text-lg transition active:scale-[0.98] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;