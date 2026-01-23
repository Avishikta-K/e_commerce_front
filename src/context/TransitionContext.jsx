import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  // This function handles the "Click -> Animate -> Navigate -> Animate Back" flow
  const navigateWithTransition = (path) => {
    if (path === window.location.pathname) return; // Don't animate if staying on same page

    setIsAnimating(true);

    // 1. Wait for logo to move to center (800ms)
    setTimeout(() => {
      navigate(path);
      
      // 2. Wait a bit, then retract the logo (another 800ms)
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
      
    }, 800);
  };

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}

      {/* --- THE WHITE SCREEN OVERLAY --- */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* The Logo in the Center */}
            <motion.div
              layoutId="brand-logo" // MAGIC ID: Connects to Navbar logo
              className="text-4xl md:text-6xl font-bold tracking-tighter text-black"
              transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }} // Smooth "Apple-like" easing
            >
              FASHION<span className="text-red-500">.</span>STORE
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};

// Custom Hook to use the transition
export const usePageTransition = () => useContext(TransitionContext);