import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products as staticProducts } from '../data/products'; // Keep as initial state or fallback
import ProductCard from '../components/ProductCard';
import { motion, useAnimation, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { FaSnowflake, FaTag, FaArrowRight, FaShapes, FaArrowLeft, FaTimes } from 'react-icons/fa';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: { 
    opacity: 1, scale: 1, y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  },
};

// --- DECORATIVE COMPONENTS ---
// 1. Snow Effect
const Snowfall = () => {
  const flakes = Array.from({ length: 40 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flakes.map((_, i) => {
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 5;
        const size = Math.random() * 4 + 3;
        return (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{ 
                left: `${Math.random() * 100}%`,
                width: size, 
                height: size,
                opacity: Math.random() * 0.5 + 0.4
            }}
            initial={{ y: -20 }}
            animate={{ 
                y: ["-20px", "100vh"], 
                x: [0, Math.random() * 20 - 10]
            }}
            transition={{ 
                duration: duration, 
                repeat: Infinity, 
                ease: "linear", 
                delay: delay 
            }}
          />
        );
      })}
    </div>
  );
};

// 2. Abstract Shapes
const FloatingShape = ({ type, color, size, top, left, delay }) => (
    <motion.div 
        className={`absolute z-0 opacity-30 pointer-events-none ${color}`}
        style={{ top, left, width: size, height: size, borderRadius: type === 'circle' ? '50%' : '10%' }}
        animate={{ y: [0, -30, 0], rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, delay, repeat: Infinity, ease: "easeInOut" }}
    />
);

// 3. Winter Tag
const AnimatedWinterTag = () => {
  const text = "15% OFF";
  const controls = useAnimation();
  const tagTextContainerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 }},
  };
  const letterVariants = {
    hidden: { opacity: 0, width: 0 },
    visible: { opacity: 1, width: "auto", transition: { duration: 0.5 }},
  };
  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      while (isMounted) {
        controls.set("hidden");
        await controls.start("visible");
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
    };
    sequence();
    return () => { isMounted = false; };
  }, [controls]);
  return (
    <div className="absolute top-4 right-4 z-20 transform rotate-3 origin-top-right group-hover:rotate-0 transition-transform duration-500">
      <div className="relative w-[110px] h-[36px]">
        <svg viewBox="0 0 110 36" className="absolute inset-0 w-full h-full text-red-600" fill="currentColor">
          <path d="M104 0H26L0 18L26 36H104C107.314 36 110 33.3137 110 30V6C110 2.68629 107.314 0 104 0Z" />
          <circle cx="14" cy="18" r="4" fill="white" fillOpacity="0.4"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pl-6 pr-2 text-white font-extrabold text-sm tracking-wide">
            <FaTag className="text-[10px] mr-2 opacity-90" />
            <motion.div className="flex overflow-hidden whitespace-nowrap" variants={tagTextContainerVariants} initial="hidden" animate={controls}>
              {text.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants}>{char === " " ? "\u00A0" : char}</motion.span>
              ))}
            </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- THE PLAZA COMPONENTS ---

const PlazaCategoryCard = ({ title, subtitle, bgClass, onClick, icon, delay, decor }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    onClick={onClick}
    className={`relative h-[60vh] md:h-[80vh] flex-1 min-w-[280px] cursor-pointer group overflow-hidden rounded-2xl border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-500`}
  >
    <div className={`absolute inset-0 ${bgClass} transition-transform duration-700 group-hover:scale-105 z-0`}>
       {decor}
    </div>
    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
    
    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-20">
      <div className="mb-2 opacity-80">{icon}</div>
      <h3 className="text-3xl font-black uppercase tracking-tighter mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">{title}</h3>
      <p className="text-sm font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-100">{subtitle}</p>
    </div>
    <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/20 transform -translate-x-1/2 group-hover:w-[100px] group-hover:opacity-0 transition-all duration-700 z-20"></div>
  </motion.div>
);

