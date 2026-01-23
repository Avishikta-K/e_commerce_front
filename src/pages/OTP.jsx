import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaBell, FaLock, FaFingerprint } from 'react-icons/fa';

// --- COMPONENT: SLEEK NOTIFICATION ---
const BrowserNotification = ({ code, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -150, x: '-50%', opacity: 0 }}
          animate={{ y: 30, x: '-50%', opacity: 1 }}
          exit={{ y: -150, x: '-50%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed top-0 left-1/2 z-[100] w-96 bg-[#1a1a1a] text-white p-4 rounded-xl shadow-2xl border border-white/10 flex items-start gap-4 cursor-pointer"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg shadow-lg shadow-blue-500/20">
            <FaBell className="text-sm text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide text-gray-200">AUTHENTICATOR</h4>
            <p className="text-xs text-gray-500 mt-1">Your temporary access code is:</p>
            <p className="text-2xl font-mono font-bold text-white mt-2 tracking-[0.2em]">{code.join('')}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [status, setStatus] = useState('generating');

  // Background Particles
  const particles = Array.from({ length: 20 });

  // --- SIMULATION LOGIC ---
  useEffect(() => {
    let timeouts = [];
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString().split('');
    setGeneratedCode(randomCode);
    
    // 1. Notify
    const notifTimer = setTimeout(() => {
        setStatus('notified');
        setShowNotification(true);
        
        // 2. Hide Notify & Start Biometric Auto-Fill
        const hideNotifTimer = setTimeout(() => {
            setShowNotification(false);
            
            const startFillingTimer = setTimeout(() => {
                // SWITCH TO BIOMETRIC MODE HERE
                setStatus('filling'); 

                // 3. Type digits one by one
                randomCode.forEach((digit, index) => {
                    const typeTimer = setTimeout(() => {
                        setOtp(prev => { const newOtp = [...prev]; newOtp[index] = digit; return newOtp; });
                        
                        // 4. On last digit, immediately succeed
                        if (index === 3) {
                            const successTimer = setTimeout(() => {
                                setStatus('success');
                                
                                // 5. IMMEDIATE REDIRECT (500ms delay for visual confirmation)
                                const navTimer = setTimeout(() => { 
                                    // --- CRITICAL UPDATE: PASSING STATE ---
                                    navigate('/', { state: { showIntro: true } }); 
                                }, 500);
                                timeouts.push(navTimer);
                            }, 200); 
                            timeouts.push(successTimer);
                        }
                    }, index * 250); // Speed of typing
                    timeouts.push(typeTimer);
                });
            }, 500); 
            timeouts.push(startFillingTimer);
        }, 2500);
        timeouts.push(hideNotifTimer);
    }, 1000);
    timeouts.push(notifTimer);

    return () => timeouts.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="w-full h-screen bg-black font-sans flex items-center justify-center overflow-hidden relative">
      
      <BrowserNotification code={generatedCode} isVisible={showNotification} />

      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      
      {particles.map((_, i) => (
            <motion.div 
                key={i}
                className="absolute bg-white/10 rounded-full"
                initial={{ 
                    x: Math.random() * window.innerWidth, 
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

      {/* --- MAIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[480px] p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl relative z-10 shadow-2xl"
      >
        
        {/* --- ICON STATUS --- */}
        <div className="flex justify-center mb-8 relative">
             {/* Glow behind icon */}
             <motion.div 
                animate={{ 
                    opacity: status === 'filling' ? [0.5, 0.8, 0.5] : 0.5, 
                    scale: status === 'filling' ? [1, 1.2, 1] : 1 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`absolute inset-0 blur-2xl rounded-full ${status === 'success' ? 'bg-green-500/30' : status === 'filling' ? 'bg-blue-500/40' : 'bg-blue-600/20'}`}
             />

             <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
                {/* Scanning Beam Effect during filling */}
                {status === 'filling' && (
                    <motion.div 
                        initial={{ top: '-100%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-blue-500/30 z-0 pointer-events-none border-b border-blue-400/50"
                    />
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={status === 'filling' ? 'biometric' : status === 'success' ? 'success' : 'locked'}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className={`relative z-10 ${status === 'success' ? 'text-green-400' : 'text-white'}`}
                    >
                        {status === 'success' ? (
                            <FaCheckCircle className="text-3xl" />
                        ) : status === 'filling' ? (
                            <FaFingerprint className="text-3xl text-blue-400" />
                        ) : (
                            <FaLock className="text-3xl" />
                        )}
                    </motion.div>
                </AnimatePresence>
             </div>
        </div>

        {/* --- TEXT CONTENT --- */}
        <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Verification</h2>
            <div className="h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-gray-400 text-sm font-light tracking-wide uppercase"
                    >
                        {status === 'generating' && 'Establishing secure connection...'}
                        {status === 'notified' && 'Code sent to device...'}
                        {status === 'filling' && <span className="text-blue-400 animate-pulse">Biometric Scan & Auto-Fill...</span>}
                        {status === 'success' && <span className="text-green-400 font-bold">Access Granted</span>}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>

        {/* --- INPUTS --- */}
        <div className="flex justify-between gap-3 mb-12">
            {otp.map((digit, idx) => (
                <motion.div
                    key={idx}
                    animate={{ 
                        borderColor: digit ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255,255,255,0.1)',
                        backgroundColor: digit ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
                        scale: digit ? 1.05 : 1
                    }}
                    className="w-16 h-20 rounded-xl border border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-inner relative overflow-hidden"
                >
                    <AnimatePresence>
                        {digit && (
                            <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="z-10"
                            >
                                {digit}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {/* Shine effect */}
                    {digit && <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />}
                </motion.div>
            ))}
        </div>

        {/* --- PROGRESS BAR --- */}
        <div className="w-full bg-gray-800/50 rounded-full h-1 overflow-hidden">
             <motion.div 
                className={`h-full ${status === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}
                initial={{ width: "0%" }}
                animate={{ 
                    width: status === 'generating' ? "10%" :
                           status === 'notified' ? "30%" :
                           status === 'filling' ? "80%" : "100%" 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
             />
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
                Secure Session ID: <span className="font-mono text-gray-500">8F3-9X2-11A</span>
            </p>
        </div>

      </motion.div>
    </div>
  );
};

export default OTP;