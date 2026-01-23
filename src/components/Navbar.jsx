import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaCog } from 'react-icons/fa'; // Added FaCog here
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { usePageTransition } from '../context/TransitionContext';

// --- UPDATED REUSABLE ANIMATED LINK ---
const NavLink = ({ to, children, onClick, isActive }) => {
  return (
    <div onClick={() => onClick(to)} className="cursor-pointer relative group">
      <motion.div
        className="px-2 py-1"
        whileHover="hover"
        whileTap="tap"
      >
        {/* Conditional Styling: If active, text is Black/Bold. If not, Gray/Medium */}
        <span 
            className={`transition-colors relative z-10 ${
                isActive ? "text-black font-bold" : "text-gray-600 font-medium group-hover:text-black"
            }`}
        >
          {children}
        </span>
        
        {/* Underline Animation */}
        <motion.span
          className="absolute left-0 bottom-0 w-full h-[2px] bg-red-500"
          // If active, scale is 1 (visible). If not, scale is 0 (hidden).
          animate={{ scaleX: isActive ? 1 : 0 }} 
          // Allow hover to still trigger the line if it is NOT active
          whileHover={{ scaleX: 1 }}
          variants={{
            hover: { scaleX: 1, originX: 0 },
            tap: { scaleX: 1 }
          }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

const Navbar = () => {
  const cartQuantity = useSelector(state => state.cart.totalQuantity);
  const { navigateWithTransition } = usePageTransition(); 
  const location = useLocation();

  // Helper to handle navigation
  const handleNav = (path) => {
    navigateWithTransition(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <div onClick={() => handleNav('/')} className="cursor-pointer">
          <motion.div 
            layoutId="brand-logo" 
            className="text-2xl font-bold tracking-tighter"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8 }} 
          >
            FASHION<span className="text-red-500">.</span>STORE
          </motion.div>
        </div>

        {/* Links - Now passing the 'isActive' prop */}
        <div className="hidden md:flex space-x-6">
          <NavLink 
            to="/" 
            onClick={handleNav} 
            isActive={location.pathname === '/'}
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/shop" 
            onClick={handleNav}
            isActive={location.pathname === '/shop'}
          >
            Shop
          </NavLink>
          
          <NavLink 
            to="/orders" 
            onClick={handleNav}
            isActive={location.pathname === '/orders'}
          >
            Orders
          </NavLink>
          
          <NavLink 
            to="/about" 
            onClick={handleNav}
            isActive={location.pathname === '/about'}
          >
            About
          </NavLink>
          
          <NavLink 
            to="/contact" 
            onClick={handleNav}
            isActive={location.pathname === '/contact'}
          >
            Contact
          </NavLink>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          
          {/* CART ICON */}
          <div onClick={() => handleNav('/cart')} className="cursor-pointer relative" id="cart-icon"> 
            <motion.div 
              className={`relative hover:text-black ${location.pathname === '/cart' ? 'text-black' : 'text-gray-700'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaShoppingCart size={20} />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartQuantity}
                </span>
              )}
            </motion.div>
          </div>

          {/* PROFILE ICON */}
          <div onClick={() => handleNav('/profile')} className="cursor-pointer">
            <motion.div 
              className={`hover:text-black ${location.pathname === '/profile' ? 'text-black' : 'text-gray-700'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaUser size={20} />
            </motion.div>
          </div>

          {/* SETTINGS ICON (ADDED HERE) */}
          <div onClick={() => handleNav('/settings')} className="cursor-pointer">
            <motion.div 
              className={`hover:text-black ${location.pathname === '/settings' ? 'text-black' : 'text-gray-700'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaCog size={20} />
            </motion.div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;