import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaApple, FaArrowRight, FaLock } from 'react-icons/fa';

// --- THE HANGING LIGHT SWITCH COMPONENT ---
const LightSwitch = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring physics for the pull string
  const springConfig = { stiffness: 300, damping: 10 };
  const y = useSpring(0, springConfig);

  const handlePull = () => {
    // Pull down animation
    y.set(60);
    setTimeout(() => {
        y.set(0); // Spring back up
        onClick();
    }, 150);
  };

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center cursor-pointer group"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onClick={handlePull}
    >
        {/* The Cord Line */}
        <motion.div 
            style={{ height: useMotionTemplate`calc(150px + ${y}px)` }}
            className="w-0.5 bg-gray-700 group-hover:bg-gray-500 transition-colors duration-300 relative"
        >
             {/* The Handle/Knob */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-4 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-lg border-t border-gray-500" />
        </motion.div>
        
        {/* Tooltip */}
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

  // --- MOUSE SPOTLIGHT EFFECT ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleToggleLight = () => {
      // Small delay to sync with the "snap back" of the cord
      setTimeout(() => {
          setIsLightOn(true);
      }, 100);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/otp');
    }, 2000);
  };

  // Ambient Floating Particles
  const particles = Array.from({ length: 20 });

  return (
    <div className="w-full h-screen bg-black font-sans relative overflow-hidden">
      
      {/* 1. THE SWITCH (Always visible/interactive until clicked) */}
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

      {/* 2. THE DARK ROOM (Initial State) */}
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

      {/* 3. THE MAIN CONTENT (Hidden by Darkness until Light is On) */}
      <motion.div 
        className="w-full h-full flex"
        initial={{ 
            clipPath: 'circle(0% at 50% 0%)', // Starts as a tiny dot at top center
            filter: 'brightness(0)' 
        }} 
        animate={isLightOn ? { 
            clipPath: [
                'circle(0% at 50% 0%)',    // Start
                'circle(15% at 50% 10%)',  // Flicker 1
                'circle(10% at 50% 10%)',  // Flicker off
                'circle(150% at 50% 0%)'   // Full blast
            ],
            filter: [
                'brightness(0.2)', // Dim
                'brightness(1.5)', // Flash bright
                'brightness(0.5)', // Dim
                'brightness(1)'    // Normal
            ]
        } : {}}
        transition={{ 
            duration: 1.5, 
            times: [0, 0.1, 0.2, 1], // Timing for the flicker effect
            ease: "circOut" 
        }}
      >
          
          {/* LEFT: Cinematic Image Section */}
          <motion.div 
            initial={{ x: '-10%' }} // Slight parallax start
            animate={{ x: 0 }}
            className="hidden md:block w-1/2 h-full relative overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
              alt="Fashion Model" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            
            {/* Animated Text Reveal (Only triggers after light is on) */}
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

          {/* RIGHT: Interactive Form Section */}
          <div 
            className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-8 relative bg-gray-900 group"
            onMouseMove={handleMouseMove}
          >
            {/* Top Light Source Simulation (The "Bulb" look) */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

            {/* Spotlight Effect Layer */}
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    650px circle at ${mouseX}px ${mouseY}px,
                    rgba(29, 78, 216, 0.15),
                    transparent 80%
                  )
                `,
              }}
            />

            {/* Ambient Particles */}
            {particles.map((_, i) => (
                <motion.div 
                    key={i}
                    className="absolute bg-white/10 rounded-full"
                    initial={{ 
                        x: Math.random() * window.innerWidth / 2, 
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 
                    }}
                    animate={{ 
                        y: [null, Math.random() * -100],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                        duration: Math.random() * 10 + 10, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    style={{
                        width: Math.random() * 4 + 1 + 'px',
                        height: Math.random() * 4 + 1 + 'px',
                    }}
                />
            ))}
            
            {isLightOn && (
                <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }} // Delayed until light is fully on
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
                    onClick={handleGoogleLogin}
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

                    <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl border border-white/20 bg-white/5 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 opacity-50 cursor-not-allowed grayscale"
                    >
                    <FaApple className="text-xl" />
                    <span>Continue with Apple</span>
                    </motion.button>
                </div>

                <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
                    <div className="h-[1px] w-1/3 bg-gradient-to-r from-transparent to-white/20" />
                    <span className="text-xs uppercase tracking-widest">or email</span>
                    <div className="h-[1px] w-1/3 bg-gradient-to-l from-transparent to-white/20" />
                </div>

                <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2 group/input">
                        <input 
                        type="email" 
                        disabled
                        placeholder="name@example.com" 
                        className="w-full px-6 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:outline-none transition-all opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <button disabled className="w-full py-4 bg-gray-800 rounded-xl text-gray-400 font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    Login <FaArrowRight className="text-xs" />
                    </button>
                </form>
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