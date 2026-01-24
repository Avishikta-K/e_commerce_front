import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaChevronRight, 
  FaBoxOpen, 
  FaTimes, 
  FaPrint, 
  FaMapMarkerAlt, 
  FaSpinner,
  FaTrash 
} from 'react-icons/fa';
import { getUserOrders } from '../utils/api'; // <--- IMPORT AUTHENTICATED API CALL

// --- ANIMATED STATUS TRACKER (Unchanged) ---
const AnimatedStatusTracker = ({ status }) => {
  const steps = ['Processing', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(status) === -1 ? 0 : steps.indexOf(status);

  return (
    <div className="w-full py-6">
      <div className="flex justify-between items-center relative mb-2 px-4">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full" />
        <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-black -z-0 rounded-full" 
            initial={{ width: '0%' }}
            animate={{ width: `${currentStep * 50}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
        />

        {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center bg-white px-2">
                <motion.div 
                    initial={{ scale: 0.8 }} animate={{ scale: currentStep >= index ? 1.2 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= index ? (index === 2 ? 'border-green-600 bg-green-600 text-white' : 'border-black bg-black text-white') : 'border-gray-300 text-gray-300'}`}
                >
                    {currentStep >= index ? (
                        <motion.svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                             <motion.path d="M20 6L9 17l-5-5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                        </motion.svg>
                    ) : (
                        <span className="text-xs">{index + 1}</span>
                    )}
                </motion.div>
                <p className={`text-xs font-bold mt-2 ${currentStep >= index ? (index === 2 ? 'text-green-600' : 'text-black') : 'text-gray-400'}`}>{step}</p>
            </div>
        ))}
      </div>
      
      <div className="text-center mt-4 bg-gray-50 p-2 rounded-lg border border-gray-100 mx-4">
         <p className="text-sm text-gray-600">
            {currentStep === 0 && "We are packing your order with care."}
            {currentStep === 1 && "Your package is on the way!"}
            {currentStep === 2 && "Package delivered. Enjoy your purchase!"}
         </p>
      </div>
    </div>
  );
};

