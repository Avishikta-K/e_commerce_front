import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '../context/TransitionContext';
import { FaSignOutAlt, FaCog, FaBell, FaLock, FaPalette, FaCut, FaTshirt, FaTag } from 'react-icons/fa';

// --- UTILITY: MASKING TAPE EFFECT ---
const MaskingTape = ({ className }) => (
  <div className={`absolute h-8 w-32 bg-[#f0e6d2] shadow-sm opacity-90 transform ${className}`} 
       style={{ 
         backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
         clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0% 100%)', // Rough edges
         boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
       }} 
  />
);

// --- UTILITY: STITCHED LINE ---
const StitchedLine = () => (
  <div className="w-full h-[2px] bg-transparent border-t-2 border-dashed border-gray-400/50 my-4"></div>
);

// --- COMPONENT: "SEWING BUTTON" TOGGLE ---
const AtelierToggle = ({ label, isOn, onToggle }) => (
  <div className="flex items-center justify-between py-4 group cursor-pointer" onClick={onToggle}>
    <span className="font-serif text-xl italic text-gray-800 group-hover:text-black transition-colors">{label}</span>
    
    <div className="relative flex items-center w-16 h-8">
      {/* The Thread/Track */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300"></div>
      
      {/* The Button (Knob) */}
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm ${isOn ? 'bg-black border-black ml-auto' : 'bg-[#f4f1ea] border-gray-400'}`}
      >
        {/* Button Holes */}
        <div className="flex gap-1">
            <div className={`w-1 h-1 rounded-full ${isOn ? 'bg-white' : 'bg-gray-400'}`}></div>
            <div className={`w-1 h-1 rounded-full ${isOn ? 'bg-white' : 'bg-gray-400'}`}></div>
        </div>
      </motion.div>
    </div>
  </div>
);

const Settings = () => {
  const { navigateWithTransition } = usePageTransition();
  
  // Mock State
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('user');
    navigateWithTransition('/login');
  };

  // --- ANIMATION CONFIGURATION (UPDATED SPEEDS) ---

  // 1. The Giant Gear (Watermark Style)
  const gearVariants = {
    initial: { 
      top: "50%", left: "50%", x: "-50%", y: "-50%", 
      scale: 0, opacity: 0 
    },
    enter: { 
      scale: 1, opacity: 0.05, 
      transition: { duration: 0.8, type: "spring", bounce: 0.3 } // Faster entrance
    },
    side: { 
      left: "90%", x: "-50%", 
      scale: 1.8, opacity: 0.03,
      transition: { delay: 0.8, duration: 1.5, ease: "easeInOut" } // Reduced delay from 1.5s
    }
  };

  // 2. Content Animation (Cards pinning onto the board)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      // Dramatically reduced delayChildren from 1.8s to 0.5s
      transition: { staggerChildren: 0.1, delayChildren: 0.5 } 
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, rotate: -2 },
    visible: { 
      y: 0, opacity: 1, rotate: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE9E4] text-gray-900 relative overflow-hidden font-serif selection:bg-black selection:text-white">
      
      {/* Background Texture: Cardboard/Paper Grain */}
      <div className="absolute inset-0 opacity-40 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>

      {/* --- THE GIANT GEAR (The Background Machinery) --- */}
      <motion.div
        className="fixed pointer-events-none z-0 text-black mix-blend-multiply"
        variants={gearVariants}
        initial="initial"
        animate={["enter", "side"]}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          <FaCog style={{ fontSize: '700px' }} />
        </motion.div>
      </motion.div>


      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* HEADER: HANDWRITTEN STYLE */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} // Reduced from 2.2s
            className="flex flex-col md:flex-row justify-between items-end mb-16 relative"
        >
             {/* Title */}
            <div className="relative">
                <h1 className="text-8xl font-black uppercase tracking-tighter leading-none relative z-10 mix-blend-darken">
                   Set<br/>things
                </h1>
                {/* Yellow highlighter mark behind text */}
                <div className="absolute top-1/2 left-[-10px] w-[110%] h-[40px] bg-[#fef08a] -z-0 transform -rotate-1 skew-x-12 opacity-80 mix-blend-multiply"></div>
                <p className="font-mono text-xs mt-4 tracking-widest uppercase">The Collection / Fall-Winter 2025</p>
            </div>

            <div className="mt-8 md:mt-0 font-mono text-xs text-right opacity-60">
                <p>REF: 884-299-X</p>
                <p>SUB: USER_PREFERENCES</p>
            </div>
        </motion.div>


        {/* THE MOODBOARD (Grid) */}
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            
            {/* 1. APPEARANCE (A Swatch Card) */}
            <motion.div 
                variants={cardVariants}
                className="lg:col-span-7 bg-white p-8 shadow-xl transform rotate-1 relative"
            >
                {/* Tape holding it up */}
                <MaskingTape className="-top-4 left-1/2 -translate-x-1/2 rotate-2" />
                
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <FaPalette className="text-xl" /> Aesthetic
                    </h2>
                    <span className="font-mono text-[10px] border border-black px-1">SWATCH A</span>
                </div>
                
                <p className="font-serif italic text-gray-500 mb-8 max-w-xs">
                    "Fashion is the armor to survive the reality of everyday life."
                </p>

                <StitchedLine />

                <AtelierToggle 
                    label="Darkroom Mode" 
                    isOn={darkMode} 
                    onToggle={() => setDarkMode(!darkMode)} 
                />
            </motion.div>


            {/* 2. SECURITY (A "Tag" Card) */}
            <motion.div 
                variants={cardVariants}
                className="lg:col-span-5 bg-[#1a1a1a] text-[#f4f1ea] p-8 shadow-2xl transform -rotate-2 relative flex flex-col justify-between"
            >
                <MaskingTape className="-top-3 right-10 rotate-[-45deg]" />
                
                <div>
                    <div className="flex justify-between items-start text-xs font-mono opacity-60 mb-8">
                        <span>PRIVATE</span>
                        <span><FaLock /></span>
                    </div>
                    <h2 className="text-4xl font-bold uppercase leading-none mb-4">Vault<br/>Access</h2>
                </div>

                <button className="w-full bg-[#f4f1ea] text-black py-4 font-mono text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors mt-8 flex items-center justify-center gap-2">
                    <FaTag /> Update Keys
                </button>
            </motion.div>


            {/* 3. NOTIFICATIONS (Paper Note) */}
            <motion.div 
                variants={cardVariants}
                className="lg:col-span-6 bg-[#f8f5f2] p-8 shadow-lg relative border border-gray-200"
            >
                 <MaskingTape className="-top-4 -left-4 -rotate-12" />

                <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-2">
                    <FaBell className="text-xs" /> Studio Alerts
                </h2>

                <div className="space-y-2">
                    <AtelierToggle 
                        label="Push Notifications" 
                        isOn={notifications} 
                        onToggle={() => setNotifications(!notifications)} 
                    />
                    <AtelierToggle 
                        label="Sound Effects" 
                        isOn={sounds} 
                        onToggle={() => setSounds(!sounds)} 
                    />
                </div>
            </motion.div>


            {/* 4. LOGOUT (The Cut Pattern) */}
            <motion.div 
                variants={cardVariants}
                onClick={handleLogout}
                className="lg:col-span-6 p-8 relative cursor-pointer group flex items-center justify-center border-2 border-dashed border-black hover:bg-black hover:text-white transition-colors duration-500"
            >
                <div className="text-center">
                    <FaCut className="text-4xl mx-auto mb-4 transform -rotate-90 group-hover:rotate-0 transition-transform duration-500" />
                    <h3 className="text-3xl font-bold uppercase">Sign Off</h3>
                    <p className="font-mono text-xs mt-2 opacity-60">END SESSION</p>
                </div>

                {/* Scissor cut lines animation on hover */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-transparent group-hover:bg-white group-hover:animate-pulse transition-colors"></div>
            </motion.div>

        </motion.div>

        {/* FOOTER: FABRIC LABEL STYLE */}
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.2 }} // Reduced from 3s
            className="mt-20 flex justify-center"
        >
             <div className="bg-white px-6 py-4 shadow-sm border border-gray-200 text-center relative">
                 {/* Stitching around the label */}
                 <div className="absolute inset-1 border border-dashed border-gray-300 pointer-events-none"></div>
                 
                 <div className="text-2xl mb-1"><FaTshirt className="inline" /></div>
                 <div className="font-black uppercase text-sm tracking-widest">FASHION</div>
                 <div className="font-mono text-[10px] text-gray-500 mt-1">100% COTTON • MADE IN THE CLOUD</div>
                 <div className="font-mono text-[10px] text-gray-500">EST. 2025</div>
             </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Settings;