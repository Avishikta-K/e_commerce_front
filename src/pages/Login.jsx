import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaUserCircle, FaLock } from 'react-icons/fa';
import { supabase } from '../supabase'; // Make sure you created src/supabase.js from previous steps

// --- COMPONENT: GOOGLE ACCOUNT MODAL ---
const GoogleAccountModal = ({ isOpen, onClose, onSelect }) => {
  const accounts = [
    { id: 1, name: "Avishikta Karali", email: "avishikta.karali@example.com", color: "bg-purple-600" },
    { id: 2, name: "Fashion Store Dev", email: "dev@fashion.store", color: "bg-blue-600" },
    { id: 3, name: "Use another account", email: "", color: "bg-gray-500", icon: true }
  ];

  // State for manual email entry
  const [customEmail, setCustomEmail] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = (e) => {
      e.preventDefault();
      if(customEmail) onSelect({ email: customEmail });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-gray-900 w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden relative"
            >
              <div className="p-6 pb-2 text-center">
                 <FaGoogle className="text-3xl text-gray-700 mx-auto mb-4" />
                 <h3 className="text-xl font-medium text-gray-800">Sign in</h3>
                 <p className="text-sm text-gray-600">to continue to Fashion.Store</p>
              </div>

              {!showCustomInput ? (
                  <div className="py-4">
                     {accounts.map((acc) => (
                       <div 
                         key={acc.id}
                         onClick={() => {
                             if(acc.id === 3) setShowCustomInput(true);
                             else onSelect(acc);
                         }}
                         className="px-6 py-3 flex items-center gap-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none transition-colors"
                       >
                         {acc.icon ? (
                           <div className={`w-8 h-8 rounded-full ${acc.color} flex items-center justify-center text-white text-xs`}><FaUserCircle /></div>
                         ) : (
                           <div className={`w-8 h-8 rounded-full ${acc.color} flex items-center justify-center text-white font-bold text-sm`}>{acc.name.charAt(0)}</div>
                         )}
                         <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{acc.name}</p>
                            {acc.email && <p className="text-xs text-gray-500">{acc.email}</p>}
                         </div>
                       </div>
                     ))}
                  </div>
              ) : (
                  <div className="p-6">
                      <form onSubmit={handleCustomSubmit}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input 
                            type="email" 
                            autoFocus
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                            placeholder="name@example.com"
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                            required
                          />
                          <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => setShowCustomInput(false)} className="text-sm text-blue-600 font-bold px-4 py-2">Back</button>
                              <button type="submit" className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded hover:bg-blue-700">Next</button>
                          </div>
                      </form>
                  </div>
              )}

              <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
                 To continue, Google will share your name, email address, and language preference with Fashion.Store.
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- THE HANGING LIGHT SWITCH COMPONENT ---
const LightSwitch = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const springConfig = { stiffness: 300, damping: 10 };
  const y = useSpring(0, springConfig);

  const handlePull = () => {
    y.set(60);
    setTimeout(() => {
        y.set(0); 
        onClick();
    }, 150);
  };

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center cursor-pointer group"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onClick={handlePull}
    >
        <motion.div 
            style={{ height: useMotionTemplate`calc(150px + ${y}px)` }}
            className="w-0.5 bg-gray-700 group-hover:bg-gray-500 transition-colors duration-300 relative"
        >
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-4 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-lg border-t border-gray-500" />
        </motion.div>
        <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 20 : 10 }}
            className="absolute top-[210px] text-xs uppercase tracking-widest text-gray-500 font-light pointer-events-none whitespace-nowrap"
        >
            Pull to enter
        </motion.span>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // --- 1. NEW: Redirect if already logged in ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && token.length > 50) {
        navigate('/');
    }
  }, [navigate]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleToggleLight = () => {
      setTimeout(() => {
          setIsLightOn(true);
      }, 100);
  };

  const handleGoogleBtnClick = () => {
    setShowGoogleModal(true);
  };

  // --- 2. UPDATED: Call Supabase API ---
  const handleAccountSelect = async (account) => {
    setShowGoogleModal(false);
    setIsLoading(true);
    
    try {
        // Send OTP via Supabase
        const { error } = await supabase.auth.signInWithOtp({
            email: account.email,
            options: {
                // Ensure this is set to avoid magic link default behavior if not configured
                shouldCreateUser: true, 
            }
        });

        if (error) throw error;
        
        // Navigate to OTP page
        navigate('/otp', { 
            state: { 
                email: account.email 
            } 
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message); // Likely "Signups not allowed" or rate limit
        setIsLoading(false);
    }
  };

  const particles = Array.from({ length: 20 });

  return (
    <div className="w-full h-screen bg-black font-sans relative overflow-hidden">
      
      <GoogleAccountModal 
        isOpen={showGoogleModal} 
        onClose={() => setShowGoogleModal(false)} 
        onSelect={handleAccountSelect} 
      />

      <AnimatePresence>
        {!isLightOn && (
            <motion.div 
                exit={{ y: -500, opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
                className="absolute inset-x-0 top-0 z-[60]"
            >
                <LightSwitch onClick={handleToggleLight} />
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLightOn && (
            <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1, delay: 0.2 } }}
                className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-none"
            >
                <motion.h1 
                    animate={{ 
                        textShadow: ["0 0 10px #333", "0 0 20px #555", "0 0 10px #333"],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-black tracking-tighter select-none"
                >
                    FASHION
                </motion.h1>
                <motion.p className="text-gray-800 tracking-[1em] uppercase mt-4 text-sm">
                    Store Closed
                </motion.p>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="w-full h-full flex"
        initial={{ clipPath: 'circle(0% at 50% 0%)', filter: 'brightness(0)' }} 
        animate={isLightOn ? { 
            clipPath: [
                'circle(0% at 50% 0%)',    
                'circle(15% at 50% 10%)',  
                'circle(10% at 50% 10%)',  
                'circle(150% at 50% 0%)'   
            ],
            filter: [
                'brightness(0.2)', 
                'brightness(1.5)', 
                'brightness(0.5)', 
                'brightness(1)'    
            ]
        } : {}}
        transition={{ duration: 1.5, times: [0, 0.1, 0.2, 1], ease: "circOut" }}
      >
          <motion.div 
            initial={{ x: '-10%' }} 
            animate={{ x: 0 }}
            className="hidden md:block w-1/2 h-full relative overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
              alt="Fashion Model" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            
            {isLightOn && (
                <div className="absolute bottom-16 left-16 text-white z-10">
                <div className="overflow-hidden">
                    <motion.h1 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 1, duration: 0.8, ease: "circOut" }}
                    className="text-6xl font-bold font-serif mb-2 tracking-tighter"
                    >
                    FASHION<span className="text-blue-500">.</span>STORE
                    </motion.h1>
                </div>
                <div className="overflow-hidden">
                    <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="flex items-center gap-4"
                    >
                    <div className="h-[1px] w-12 bg-white/50"></div>
                    <p className="text-gray-200 tracking-[0.3em] uppercase text-sm font-light">
                        Curated for the bold
                    </p>
                    </motion.div>
                </div>
                </div>
            )}
          </motion.div>

          <div 
            className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-8 relative bg-gray-900 group"
            onMouseMove={handleMouseMove}
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

            <motion.div
              className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
              style={{
                background: useMotionTemplate`
                  radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(29, 78, 216, 0.15), transparent 80%)
                `,
              }}
            />

            {particles.map((_, i) => (
                <motion.div 
                    key={i}
                    className="absolute bg-white/10 rounded-full"
                    initial={{ x: Math.random() * window.innerWidth / 2, y: Math.random() * window.innerHeight, scale: Math.random() * 0.5 }}
                    animate={{ y: [null, Math.random() * -100], opacity: [0, 0.5, 0] }}
                    transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
                    style={{ width: Math.random() * 4 + 1 + 'px', height: Math.random() * 4 + 1 + 'px' }}
                />
            ))}
            
            {isLightOn && (
                <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
                >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/30 transform rotate-3">
                        <FaLock className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm">Enter your credentials to access your collection.</p>
                </div>

                <div className="space-y-4">
                    <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleBtnClick}
                    className="w-full py-4 rounded-xl border border-white/20 bg-white/5 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 group relative overflow-hidden"
                    >
                    {isLoading && (
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                    )}
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                        <FaGoogle className="text-xl group-hover:text-blue-400 transition-colors" />
                        <span>Continue with Google</span>
                        </>
                    )}
                    </motion.button>
                </div>
                </motion.div>
            )}
            
            <div className="absolute bottom-6 text-gray-600 text-xs text-center w-full">
                &copy; 2024 Fashion Store Inc. All rights reserved.
            </div>
          </div>
      </motion.div>
    </div>
  );
};

export default Login;