// --- RECEIPT MODAL (Unchanged) ---
const OrderReceiptModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />
      <motion.div
        initial={{ rotateX: -90, opacity: 0, y: -50 }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        exit={{ rotateX: -90, opacity: 0, y: -50 }}
        transition={{ duration: 0.6, type: "spring", damping: 15 }}
        style={{ transformOrigin: "top", perspective: 1000 }}
        className="relative w-full max-w-lg bg-white shadow-2xl rounded-sm overflow-hidden z-50 flex flex-col max-h-[90vh]"
      >
        <div className="h-2 bg-black w-full" />
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start border-b border-dashed border-gray-300 pb-6 mb-4">
            <div>
              <div className="text-2xl font-bold tracking-tighter mb-1">FASHION<span className="text-black">.</span>STORE</div>
              <p className="text-xs text-gray-500">123 Fashion Ave, New York, NY</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl text-gray-200 font-bold uppercase leading-none">Invoice</h2>
              <p className="font-mono text-sm text-gray-600 mt-1">#{order.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          <div className="mb-8">
             <AnimatedStatusTracker status={order.status} />
          </div>

          <div className="flex justify-between mb-8 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold mb-1">Billed To</p>
              <p className="font-bold text-gray-800">{order.shippingInfo?.name || "Customer"}</p>
              <div className="flex items-start gap-1 text-gray-500 mt-1 max-w-[150px]">
                <FaMapMarkerAlt className="mt-0.5 shrink-0" size={10} />
                <p className="leading-tight">{order.shippingInfo?.address || "Shipping Address"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase font-bold mb-1">Date Issued</p>
              <p className="font-medium text-gray-800">{order.date}</p>
              <p className="text-gray-500 text-xs">{order.time}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-200 pb-2 mb-2">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-4 text-right">Price</div>
            </div>
            <div className="space-y-3">
              {order.items && order.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center text-sm">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 leading-tight line-clamp-1">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                          {item.size && (
                             <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{item.size}</span>
                          )}
                          {item.color && (
                             <span className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: item.color }} title={item.color} />
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-gray-600 font-mono">x{item.quantity}</div>
                  <div className="col-span-4 text-right font-mono font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span className="font-mono">${order.total}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
              <span>Total Paid</span><span className="font-mono">${order.total}</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 transition"><FaPrint /> Print</button>
          <button onClick={onClose} className="flex-1 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 transition">Close</button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition"><FaTimes /></button>
      </motion.div>
    </div>
  );
};

// --- MAIN ORDER HISTORY COMPONENT ---
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (isBackgroundUpdate = false) => {
    try {
      if (!isBackgroundUpdate) setLoading(true);
      
      // --- UPDATED: Use the API utility that handles Token Authentication ---
      const data = await getUserOrders(); 
      
      // 1. GET HIDDEN ORDERS FROM LOCAL STORAGE
      const hiddenOrders = JSON.parse(localStorage.getItem('hiddenOrders') || '[]');

      // 2. FILTER DATA BEFORE MAPPING
      const visibleOrders = data.filter(order => !hiddenOrders.includes(order._id));

      const formattedOrders = visibleOrders.map(order => ({
          id: order._id, 
          date: new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          total: order.totalAmount.toFixed(2),
          status: order.status || 'Processing',
          statusBg: order.status === 'Delivered' ? 'bg-green-100' : order.status === 'Shipped' ? 'bg-blue-100' : 'bg-yellow-100',
          statusText: order.status === 'Delivered' ? 'text-green-700' : order.status === 'Shipped' ? 'text-blue-700' : 'text-yellow-700',
          statusColor: order.status === 'Delivered' ? 'bg-green-500' : order.status === 'Shipped' ? 'bg-blue-500' : 'bg-yellow-500',
          itemsCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
          images: order.items.map(item => item.image), 
          items: order.items,
          shippingInfo: order.customer
      }));

      setOrders(formattedOrders);
      
      if (selectedOrder) {
          const updatedSelected = formattedOrders.find(o => o.id === selectedOrder.id);
          // If the currently selected order was just hidden/deleted, close the modal
          if (!updatedSelected) {
              setSelectedOrder(null);
          } else if (updatedSelected.status !== selectedOrder.status) {
              setSelectedOrder(updatedSelected);
          }
      }

    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE LOCAL DELETE ---
  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to remove this order from your history?")) {
        // 1. Get current list
        const hiddenOrders = JSON.parse(localStorage.getItem('hiddenOrders') || '[]');
        
        // 2. Add ID to list
        const updatedHidden = [...hiddenOrders, orderId];
        
        // 3. Save back to Local Storage
        localStorage.setItem('hiddenOrders', JSON.stringify(updatedHidden));
        
        // 4. Update UI immediately
        setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(() => {
        fetchOrders(true);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen pt-10 pb-20 bg-[#f8f9fa]"> 
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Orders</h1>
            <p className="text-gray-500 mt-1 text-sm">Track, return, or buy things again.</p>
          </div>
          <div className="hidden md:block text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            Total Orders: <span className="text-black">{orders.length}</span>
          </div>
        </motion.div>

        {loading && orders.length === 0 ? (
            <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-gray-400 text-2xl" /></div>
        ) : (
            <div className="space-y-6">
            {orders.map((order) => (
                <motion.div
                key={order.id}
                layoutId={order.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group"
                >
                <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <span className="font-bold text-gray-900 text-lg">#{order.id.slice(-6).toUpperCase()}</span>
                        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500">
                            <div className="flex items-center gap-1.5"><FaCalendarAlt className="text-gray-400" /><span>{order.date}</span></div>
                        </div>
                    </div>
                    
                    {/* Status Badge + Delete Button Wrapper */}
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors duration-500 ${order.statusBg} ${order.statusText}`}>
                            <span className={`w-2 h-2 rounded-full ${order.statusColor} animate-pulse`}></span>
                            {order.status}
                        </div>
                        
                        {/* --- DELETE BUTTON --- */}
                        <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Remove from history"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                </div>

                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 flex-1 w-full">
                        <div className="flex -space-x-3 overflow-hidden p-1">
                        {order.items && order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="relative w-14 h-14 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-gray-100 group/item">
                               <img src={item.image} alt="Product" className="w-full h-full object-cover" />
                               {item.color && (
                                   <div 
                                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white m-1" 
                                      style={{ backgroundColor: item.color }} 
                                   />
                               )}
                            </div>
                        ))}
                        {order.itemsCount > 3 && (
                            <div className="relative w-14 h-14 rounded-lg border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 z-10">+{order.itemsCount - 3}</div>
                        )}
                        </div>
                        <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{order.itemsCount} Items</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">${order.total}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(order)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95">
                            Details <FaChevronRight size={12} />
                        </button>
                    </div>
                </div>
                </motion.div>
            ))}
            {orders.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <FaBoxOpen className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                </div>
            )}
            </div>
        )}
      </div>
      <AnimatePresence>
        {selectedOrder && (<OrderReceiptModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />)}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistory;