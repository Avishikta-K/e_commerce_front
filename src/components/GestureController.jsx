import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaVideoSlash, 
  FaHandPaper, 
  FaArrowsAltH, 
  FaArrowsAltV, 
  FaHandRock, 
  FaLock, 
  FaUnlock,
  FaMousePointer,
  FaHandPointUp
} from 'react-icons/fa';

const GestureController = () => {
  const webcamRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Off");
  
  // UI State
  const [scrollMode, setScrollMode] = useState("vertical"); 
  
  // Logic Refs
  const scrollModeRef = useRef("vertical"); 
  const [showToggleFeedback, setShowToggleFeedback] = useState(false);

  // --- CURSOR REFS ---
  const cursorRef = useRef(null); 
  const lastClickTime = useRef(0);
  const isPinchingRef = useRef(false);

  // --- PHYSICS & SCROLL REFS ---
  const targetScrollY = useRef(window.scrollY);
  
  // --- TRACKING REFS ---
  const smoothX = useRef(null);
  const smoothY = useRef(null);
  const prevPos = useRef({ x: null, y: null });
  
  // --- TOGGLE LOGIC REFS ---
  const lastToggleTime = useRef(0);
  const TOGGLE_COOLDOWN = 2000; // Increased cooldown to prevent rapid switching
  const CLICK_COOLDOWN = 500; 
  
  // --- CONFIGURATION ---
  const VERTICAL_SENSITIVITY = 2200; 
  const HORIZONTAL_SENSITIVITY = 3000; 
  const INPUT_SMOOTHING = 0.5; 
  const MOVEMENT_THRESHOLD = 0.002; 
  const EASING = 0.08; 
  const PINCH_THRESHOLD = 0.05; 

  // Calculate distance between two landmarks
  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  useEffect(() => {
    let camera = null;
    let hands = null;
    let animationFrameId = null;

    // --- VERTICAL PHYSICS LOOP ---
    const updatePhysics = () => {
      if (isListening) {
        if (scrollModeRef.current === 'vertical') {
            const diff = targetScrollY.current - window.scrollY;
            if (Math.abs(diff) > 0.5) {
                const nextY = window.scrollY + diff * EASING;
                window.scrollTo(0, nextY);
            }
        } else if (scrollModeRef.current === 'horizontal') {
            targetScrollY.current = window.scrollY;
        }
        animationFrameId = requestAnimationFrame(updatePhysics);
      }
    };

    if (isListening) {
      targetScrollY.current = window.scrollY;
      updatePhysics();

      const script1 = document.createElement('script');
      script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
      script1.async = true;
      
      const script2 = document.createElement('script');
      script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
      script2.async = true;

      document.body.appendChild(script1);
      document.body.appendChild(script2);

      const init = async () => {
        while (!window.Hands || !window.Camera) {
          await new Promise(r => setTimeout(r, 100));
        }

        hands = new window.Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        // Updated to support 2 hands (Left for toggle, Right for control)
        hands.setOptions({
            maxNumHands: 2, 
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });

        hands.onResults(onResults);

        if (webcamRef.current && webcamRef.current.video) {
            camera = new window.Camera(webcamRef.current.video, {
            onFrame: async () => {
                if (webcamRef.current && webcamRef.current.video) {
                await hands.send({ image: webcamRef.current.video });
                }
            },
            width: 640,
            height: 480
            });
            camera.start();
            setStatus("Initializing...");
        }
      };

      init();

      return () => {
        if (camera) camera.stop();
        if (hands) hands.close();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if(document.body.contains(script1)) document.body.removeChild(script1);
        if(document.body.contains(script2)) document.body.removeChild(script2);
        
        smoothX.current = null;
        smoothY.current = null;
        scrollModeRef.current = "vertical"; 
      };
    } else {
      setStatus("Off");
    }
  }, [isListening]);


  // --- HANDLER: SWITCH MODE (Triggered by Left Hand) ---
  const handleModeSwitch = () => {
    const now = Date.now();
    if (now - lastToggleTime.current > TOGGLE_COOLDOWN) {
        let nextMode = 'vertical';
        if (scrollModeRef.current === 'vertical') nextMode = 'horizontal';
        else if (scrollModeRef.current === 'horizontal') nextMode = 'cursor';
        else nextMode = 'vertical';
        
        scrollModeRef.current = nextMode; 
        setScrollMode(nextMode);         
        
        lastToggleTime.current = now;
        
        setShowToggleFeedback(true);
        setTimeout(() => setShowToggleFeedback(false), 1000);
        
        // Reset trackers
        targetScrollY.current = window.scrollY;
        prevPos.current = { x: null, y: null };
        smoothX.current = null;
        smoothY.current = null;
    }
  };

  // --- HANDLER: CONTROL (Triggered by Right Hand) ---
  const handleControlHand = (handLandmarks) => {
    const now = Date.now();
    const rawX = handLandmarks[8].x; // Index Finger Tip
    const rawY = handLandmarks[8].y;

    // Initialize smoothing if null
    if (smoothX.current === null) {
      smoothX.current = rawX;
      smoothY.current = rawY;
      prevPos.current = { x: rawX, y: rawY };
    }

    // Low Pass Filter (Smoothing)
    smoothX.current = smoothX.current + (rawX - smoothX.current) * INPUT_SMOOTHING;
    smoothY.current = smoothY.current + (rawY - smoothY.current) * INPUT_SMOOTHING;

    // --- MODE: SELECTION / CURSOR ---
    if (scrollModeRef.current === 'cursor') {
        const screenX = (1 - smoothX.current) * window.innerWidth;
        const screenY = smoothY.current * window.innerHeight;

        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
        }

        // Pinch Logic (Index Tip vs Thumb Tip)
        const distance = getDistance(handLandmarks[8], handLandmarks[4]);
        
        if (distance < PINCH_THRESHOLD) {
            if (!isPinchingRef.current && (now - lastClickTime.current > CLICK_COOLDOWN)) {
                isPinchingRef.current = true;
                lastClickTime.current = now;

                if (cursorRef.current) cursorRef.current.style.background = 'yellow';

                const element = document.elementFromPoint(screenX, screenY);
                if (element) {
                    element.click();
                }
            }
        } else {
            isPinchingRef.current = false;
            if (cursorRef.current) cursorRef.current.style.background = 'rgba(239, 68, 68, 0.8)'; 
        }
        return; 
    }

    // --- MODE: SCROLLING ---
    const deltaX = prevPos.current.x - smoothX.current;
    const deltaY = smoothY.current - prevPos.current.y; 
    prevPos.current = { x: smoothX.current, y: smoothY.current };

    if (scrollModeRef.current === 'vertical') {
        if (Math.abs(deltaY) > MOVEMENT_THRESHOLD) {
            targetScrollY.current += deltaY * VERTICAL_SENSITIVITY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollY.current = Math.max(0, Math.min(targetScrollY.current, maxScroll));
        }
    } else if (scrollModeRef.current === 'horizontal') {
        if (Math.abs(deltaX) > MOVEMENT_THRESHOLD) {
            const scrollAmount = deltaX * HORIZONTAL_SENSITIVITY;
            const event = new CustomEvent('gesture-scroll-x', { detail: { amount: scrollAmount } });
            window.dispatchEvent(event);
        }
    }
  };

  const onResults = (results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setStatus("No Hand");
      prevPos.current = { x: null, y: null };
      if (scrollModeRef.current === 'vertical') targetScrollY.current = window.scrollY;
      return;
    }
    
    setStatus("Active");

    const hands = results.multiHandLandmarks;
    const handedness = results.multiHandedness;

    let controlHandDetected = false;

    // Iterate through detected hands
    for (let i = 0; i < hands.length; i++) {
        const label = handedness[i].label; 
        const landmarks = hands[i];

        // NOTE: In Selfie Mode (mirrored), MediaPipe usually labels:
        // Your Real RIGHT Hand -> "Left"
        // Your Real LEFT Hand  -> "Right"
        
        // 1. Check for Left Hand (labeled "Right") -> TOGGLE
        if (label === "Right") {
            handleModeSwitch();
        }

        // 2. Check for Right Hand (labeled "Left") -> CONTROL
        if (label === "Left") {
            handleControlHand(landmarks);
            controlHandDetected = true;
        }
    }

    // If Control hand is lost, reset tracking
    if (!controlHandDetected) {
        prevPos.current = { x: null, y: null };
        smoothX.current = null;
        smoothY.current = null;
    }
  };

  return (
    <>
        {/* --- CUSTOM MOUSE CURSOR --- */}
        <div 
            ref={cursorRef}
            className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-white pointer-events-none z-[99999]"
            style={{ 
                opacity: (isListening && scrollMode === 'cursor') ? 1 : 0,
                background: 'rgba(239, 68, 68, 0.8)',
                boxShadow: '0 0 10px rgba(255,0,0,0.5)',
                transition: 'opacity 0.2s',
                willChange: 'transform'
            }}
        />

        {/* --- BIG MODE CHANGE INDICATOR --- */}
        <AnimatePresence>
            {showToggleFeedback && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="fixed inset-0 pointer-events-none flex items-center justify-center z-[10000]"
                >
                    <div className="bg-black/80 backdrop-blur-xl text-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
                        <div className="text-6xl text-blue-500">
                            {scrollMode === 'vertical' && <FaArrowsAltV />}
                            {scrollMode === 'horizontal' && <FaArrowsAltH />}
                            {scrollMode === 'cursor' && <FaMousePointer />}
                        </div>
                        <h2 className="text-2xl font-bold uppercase tracking-widest">
                            {scrollMode === 'vertical' && 'Vertical Scroll'}
                            {scrollMode === 'horizontal' && 'Side Scroll'}
                            {scrollMode === 'cursor' && 'Selection Mode'}
                        </h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- CONTROLLER UI --- */}
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none gap-3">
        
        <AnimatePresence>
            {isListening && (
            <motion.div 
                initial={{ opacity: 0, x: 20, scale: 0.9 }} 
                animate={{ opacity: 1, x: 0, scale: 1 }} 
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="bg-black/80 backdrop-blur-md text-white p-3 rounded-xl border border-blue-500/30 pointer-events-auto shadow-2xl origin-bottom-right"
            >
                <div className="relative w-32 h-24 overflow-hidden rounded-lg mb-2 border border-gray-700">
                    <Webcam ref={webcamRef} className="absolute w-full h-full object-cover transform scale-x-[-1]" />
                    <div className="absolute top-2 left-2 bg-black/50 p-1 rounded backdrop-blur-sm">
                        {scrollMode === 'vertical' && <FaArrowsAltV size={12}/>}
                        {scrollMode === 'horizontal' && <FaArrowsAltH size={12}/>}
                        {scrollMode === 'cursor' && <FaMousePointer size={12}/>}
                    </div>
                </div>
                
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                        <span className="text-gray-400">Status</span>
                        <span className={status === "Active" ? "text-green-400" : "text-yellow-400"}>{status}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold border-t border-gray-700 pt-1 mt-1">
                        <span className="text-gray-400">Switch</span>
                        <span className="text-blue-400 flex items-center gap-1">
                             <FaHandPaper size={10} /> Show Left Hand
                        </span>
                    </div>
                    {/* Instructions based on mode */}
                    <div className="text-[9px] text-gray-500 mt-1 italic">
                        {scrollMode === 'cursor' ? "R-Hand Point & Pinch" : "R-Hand Open to Scroll"}
                    </div>
                </div>

            </motion.div>
            )}
        </AnimatePresence>

        {/* Toggle Button */}
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
            <motion.button
            onClick={() => setIsListening(!isListening)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-2 group ${
                isListening 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]' 
                : 'bg-white border-gray-200 text-gray-800 hover:border-blue-500 hover:text-blue-500'
            }`}
            >
            {isListening && (
                <motion.span 
                    className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}

            {isListening ? <FaVideoSlash size={24} /> : <FaHandPaper size={24} />}
            </motion.button>
            
            <motion.div 
            className="flex items-center gap-2 text-[10px] text-gray-500 font-bold bg-white/90 px-3 py-1 rounded-full backdrop-blur shadow-sm border border-gray-200"
            >
                <AnimatePresence mode="wait">
                    {scrollMode === 'vertical' && (
                        <motion.div key="v" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-10, opacity:0}} className="flex items-center gap-2">
                            <span>Vertical Scroll</span>
                            <FaLock className="text-blue-400" size={10}/>
                        </motion.div>
                    )}
                    {scrollMode === 'horizontal' && (
                        <motion.div key="h" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-10, opacity:0}} className="flex items-center gap-2">
                            <span>Side Scroll</span>
                            <FaUnlock className="text-orange-400" size={10}/>
                        </motion.div>
                    )}
                    {scrollMode === 'cursor' && (
                        <motion.div key="c" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-10, opacity:0}} className="flex items-center gap-2">
                            <span>Selection</span>
                            <FaMousePointer className="text-red-400" size={10}/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

        </div>
        </div>
    </>
  );
};

export default GestureController;