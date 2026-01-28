import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaBell, FaLock, FaFingerprint } from 'react-icons/fa';
import { supabase } from '../supabase'; // Make sure you created src/supabase.js

// --- COMPONENT: SLEEK NOTIFICATION (Visual Only) ---
const BrowserNotification = ({ isVisible }) => {
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
            <p className="text-xs text-gray-500 mt-1">Please check your email inbox for the verification code.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email;

  // Supabase uses 6 digit codes
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [showNotification, setShowNotification] = useState(false);
  const [status, setStatus] = useState('input'); // 'input', 'verifying', 'success', 'failed'

  const particles = Array.from({ length: 20 });

  useEffect(() => {
    if (!userEmail) {
        navigate('/login');
        return;
    }
    // Show notification briefly to check email
    setShowNotification(true);
    const timer = setTimeout(() => setShowNotification(false), 4000);
    return () => clearTimeout(timer);
  }, [userEmail, navigate]);

  // Handle typing in boxes
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    // Update state
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next box
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }

    // Check if full code is entered (6 digits)
    if (newOtp.every(digit => digit !== '')) {
        verifyWithSupabase(newOtp.join(''));
    }
  };

  const verifyWithSupabase = async (code) => {
    setStatus('verifying');

    try {
        // 1. Verify Token with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
            email: userEmail,
            token: code,
            type: 'email',
        });

        if (error) throw error;

        // 2. Get the JWT (Access Token)
        const supabaseToken = data.session.access_token;

        // 3. Sync with YOUR MongoDB Backend
        // This hits the route that triggers the auth middleware (which creates the user if missing)
        const backendRes = await fetch('http://localhost:5000/api/users/profile', {
            method: 'GET', // Or POST if you create a specific sync route
            headers: {
                'Authorization': `Bearer ${supabaseToken}`, // Send Supabase Token
                'Content-Type': 'application/json'
            }
        });

        if (backendRes.ok) {
            setStatus('success');
            
            // Save token for future API calls
            localStorage.setItem('authToken', supabaseToken);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', userEmail);

            setTimeout(() => { 
                navigate('/', { state: { showIntro: true } }); 
            }, 800);
        } else {
            console.error("Backend Sync Failed", backendRes.status);
            throw new Error("Backend Sync Failed");
        }

    } catch (error) {
        console.error("Verification failed", error.message);
        setStatus('failed');
        alert("Invalid Code or Connection Error. Please try again.");
        setOtp(['', '', '', '', '', '']); // Reset fields
    }
  };

  return (
    <div className="w-full h-screen bg-black font-sans flex items-center justify-center overflow-hidden relative">
      
      <BrowserNotification isVisible={showNotification} />

      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      
      {particles.map((_, i) => (
            <motion.div 
                key={i}
                className="absolute bg-white/10 rounded-full"
                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, scale: Math.random() * 0.5 }}
                animate={{ y: [null, Math.random() * -100], opacity: [0, 0.5, 0] }}
                transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
                style={{ width: Math.random() * 4 + 1 + 'px', height: Math.random() * 4 + 1 + 'px' }}
            />
        ))}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[550px] p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-8 relative">
             <motion.div 
                animate={{ 
                    opacity: status === 'verifying' ? [0.5, 0.8, 0.5] : 0.5, 
                    scale: status === 'verifying' ? [1, 1.2, 1] : 1 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`absolute inset-0 blur-2xl rounded-full ${status === 'success' ? 'bg-green-500/30' : status === 'verifying' ? 'bg-blue-500/40' : 'bg-blue-600/20'}`}
             />

             <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className={`relative z-10 ${status === 'success' ? 'text-green-400' : 'text-white'}`}
                    >
                        {status === 'success' ? (
                            <FaCheckCircle className="text-3xl" />
                        ) : status === 'verifying' ? (
                            <FaFingerprint className="text-3xl text-blue-400 animate-pulse" />
                        ) : (
                            <FaLock className="text-3xl" />
                        )}
                    </motion.div>
                </AnimatePresence>
             </div>
        </div>

        <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Authentication</h2>
            <div className="h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-gray-400 text-sm font-light tracking-wide uppercase"
                    >
                        {status === 'input' && `Enter 6-digit code sent to ${userEmail}`}
                        {status === 'verifying' && <span className="text-blue-400 animate-pulse">Verifying Security Token...</span>}
                        {status === 'success' && <span className="text-green-400 font-bold">Access Granted</span>}
                        {status === 'failed' && <span className="text-red-400">Verification Failed</span>}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>

        <div className="flex justify-between gap-2 mb-12">
            {otp.map((digit, idx) => (
                <motion.div
                    key={idx}
                    animate={{ 
                        borderColor: digit ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255,255,255,0.1)',
                        backgroundColor: digit ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
                        scale: digit ? 1.05 : 1
                    }}
                    className="w-12 h-16 md:w-14 md:h-20 rounded-xl border border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-inner relative overflow-hidden"
                >
                    <input
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={e => handleChange(e.target, idx)}
                        onFocus={e => e.target.select()}
                        className="absolute inset-0 w-full h-full bg-transparent text-center outline-none cursor-text text-white"
                        style={{ caretColor: 'transparent' }} 
                    />
                    {digit && <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />}
                </motion.div>
            ))}
        </div>

        <div className="w-full bg-gray-800/50 rounded-full h-1 overflow-hidden">
             <motion.div 
                className={`h-full ${status === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}
                initial={{ width: "0%" }}
                animate={{ 
                    width: status === 'input' ? "10%" :
                           status === 'verifying' ? "80%" : 
                           status === 'success' ? "100%" : "10%" 
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