// --- DOOR TRANSITION & WRAPPER ---
const AutomaticDoorTransition = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <motion.div 
        className="relative z-10 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {children}
      </motion.div>

      <motion.div 
        initial={{ x: 0 }} 
        animate={{ x: '-100%' }} 
        exit={{ x: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 w-1/2 bg-[#f0f0f0] border-r border-gray-300 z-[60] flex items-center justify-end shadow-2xl pointer-events-none"
      >
        <div className="mr-8 text-gray-300 transform rotate-90 tracking-[1em] text-xs font-bold uppercase">Pull</div>
      </motion.div>
      <motion.div 
        initial={{ x: 0 }} 
        animate={{ x: '100%' }} 
        exit={{ x: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-y-0 right-0 w-1/2 bg-[#f0f0f0] border-l border-gray-300 z-[60] flex items-center justify-start shadow-2xl pointer-events-none"
      >
        <div className="ml-8 text-gray-300 transform -rotate-90 tracking-[1em] text-xs font-bold uppercase">Push</div>
      </motion.div>
    </div>
  );
};


// --- INTERNAL STORE SECTIONS (UPDATED FOR PHYSICS SCROLLING) ---

const StoreView = ({ category, items, onExit }) => {
  const scrollContainerRef = useRef(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  // 1. PHYSICS SETUP
  const x = useMotionValue(0);
  const smoothX = useSpring(x, { damping: 50, stiffness: 300, mass: 0.5 });

  // 2. CALCULATE CONSTRAINTS
  useLayoutEffect(() => {
    const calcConstraints = () => {
      if (scrollContainerRef.current) {
        const viewportWidth = window.innerWidth;
        const contentWidth = scrollContainerRef.current.scrollWidth;
        const minLeft = -(contentWidth - viewportWidth + 100); 
        setConstraints({ left: minLeft, right: 0 });
      }
    };
    calcConstraints();
    window.addEventListener('resize', calcConstraints);
    return () => window.removeEventListener('resize', calcConstraints);
  }, [items]);

  // 3. LISTEN FOR GESTURE EVENTS
  useEffect(() => {
    const handleGestureScroll = (e) => {
      const { amount } = e.detail;
      // Invert amount (Hand Right = Scroll Right = Content moves Left)
      const currentX = x.get();
      let newX = currentX - amount * 2.5; 
      
      // Rubber banding
      if (newX > 0) newX = newX * 0.2;
      if (newX < constraints.left) newX = constraints.left + (newX - constraints.left) * 0.2;
      
      x.set(newX);
    };

    window.addEventListener('gesture-scroll-x', handleGestureScroll);
    return () => window.removeEventListener('gesture-scroll-x', handleGestureScroll);
  }, [constraints, x]);

  // 4. MANUAL BUTTON SCROLL
  const scroll = (direction) => {
     const currentX = x.get();
     // Move by roughly 400px (approx item width)
     let newX = currentX + (direction === 'left' ? 400 : -400); 
     
     // Clamp
     if (newX > 0) newX = 0;
     if (newX < constraints.left) newX = constraints.left;
     
     x.set(newX);
  };

  const themes = {
    Winter: {
      bg: "bg-gradient-to-b from-[#b3cdd1] to-[#eff6f7]",
      titleColor: "text-slate-800",
      decor: <Snowfall />, 
      accent: "bg-blue-500",
      font: "font-sans"
    },
    Men: {
      bg: "bg-[#f3f4f6]",
      titleColor: "text-gray-900",
      decor: (
        <>
           <FloatingShape type="square" color="bg-orange-200" size="400px" top="-10%" left="-5%" delay={0} />
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </>
      ),
      accent: "bg-orange-500",
      font: "font-sans"
    },
    Women: {
      bg: "bg-[#fff1f2]",
      titleColor: "text-rose-900",
      decor: (
        <>
            <FloatingShape type="circle" color="bg-rose-200" size="500px" top="10%" right="-10%" delay={2} />
            <FloatingShape type="circle" color="bg-purple-200" size="300px" top="60%" left="10%" delay={0} />
        </>
      ),
      accent: "bg-rose-400",
      font: "font-serif"
    },
    Accessories: {
      bg: "bg-[#fffbeb]",
      titleColor: "text-amber-900",
      decor: <FloatingShape type="circle" color="bg-amber-200" size="200px" top="20%" left="50%" delay={1} />,
      accent: "bg-amber-500",
      font: "font-mono"
    }
  };

  const theme = themes[category] || themes.Men;

  return (
    <div className={`min-h-screen ${theme.bg} relative flex flex-col justify-center overflow-hidden`}>
      {theme.decor}
      
      {/* --- EXIT BUTTON --- */}
      <motion.button 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExit}
        className="absolute top-24 right-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-white/50 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-white hover:text-red-600 transition-colors group"
      >
          <span>Exit Plaza</span>
          <span className="bg-black/5 rounded-full p-1 group-hover:bg-red-50 transition-colors">
            <FaTimes className="text-xs group-hover:rotate-90 transition-transform duration-300"/>
          </span>
      </motion.button>
      
      <div className="container mx-auto px-6 relative z-10 py-24">
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div>
            <h1 className={`text-6xl md:text-9xl font-black uppercase leading-none ${theme.titleColor} ${theme.font}`}>
              {category}
            </h1>
            <div className={`h-2 w-32 ${theme.accent} mt-4`}></div>
          </div>
          <div className="flex gap-4">
               <button onClick={() => scroll('left')} className="p-4 rounded-full bg-white/50 hover:bg-white shadow-lg transition-all"><FaArrowRight className="rotate-180" /></button>
               <button onClick={() => scroll('right')} className="p-4 rounded-full bg-white/50 hover:bg-white shadow-lg transition-all"><FaArrowRight /></button>
          </div>
        </motion.div>

        {/* REPLACED OVERFLOW CONTAINER WITH PHYSICS SLIDER */}
        <div className="w-full relative h-[500px] flex items-center">
            <motion.div 
                ref={scrollContainerRef}
                style={{ x: smoothX }} 
                drag="x" 
                dragConstraints={constraints}
                className="flex gap-8 absolute left-0 pl-4 md:pl-0 cursor-grab active:cursor-grabbing"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
            {items.map((product) => (
                <motion.div key={product.id} variants={itemVariants} className="snap-start flex-shrink-0 w-[85vw] md:w-[400px]">
                    <div className="relative group">
                        {category === 'Winter' && <AnimatedWinterTag />}
                        <div className="bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <ProductCard product={product} />
                        </div>
                    </div>
                </motion.div>
            ))}
            {items.length === 0 && (
                <div className="text-xl font-bold text-gray-500 opacity-60 ml-4">
                    Loading Collection...
                </div>
            )}
            </motion.div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN SHOP CONTROLLER ---

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState(null); 
  const [allProducts, setAllProducts] = useState(staticProducts); 
  const location = useLocation();

  // --- UPDATED: FETCH ALL PRODUCTS (MAKES EVERYTHING DYNAMIC) ---
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Remove ?category=Men so we get EVERYTHING (Men, Women, Accessories, etc.)
        const res = await fetch('https://fashion-store-ak.onrender.com/api/products');
        const data = await res.json();
        
        // Map MongoDB _id to the simple id format used by ProductCard
        const formattedData = data.map(item => ({
            id: item._id, // Use the database ID
            name: item.name,
            price: item.price,
            category: item.category,
            image: item.image,
            description: item.description,
            colors: item.colors || []
        }));

        // Set state with API data (overwrites staticProducts completely)
        setAllProducts(formattedData);

      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const cat = location.hash.replace('#', '');
      const validCats = ['winter', 'men', 'women', 'accessories'];
      if (validCats.includes(cat.toLowerCase())) {
        setActiveCategory(cat.charAt(0).toUpperCase() + cat.slice(1));
      }
    }
  }, [location]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <div className="font-sans bg-gray-50 selection:bg-black selection:text-white min-h-screen relative">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: THE PLAZA (LOBBY) */}
        {!activeCategory && (
          <motion.div 
            key="plaza"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
            className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8"
          >
            <div className="mb-8 text-center mt-12 md:mt-0">
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] text-gray-800">The Plaza</h1>
                <p className="text-gray-500 mt-2 font-serif italic">Select a department to enter</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl h-full items-center justify-center">
                <PlazaCategoryCard 
                    title="Winter" 
                    subtitle="Frost Collection" 
                    bgClass="bg-gradient-to-b from-[#1e293b] to-[#334155]" 
                    icon={<FaSnowflake size={24} className="text-blue-300"/>}
                    onClick={() => handleCategoryClick('Winter')}
                    delay={0}
                    decor={<Snowfall />} 
                />
                
                <PlazaCategoryCard 
                    title="Men" 
                    subtitle="Structure & Form" 
                    bgClass="bg-gradient-to-br from-orange-100 to-gray-200"
                    icon={<FaShapes size={24} />} 
                    onClick={() => handleCategoryClick('Men')}
                    delay={0.1}
                />
                <PlazaCategoryCard 
                    title="Women" 
                    subtitle="Elegance & Flow" 
                    bgClass="bg-gradient-to-br from-rose-100 to-pink-50" 
                    icon={<span className="font-serif text-2xl italic">f</span>}
                    onClick={() => handleCategoryClick('Women')}
                    delay={0.2}
                />
                <PlazaCategoryCard 
                    title="Accessories" 
                    subtitle="The Details" 
                    bgClass="bg-gradient-to-br from-amber-100 to-yellow-50"
                    icon={<FaTag size={20} />} 
                    onClick={() => handleCategoryClick('Accessories')}
                    delay={0.3}
                />
            </div>
          </motion.div>
        )}

        {/* VIEW 2: THE STORE (INSIDE) */}
        {activeCategory && (
          <motion.div key="store" className="relative z-40">
            <AutomaticDoorTransition>
                <StoreView 
                    category={activeCategory} 
                    // FILTER FROM THE DYNAMIC LIST based on which room is active
                    items={allProducts.filter(p => p.category === activeCategory)}
                    onExit={() => setActiveCategory(null)}
                />
            </AutomaticDoorTransition>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Shop;