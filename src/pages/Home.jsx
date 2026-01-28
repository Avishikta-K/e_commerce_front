import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { 
  FaArrowRight, FaTruck, FaShieldAlt, FaHeadset, FaTag, FaFire, FaPaperPlane, 
  FaSnowflake, FaClock, FaCalendarAlt, FaSun, FaUmbrella, FaAdjust,
  FaCanadianMapleLeaf, FaGlassCheers, FaStar, FaShoppingBag, FaHeart
} from 'react-icons/fa';
import { motion, AnimatePresence, useScroll, useAnimation } from 'framer-motion';

// --- INTRO OVERLAY COMPONENT ---
const IntroOverlay = ({ onComplete }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.8 } }}
    >
      <div className="relative z-20 flex items-center gap-2 md:gap-4 overflow-hidden">
        <motion.h1 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-8xl font-bold text-white tracking-tighter"
        >
          FASHION
        </motion.h1>
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-2 h-8 md:h-16 bg-blue-500" 
        />
        <motion.h1 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-600 tracking-tighter"
        >
          STORE
        </motion.h1>
      </div>

      <motion.div className="mt-8 h-[2px] bg-white/20 w-64 rounded-full overflow-hidden relative z-20">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          onAnimationComplete={onComplete} 
          className="h-full bg-blue-500"
        />
      </motion.div>

      <motion.div 
        initial={{ height: "50%" }}
        exit={{ height: "0%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 w-full bg-[#0a0a0a] z-10"
      />
      <motion.div 
        initial={{ height: "50%" }}
        exit={{ height: "0%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 left-0 w-full bg-[#0a0a0a] z-10"
      />
    </motion.div>
  );
};

// --- CUSTOM REVEAL COMPONENT ---
const Reveal = ({ children, variants, className, transition }) => {
  const controls = useAnimation();

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={controls}
      className={className}
      transition={transition}
      onViewportEnter={() => {
        controls.start("visible");
      }}
      onViewportLeave={(entry) => {
        if (entry && entry.boundingClientRect.top > 0) {
          controls.start("hidden");
        }
      }}
      viewport={{ once: false, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// --- DATA SECTIONS ---

// ⚠️ RENAMED TO DEFAULT SLIDES (Fallback)
const defaultSlides = [
  { id: 1, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1500&q=80", title: "Discover Your New Look", subtitle: "Explore our latest collection of trendy and comfortable garments." },
  { id: 2, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1500&q=80", title: "Summer Essentials", subtitle: "Lightweight fabrics and vibrant colors for the perfect sunny day." },
  { id: 3, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1500&q=80", title: "Winter Collection", subtitle: "Stay warm and stylish with our premium outerwear selection." }
];

const trendingProducts = [
  { id: 1, name: "Urban Oversized Tee", price: 45, rating: 4.8, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", tag: "HOT", size: "large" },
  { id: 2, name: "Velvet Bomber", price: 120, rating: 4.9, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", tag: "NEW", size: "normal" },
  { id: 3, name: "Floral Sundress", price: 65, rating: 4.7, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", tag: "SALE", size: "normal" },
  { id: 4, name: "Vintage Denim Jacket", price: 85, rating: 4.6, image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80", tag: null, size: "wide" }, 
  { id: 5, name: "Leather Weekender", price: 150, rating: 5.0, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", tag: "LIMITED", size: "normal" },
  { id: 6, name: "Classic Beige Trench", price: 180, rating: 4.9, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80", tag: null, size: "normal" },
  { id: 7, name: "Running Sneakers", price: 95, rating: 4.5, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", tag: "BESTSELLER", size: "normal" },
  { id: 8, name: "Retro Sunglasses", price: 35, rating: 4.4, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80", tag: null, size: "normal" },
];

const categories = [
  { 
    id: 1, 
    name: "Women's Fashion", 
    desc: "Elegance meets comfort.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80", 
    link: "/shop#women",
    color: "from-pink-500/80 to-purple-600/80" 
  },
  { 
    id: 2, 
    name: "Men's Collection", 
    desc: "Sharp looks for every occasion.",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80", 
    link: "/shop#men",
    color: "from-blue-600/80 to-slate-800/80"
  },
  { 
    id: 3, 
    name: "Accessories", 
    desc: "The perfect finishing touch.",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80", 
    link: "/shop#accessories",
    color: "from-amber-500/80 to-orange-700/80"
  },
  { 
    id: 4, 
    name: "Footwear", 
    desc: "Step out in style.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80", 
    link: "/shop#footwear",
    color: "from-emerald-500/80 to-teal-800/80"
  },
];

const services = [
  { icon: <FaTruck />, title: "Free Shipping", desc: "On all orders over $50" },
  { icon: <FaShieldAlt />, title: "Secure Payment", desc: "100% secure payment" },
  { icon: <FaHeadset />, title: "24/7 Support", desc: "Dedicated support" },
];

// --- PARTICLE GENERATORS ---
const generateConfetti = (count = 80) => {
  const colors = ['#FFC700', '#FF0000', '#2E3192', '#41BBC7', '#73FF77', '#FF00FF'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    yStart: -10 - Math.random() * 50,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 6,
    rotationDuration: Math.random() * 2 + 1,
    fallDuration: Math.random() * 5 + 4,
    delay: Math.random() * 5,
    shape: Math.random() > 0.5 ? '50%' : '2px'
  }));
};

const fireworkSystems = [
  { id: 1, x: 20, y: 30, color: '#ff0044', delay: 0 },
  { id: 2, x: 80, y: 25, color: '#00ffcc', delay: 1.5 },
  { id: 3, x: 50, y: 15, color: '#ffcc00', delay: 3 },
  { id: 4, x: 30, y: 40, color: '#aa00ff', delay: 4.5 },
  { id: 5, x: 70, y: 35, color: '#00ccff', delay: 6 },
];

// SEASON CONFIGURATION
const SEASON_CONFIG = {
  winter: { key: 'winter', title: "Winter Wonderland", subtitle: "Cozy styles are dropping fast.", gradient: "bg-gradient-to-b from-[#0f172a] via-[#1e3c72] to-[#2a5298]", icon: <FaSnowflake />, accent: "text-blue-100", linkHash: "/shop#winter", saleMonth: 11, saleDayStart: 20, saleDayEnd: 25 },
  summer: { key: 'summer', title: "Summer Sunshine", subtitle: "Bright looks for hot days.", gradient: "bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#fde047]", icon: <FaSun />, accent: "text-yellow-100", linkHash: "/shop#summer", saleMonth: 5, saleDayStart: 1, saleDayEnd: 5 },
  autumn: { key: 'autumn', title: "Autumn Breeze", subtitle: "Fall in love with layers.", gradient: "bg-gradient-to-b from-[#451a03] via-[#92400e] to-[#d97706]", icon: <FaCanadianMapleLeaf />, accent: "text-orange-100", linkHash: "/shop#autumn", saleMonth: 9, saleDayStart: 10, saleDayEnd: 15 },
  rainy: { key: 'rainy', title: "Monsoon Madness", subtitle: "Stay dry, look fly.", gradient: "bg-gradient-to-b from-[#111827] via-[#374151] to-[#0d9488]", icon: <FaUmbrella />, accent: "text-teal-100", linkHash: "/shop#rainy", saleMonth: 7, saleDayStart: 15, saleDayEnd: 20 },
  newyear: { key: 'newyear', title: "New Year Bash", subtitle: "Ring in the new year with grand styles!", gradient: "bg-gradient-to-b from-[#000000] via-[#240b36] to-[#c31432]", icon: <FaGlassCheers />, accent: "text-yellow-200", linkHash: "/shop#newyear", saleMonth: 0, saleDayStart: 1, saleDayEnd: 7 }
};

// --- ANIMATION VARIANTS ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, duration: 0.5 } } };

// Smooth Staggered Entrance
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

const fireAnimation = { animate: { scale: [1, 1.2, 1], color: ["#ef4444", "#f97316", "#ef4444"], transition: { duration: 1.5, repeat: Infinity } } };
const swingAnimation = { animate: { rotate: [0, 10, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } } };

// --- SUB-COMPONENTS (Confetti, FireworkBurst) ---
const Confetti = () => {
  const pieces = useMemo(() => generateConfetti(70), []);
  return (
    <>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute z-40"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            backgroundColor: p.color,
            borderRadius: p.shape,
          }}
          initial={{ y: `${p.yStart}vh`, rotateX: 0, rotateY: 0, opacity: 1 }}
          animate={{
            y: '120vh',
            rotateX: 360 * 4,
            rotateY: 180 * 4,
            x: [0, 20, -20, 0],
            opacity: [1, 1, 0.8]
          }}
          transition={{
            duration: p.fallDuration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
            x: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      ))}
    </>
  );
};

const FireworkBurst = ({ x, y, color, delay }) => {
  const particleCount = 24;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = (i * 360) / particleCount;
    return {
      id: i,
      angle: angle * (Math.PI / 180),
      velocity: 100 + Math.random() * 80,
    };
  });

  return (
    <div className="absolute w-0 h-0" style={{ left: `${x}%`, top: `${y}%` }}>
      <motion.div
        initial={{ y: 500, height: 0, opacity: 0 }}
        animate={{ y: [500, 0], height: [60, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, delay: delay, repeat: Infinity, repeatDelay: 5, ease: "easeOut" }}
        className="absolute bottom-0 w-1 rounded-full bg-white/50 -translate-x-1/2"
        style={{ boxShadow: `0 0 10px ${color}` }}
      />
      <motion.div 
         initial={{ scale: 0, opacity: 0 }}
         animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
         transition={{ duration: 0.4, delay: delay + 1.5, repeat: Infinity, repeatDelay: 6.1 }}
         className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-white z-20 blur-sm"
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}, 0 0 10px white` }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.velocity,
            y: [0, Math.sin(p.angle) * p.velocity + 60],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2, delay: delay + 1.5, repeat: Infinity, repeatDelay: 4.5, ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// --- CINEMATIC HERO COMPONENT (Updated to accept slides prop) ---
const CinematicHero = ({ slides = [] }) => {
  // Use default if slides is empty
  const activeSlides = slides.length > 0 ? slides : defaultSlides; 

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    // Safety check: if activeSlides changes length (e.g. from 0 to X), reset index to prevent out of bounds
    if(currentIndex >= activeSlides.length) setCurrentIndex(0);

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [currentIndex, activeSlides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    initial: { clipPath: 'circle(0% at 50% 50%)' },
    animate: { 
      clipPath: 'circle(150% at 50% 50%)',
      transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] } 
    },
    exit: { 
      clipPath: 'circle(0% at 50% 50%)', 
      transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] } 
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0, y: -20, 
      transition: { duration: 0.3, ease: "easeIn" } 
    }
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Safe Access to current slide
  const currentSlide = activeSlides[currentIndex] || defaultSlides[0];

  return (
    <div className="relative h-[700px] w-full overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ zIndex: 1 }}
        >
          <motion.img 
            src={currentSlide.image} 
            alt="Hero" 
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-4 pointer-events-none">
        <AnimatePresence mode="wait">
            <motion.div 
              key={`text-${currentIndex}`}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-xl pointer-events-auto"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  
                  <motion.div variants={childVariants} className="flex items-center gap-3 text-blue-300 font-bold uppercase tracking-widest text-sm mb-4">
                     <span className="w-8 h-[2px] bg-blue-400"></span>
                     Trending Collection
                  </motion.div>
                  
                  <motion.h1 variants={childVariants} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {currentSlide.title ? currentSlide.title.split(" ").map((word, i) => (
                      <span key={i} className="inline-block mr-3">{word}</span>
                    )) : "New Arrival"}
                  </motion.h1>
                  
                  <motion.p variants={childVariants} className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {currentSlide.subtitle}
                  </motion.p>

                  <motion.div variants={childVariants} className="flex gap-4">
                    <Link to="/shop" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg group/btn">
                      Shop Now 
                      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/lookbook" className="px-8 py-4 rounded-full border border-white/30 text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center">
                      View Lookbook
                    </Link>
                  </motion.div>
              </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 right-4 md:right-10 z-30 flex items-center gap-6">
        <div className="flex gap-2">
           {activeSlides.map((_, idx) => (
             <button
               key={idx}
               onClick={() => handleDotClick(idx)}
               className={`h-1 transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-12 bg-blue-400' : 'w-4 bg-white/30 hover:bg-white/60'}`}
             />
           ))}
        </div>
        <div className="flex gap-2">
          <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <FaArrowRight className="rotate-180" />
          </button>
          <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <FaArrowRight />
          </button>
        </div>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 6, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-40"
      />
    </div>
  );
};


const Home = () => {
  const location = useLocation(); 
  const [showIntro, setShowIntro] = useState(location.state?.showIntro || false); 
  const [time, setTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({});
  const [saleStatus, setSaleStatus] = useState("UPCOMING");
  const [currentSeason, setCurrentSeason] = useState('winter');
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(1);

  // --- NEW: API SLIDES STATE ---
  const [apiSlides, setApiSlides] = useState([]);

  // --- NEW: FETCH API BANNERS ---
  useEffect(() => {
    const fetchBanners = async () => {
        try {
            const res = await fetch('https://fashion-store-ak.onrender.com/api/banners');
            const data = await res.json();
            if(Array.isArray(data) && data.length > 0) {
                setApiSlides(data);
            }
        } catch(err) {
            console.log("Using default slides due to error or empty API");
        }
    };
    fetchBanners();
  }, []);

  // --- STANDARD EFFECTS ---
  const snowflakes = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 5, duration: 5 + Math.random() * 5, size: Math.random() * 20 + 10 })), []);
  const stars = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({ id: i, top: Math.random() * 60, left: Math.random() * 100, size: Math.random() * 3 + 1, delay: Math.random() * 3 })), []);
  const raindrops = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 2, duration: 0.5 + Math.random() * 0.5 })), []);
  const leaves = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 5, duration: 6 + Math.random() * 4, color: i % 2 === 0 ? '#d97706' : '#ef4444', size: Math.random() * 35 + 30 })), []);
  const clouds = useMemo(() => Array.from({ length: 4 }).map((_, i) => ({ id: i, top: 10 + Math.random() * 20, delay: i * 5, duration: 20 + Math.random() * 10 })), []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const seasonData = SEASON_CONFIG[currentSeason];
      let currentYear = now.getFullYear();
      let start = new Date(currentYear, seasonData.saleMonth, seasonData.saleDayStart, 0, 0, 0);
      let end = new Date(currentYear, seasonData.saleMonth, seasonData.saleDayEnd, 23, 59, 59);

      if (now > end) { start.setFullYear(currentYear + 1); end.setFullYear(currentYear + 1); }

      let targetDate;
      let status;

      if (now < start) { targetDate = start; status = "UPCOMING"; }
      else if (now >= start && now <= end) { targetDate = end; status = "ACTIVE"; }
      else { status = "ENDED"; setSaleStatus(status); setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }

      setSaleStatus(status);
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [currentSeason]);

  const secondsDegrees = (time.getSeconds() / 60) * 360;
  const minutesDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hoursDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;
  const config = SEASON_CONFIG[currentSeason];
    
  const getSaleDateString = () => {
    const now = new Date();
    let year = now.getFullYear();
    const endTest = new Date(year, config.saleMonth, config.saleDayEnd);
    if (now > endTest) year++; 
    const start = new Date(year, config.saleMonth, config.saleDayStart);
    const end = new Date(year, config.saleMonth, config.saleDayEnd);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }

  return (
    <div className="font-sans">
      
      {/* --- CONDITIONAL INTRO --- */}
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
        
      {/* PASS API SLIDES TO CINEMATIC HERO */}
      <CinematicHero slides={apiSlides} />

      {/* SERVICES */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" 
            variants={containerVariants} 
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants} className="flex flex-col items-center group">
                <motion.div className="text-4xl text-gray-800 mb-4" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>{service.icon}</motion.div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-500">{service.desc}</p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* ANIMATED CATEGORIES */}
      <Reveal 
        className="max-w-7xl mx-auto px-4 py-20"
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-center mb-16 flex items-center justify-center">
          <motion.div 
            variants={swingAnimation} 
            animate="animate" 
            className="relative flex items-center justify-center mr-3"
          >
            <FaTag className="text-blue-600 text-6xl transform rotate-90 drop-shadow-lg" />
            <span className="absolute text-white text-2xl font-black mt-1 ml-1">S</span>
          </motion.div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 inline-block pb-2">
            hop by Category
          </span>
        </motion.h2>

        <motion.div className="flex flex-col md:flex-row h-[600px] md:h-[500px] gap-4" variants={fadeInUp}>
          {categories.map((cat) => {
            const isActive = hoveredCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                onHoverStart={() => setHoveredCategory(cat.id)}
                onClick={() => setHoveredCategory(cat.id)}
                layout 
                variants={fadeInUp} 
                className={`relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 ease-out`}
                animate={{ 
                  flex: isActive ? 3 : 1,
                  filter: isActive ? "grayscale(0%)" : "grayscale(100%) brightness(0.7)"
                }}
              >
                <Link to={cat.link} className="block w-full h-full relative group">
                  <motion.img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-black/80 via-black/20 to-transparent' : 'from-black/90 to-transparent'} transition-all duration-300`} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                        <motion.div 
                          key="active"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          className="text-white"
                        >
                          <div className={`inline-block px-3 py-1 mb-2 rounded-full text-xs font-bold bg-gradient-to-r ${cat.color} uppercase tracking-wider`}>
                            Featured
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{cat.name}</h3>
                          <p className="text-gray-300 mb-6 max-w-xs text-sm md:text-base">{cat.desc}</p>
                          <div className="flex items-center gap-3 group/btn">
                            <span className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover/btn:w-32 transition-all duration-300 overflow-hidden relative">
                              <FaArrowRight className="absolute group-hover/btn:translate-x-20 transition-transform duration-300" />
                              <span className="absolute opacity-0 group-hover/btn:opacity-100 font-bold text-sm whitespace-nowrap pl-2">Explore Now</span>
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="inactive"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hidden md:flex items-center justify-center h-full absolute inset-0"
                        >
                           <h3 className="text-2xl font-bold text-white/50 tracking-[0.2em] uppercase transform -rotate-90 whitespace-nowrap">
                            {cat.name}
                          </h3>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!isActive && (
                      <div className="md:hidden absolute bottom-4 left-4">
                        <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Reveal>

      {/* --- SEASONAL SECTION --- */}
      <div className={`relative w-full h-[650px] md:h-[600px] overflow-hidden transition-colors duration-1000 ease-in-out flex items-center justify-center pt-20 md:pt-24 ${config.gradient}`}>
        
        {/* BACKGROUNDS (State Based, not Scroll Based) */}
        <AnimatePresence mode="wait">
            {currentSeason === 'winter' && (
                <motion.div key="winter-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                    <motion.div animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 40px rgba(255,255,255,0.5)", "0 0 80px rgba(255,255,255,0.8)", "0 0 40px rgba(255,255,255,0.5)"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-8 right-8 md:top-12 md:right-24 w-24 h-24 bg-gray-100 rounded-full z-0">
                        <div className="absolute top-4 left-4 w-4 h-4 bg-gray-200 rounded-full opacity-50"></div>
                        <div className="absolute bottom-6 right-6 w-6 h-6 bg-gray-200 rounded-full opacity-50"></div>
                    </motion.div>
                    {stars.map((star) => (
                        <motion.div key={`star-${star.id}`} className="absolute bg-white rounded-full" style={{ top: `${star.top}%`, left: `${star.left}%`, width: `${star.size}px`, height: `${star.size}px` }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: star.delay, ease: "easeInOut" }} />
                    ))}
                    {snowflakes.map((flake) => (
                        <motion.div key={`snow-${flake.id}`} initial={{ y: -50, opacity: 0 }} animate={{ y: 650, opacity: [0, 1, 0], rotate: 360 }} transition={{ duration: flake.duration, repeat: Infinity, delay: flake.delay, ease: "linear" }} className="absolute text-blue-100 text-opacity-70 z-10" style={{ left: `${flake.left}%`, fontSize: `${flake.size}px` }}> <FaSnowflake /> </motion.div>
                    ))}
                </motion.div>
            )}

            {currentSeason === 'summer' && (
                <motion.div key="summer-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute -top-20 -right-20 text-yellow-300 opacity-80 z-0"><FaSun size={300} /></motion.div>
                    {clouds.map((cloud) => (
                        <motion.div key={`cloud-${cloud.id}`} initial={{ x: -200, opacity: 0 }} animate={{ x: '120vw', opacity: 0.8 }} transition={{ duration: cloud.duration, repeat: Infinity, delay: cloud.delay, ease: "linear" }} className="absolute text-white opacity-60 z-10" style={{ top: `${cloud.top}%` }}>
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24"><path d="M17 19C19.2091 19 21 17.2091 21 15C21 12.7909 19.2091 11 17 11C16.969 11 16.9382 11.0007 16.9077 11.0021C16.6343 7.64478 13.8248 5 10.5 5C7.03966 5 4.14586 7.68337 3.61908 11.092C1.56455 11.751 0 13.6738 0 16C0 18.7614 2.23858 21 5 21H17Z"/></svg>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {currentSeason === 'autumn' && (
                <motion.div key="autumn-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                    {leaves.map((leaf) => (
                        <motion.div key={`leaf-${leaf.id}`} initial={{ y: -50, opacity: 0, x: 0 }} animate={{ y: 650, opacity: [0, 1, 0], x: [0, 50, -50, 0], rotate: 360 }} transition={{ duration: leaf.duration, repeat: Infinity, delay: leaf.delay, ease: "linear" }} className="absolute z-10" style={{ left: `${leaf.left}%`, color: leaf.color, fontSize: `${leaf.size}px` }}> <FaCanadianMapleLeaf /> </motion.div>
                    ))}
                </motion.div>
            )}

            {currentSeason === 'rainy' && (
                <motion.div key="rainy-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                    <motion.div animate={{ opacity: [0, 0, 0.3, 0, 0] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }} className="absolute inset-0 bg-white z-0 pointer-events-none" />
                    {raindrops.map((drop) => (
                        <motion.div key={`rain-${drop.id}`} initial={{ y: -20, opacity: 0 }} animate={{ y: 700, opacity: [0, 0.7, 0] }} transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }} className="absolute bg-blue-200 opacity-60 rounded-full z-10" style={{ left: `${drop.left}%`, width: '2px', height: '20px' }} />
                    ))}
                </motion.div>
            )}

            {currentSeason === 'newyear' && (
                <motion.div key="newyear-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 overflow-hidden">
                    <Confetti />
                    {fireworkSystems.map((sys) => (
                      <FireworkBurst key={sys.id} x={sys.x} y={sys.y} color={sys.color} delay={sys.delay} />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>

        {/* FOREGROUND CONTENT */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-7xl px-4 pb-16">
          
          {/* LEFT: INFO & CLOCK - Wrapped in Reveal */}
          <Reveal 
            key={currentSeason}
            variants={{
                hidden: { x: -50, opacity: 0 },
                visible: { x: 0, opacity: 1 }
            }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left text-white flex-1"
          >
              <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full font-bold text-sm mb-4 shadow-lg uppercase tracking-wider">
                <span className={`flex items-center gap-2 ${config.accent}`}>
                   <span className="animate-spin-slow">{config.icon}</span> {config.title.split(' ')[0]} Collection
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-xl font-serif">
                {config.title}
              </h2>
              <p className={`${config.accent} text-lg mb-8 max-w-xl drop-shadow-md`}>
                {config.subtitle}
              </p>
              
              <div className="flex flex-col items-center md:items-start">
               <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 30}deg)` }}>
                        <div className="w-1 h-3 bg-white/60 mt-1" />
                    </div>
                  ))}
                  <div className="absolute w-1.5 h-10 bg-white left-1/2 bottom-1/2 rounded-full origin-bottom z-10" style={{ transform: `translateX(-50%) rotate(${hoursDegrees}deg)` }}></div>
                  <div className="absolute w-1 h-14 bg-blue-200 left-1/2 bottom-1/2 rounded-full origin-bottom z-20" style={{ transform: `translateX(-50%) rotate(${minutesDegrees}deg)` }}></div>
                  <div className="absolute w-0.5 h-16 bg-red-400 left-1/2 bottom-1/2 rounded-full origin-bottom z-30" style={{ transform: `translateX(-50%) rotate(${secondsDegrees}deg)` }}></div>
                  <div className="absolute w-3 h-3 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md z-40"></div>
               </div>
               <div className={`mt-3 font-mono ${config.accent} flex items-center gap-2`}>
                 <FaClock /> {time.toLocaleTimeString()}
               </div>
              </div>
          </Reveal>

          {/* RIGHT: COUNTDOWN CALENDAR - Wrapped in Reveal */}
          <Reveal 
            key={`${currentSeason}-cal`}
            variants={{
                hidden: { x: 50, opacity: 0 },
                visible: { x: 0, opacity: 1 }
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500/0 via-red-600 to-red-500/0"></div>
               
               <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                 <FaCalendarAlt className="text-white/80" /> 
                 {saleStatus === "UPCOMING" ? `${config.key.charAt(0).toUpperCase() + config.key.slice(1)} Sale Starts In:` : 
                  saleStatus === "ACTIVE" ? `${config.key.charAt(0).toUpperCase() + config.key.slice(1)} Sale Ends In:` : "Sale Ended"}
               </h3>
               
               <p className={`${config.accent} text-sm mb-6 border-b border-white/10 pb-4`}>
                 {getSaleDateString()}
               </p>

               {saleStatus !== "ENDED" ? (
                 <div className="grid grid-cols-4 gap-2">
                    {[{ l: "Days", v: timeLeft.days }, { l: "Hours", v: timeLeft.hours }, { l: "Mins", v: timeLeft.minutes }, { l: "Secs", v: timeLeft.seconds }].map((item, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-2 flex flex-col items-center justify-center border border-white/10 shadow-inner group hover:bg-black/50 transition duration-300">
                        <AnimatePresence mode="popLayout">
                          <motion.span key={item.v} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }} className="text-3xl md:text-4xl font-bold text-white font-mono">
                            {String(item.v).padStart(2, '0')}
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{item.l}</span>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-8"><p className="text-2xl font-bold text-white">See you next year!</p></div>
               )}

               <div className="mt-6 text-center">
                 <Link to={config.linkHash} className="inline-block w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg transform active:scale-95">
                   Access {config.key.charAt(0).toUpperCase() + config.key.slice(1)} Sale
                 </Link>
               </div>
            </div>
          </Reveal>
        </div>

        {/* --- SEASONAL WHEEL --- */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
            <AnimatePresence>
                {isWheelOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 20 }}
                        className="mb-4 flex gap-4 bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-2xl items-center"
                    >
                        {[
                            { id: 'winter', icon: <FaSnowflake />, color: 'text-blue-500 hover:bg-blue-100' },
                            { id: 'summer', icon: <FaSun />, color: 'text-yellow-500 hover:bg-yellow-100' },
                            { id: 'autumn', icon: <FaCanadianMapleLeaf />, color: 'text-orange-600 hover:bg-orange-100' },
                            { id: 'rainy', icon: <FaUmbrella />, color: 'text-teal-600 hover:bg-teal-100' },
                            { id: 'newyear', icon: <FaGlassCheers />, color: 'text-purple-600 hover:bg-purple-100' },
                        ].map((season) => (
                            <button
                                key={season.id}
                                onClick={() => { setCurrentSeason(season.id); setIsWheelOpen(false); }}
                                className={`p-3 rounded-full bg-white shadow-md text-xl transition-all duration-300 transform hover:scale-110 ${season.color} ${currentSeason === season.id ? 'ring-4 ring-offset-2 ring-white' : ''}`}
                                title={season.id.charAt(0).toUpperCase() + season.id.slice(1)}
                            >
                                {season.icon}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button 
                onClick={() => setIsWheelOpen(!isWheelOpen)}
                className="group relative bg-white text-gray-900 p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-110"
            >
                <motion.div 
                    animate={{ rotate: isWheelOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                >
                    <FaAdjust className={isWheelOpen ? 'text-purple-600' : 'text-gray-800'} />
                </motion.div>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Change Season
                </span>
            </button>
        </div>

      </div>

      {/* BENTO GRID TRENDING SECTION */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                 <Reveal 
                   variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                   className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2"
                 >
                   Hot This Week
                 </Reveal>
                 <h2 className="text-4xl font-bold flex items-center gap-3 text-gray-900">
                    <motion.span variants={fireAnimation} animate="animate" className="text-orange-500"> <FaFire /> </motion.span> 
                    Trending Now
                 </h2>
              </div>
              <motion.button 
                whileHover={{ x: 5 }}
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mt-4 md:mt-0"
              >
                View All Products <FaArrowRight size={12} />
              </motion.button>
          </div>

          <Reveal 
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[350px]"
              variants={staggerContainer}
           >
            {trendingProducts.map((product, index) => {
               let spanClass = "";
               if (product.size === "large") spanClass = "md:col-span-2 md:row-span-2";
               else if (product.size === "wide") spanClass = "md:col-span-2";
               
               return (
                 <motion.div 
                   key={product.id} 
                   variants={fadeInUp} 
                   className={`relative group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 ${spanClass}`}
                 >
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                       <img 
                         src={product.image} 
                         alt={product.name} 
                         className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    </div>

                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                       {product.tag && (
                         <span className={`px-3 py-1 text-xs font-bold text-white rounded-full uppercase tracking-wider
                           ${product.tag === 'HOT' ? 'bg-red-500' : 
                             product.tag === 'NEW' ? 'bg-blue-500' : 
                             product.tag === 'SALE' ? 'bg-green-500' : 'bg-purple-500'}`}
                         >
                           {product.tag}
                         </span>
                       )}
                    </div>

                    <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2 z-20">
                       <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-blue-500 hover:text-white shadow-lg transition-colors">
                          <FaHeart />
                       </button>
                       <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-blue-500 hover:text-white shadow-lg transition-colors">
                          <FaShoppingBag />
                       </button>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                       <div className="flex justify-between items-end">
                          <div>
                            <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
                               <FaStar /> <span>{product.rating}</span>
                            </div>
                            <h3 className={`font-bold leading-tight mb-1 ${product.size === 'large' ? 'text-3xl' : 'text-xl'}`}>
                              {product.name}
                            </h3>
                            <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto overflow-hidden">
                               Premium quality fabrics.
                            </p>
                          </div>
                          <div className="text-right">
                             <p className={`font-bold ${product.size === 'large' ? 'text-2xl' : 'text-xl'}`}>
                               ${product.price}
                             </p>
                          </div>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 transform translate-y-4 group-hover:translate-y-0">
                          <Link to={`/product/${product.id}`} className="w-full block text-center bg-white text-black font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                             View Product
                          </Link>
                       </div>
                    </div>
                 </motion.div>
               );
            })}
          </Reveal>

          <div className="mt-8 text-center md:hidden">
             <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold">
               View All Products <FaArrowRight />
             </button>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="bg-gray-900 text-white py-16 overflow-hidden"> 
        <div className="max-w-7xl mx-auto px-4 text-center">
            <Reveal 
              variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6 }} 
            >
                <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                  <motion.span initial={{ x: -300, y: 50, opacity: 0, rotate: -45 }} whileInView={{ x: 0, y: 0, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 60, damping: 12, duration: 1.5, delay: 0.2 }} viewport={{ once: false }} className="text-blue-400"><FaPaperPlane /></motion.span> Stay Updated
                </h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Sign up for our newsletter to receive the latest news on new arrivals, exclusive offers, and style tips.</p>
                <form className="flex flex-col sm:flex-row justify-center max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email" className="flex-grow px-6 py-3 rounded-l-full sm:rounded-r-none border-none text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none mb-4 sm:mb-0" required />
                    <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-r-full sm:rounded-l-none font-semibold hover:bg-blue-700 transition duration-300">Subscribe</button>
                </form>
            </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Home;