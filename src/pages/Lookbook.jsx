import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaTimes, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { products } from '../data/products.jsx'; 

// --- COMPONENT: Realistic Paper Texture Overlay ---
const PaperGrain = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-[0.12] mix-blend-multiply">
    <filter id='paperNoise'>
      <feTurbulence type='fractalNoise' baseFrequency='0.60' numOctaves='4' stitchTiles='stitch' />
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width='100%' height='100%' filter='url(#paperNoise)' fill="#f0ead6"/>
  </svg>
);

const Lookbook = () => {
  // --- CONFIGURATION ---
  const [currentSpread, setCurrentSpread] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
  const [isAnimating, setIsAnimating] = useState(false);

  // Safety check
  if (!products || products.length === 0) {
    return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white font-serif">Loading...</div>;
  }

  const totalSpreads = Math.ceil(products.length / 2);

  const handleNext = () => {
    if (isAnimating || currentSpread >= totalSpreads - 1) return;
    setDirection(1);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSpread(p => p + 1);
      setIsAnimating(false);
    }, 900); 
  };

  const handlePrev = () => {
    if (isAnimating || currentSpread <= 0) return;
    setDirection(-1);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSpread(p => p - 1);
      setIsAnimating(false);
    }, 900);
  };

  // --- LOGIC FOR LAYERS ---
  let staticLeftIdx = currentSpread * 2;
  let staticRightIdx = currentSpread * 2 + 1;
  let flipperFrontIdx = null;
  let flipperBackIdx = null;

  if (isAnimating) {
    if (direction === 1) {
      staticLeftIdx = currentSpread * 2;
      staticRightIdx = (currentSpread + 1) * 2 + 1;
      flipperFrontIdx = currentSpread * 2 + 1;
      flipperBackIdx = (currentSpread + 1) * 2;
    } else {
      staticLeftIdx = (currentSpread - 1) * 2;
      staticRightIdx = currentSpread * 2 + 1;
      flipperFrontIdx = (currentSpread - 1) * 2 + 1;
      flipperBackIdx = currentSpread * 2;
    }
  }

  const staticLeftProduct = products[staticLeftIdx];
  const staticRightProduct = products[staticRightIdx];
  const flipperFrontProduct = products[flipperFrontIdx];
  const flipperBackProduct = products[flipperBackIdx];

  return (
    <div className="min-h-screen bg-[#222] flex items-center justify-center relative overflow-hidden py-4 md:py-10">
      
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');`}
      </style>

      {/* --- BOOK CONTAINER --- */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        
        /* --- DRAG FUNCTIONALITY ADDED HERE --- */
        drag="x"
        dragConstraints={{ left: 0, right: 0 }} // Constraints ensure the book stays in center
        dragElastic={0.05} // Gives a slight "pull" feel before snapping back
        onDragEnd={(e, { offset, velocity }) => {
            const swipeThreshold = 50; // Pixels needed to trigger flip
            if (offset.x < -swipeThreshold) {
                handleNext();
            } else if (offset.x > swipeThreshold) {
                handlePrev();
            }
        }}
        /* ------------------------------------- */

        className="relative w-[95vw] max-w-[1400px] aspect-[3/2] md:aspect-[2.2/1] bg-[#fdfbf7] shadow-[0_35px_70px_-15px_rgba(0,0,0,0.8)] flex perspective-[2500px] cursor-grab active:cursor-grabbing"
      >
        
        {/* Close Button */}
        <Link to="/" className="absolute top-6 right-6 z-50 text-gray-400 hover:text-black transition-colors">
          <FaTimes size={20} />
        </Link>

        {/* --- NAVIGATION ARROWS --- */}
        {/* Added onPointerDown to stop propagation so clicking arrow doesn't trigger drag */}
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handlePrev} 
          disabled={currentSpread === 0 || isAnimating}
          className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-md text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-xl rounded-full border border-gray-100 ${currentSpread === 0 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
        >
          <FaArrowLeft size={14} />
        </button>

        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleNext} 
          disabled={currentSpread >= totalSpreads - 1 || isAnimating}
          className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-md text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-xl rounded-full border border-gray-100 ${currentSpread >= totalSpreads - 1 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
        >
          <FaArrowRight size={14} />
        </button>

        {/* --- SPINE SHADOW --- */}
        <div className="absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.12)] to-transparent z-40 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute left-1/2 top-[1%] bottom-[1%] w-[0.5px] bg-neutral-300 z-40 opacity-60"></div>


        {/* ================= BOOK CONTENT LAYERS ================= */}

        {/* 1. STATIC LEFT PAGE */}
        <div className="flex-1 border-r border-gray-200/60 overflow-hidden relative z-0 bg-[#fdfbf7]">
             <PaperGrain />
             <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[rgba(0,0,0,0.05)] to-transparent z-20 pointer-events-none"></div>
             <MagazinePage 
               product={staticLeftProduct} 
               pageNumber={staticLeftIdx + 1} 
               layout="left"
             />
        </div>

        {/* 2. STATIC RIGHT PAGE */}
        <div className="flex-1 overflow-hidden relative z-0 bg-[#fdfbf7]">
             <PaperGrain />
             <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[rgba(0,0,0,0.05)] to-transparent z-20 pointer-events-none"></div>
             <MagazinePage 
               product={staticRightProduct} 
               pageNumber={staticRightIdx + 1} 
               layout="right"
             />
        </div>

        {/* 3. FLIPPING PAGE */}
        {isAnimating && (
          <motion.div
            initial={{ rotateY: direction === 1 ? 0 : -180 }}
            animate={{ rotateY: direction === 1 ? -180 : 0 }}
            transition={{ duration: 0.9, ease: [0.645, 0.045, 0.355, 1.000] }} 
            style={{ 
              transformOrigin: 'left center', 
              transformStyle: 'preserve-3d',
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', zIndex: 30
            }}
          >
            {/* FRONT OF FLIPPER */}
            <div className="absolute inset-0 w-full h-full bg-[#fdfbf7] backface-hidden overflow-hidden border-l border-gray-200/60" style={{ backfaceVisibility: 'hidden' }}>
              <PaperGrain />
              <MagazinePage product={flipperFrontProduct} pageNumber={flipperFrontIdx + 1} layout="right"/>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[rgba(0,0,0,0.1)] to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5 pointer-events-none z-25"></div>
            </div>

            {/* BACK OF FLIPPER */}
            <div className="absolute inset-0 w-full h-full bg-[#fdfbf7] backface-hidden overflow-hidden border-r border-gray-200/60" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <PaperGrain />
              <MagazinePage product={flipperBackProduct} pageNumber={flipperBackIdx + 1} layout="left"/>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[rgba(0,0,0,0.1)] to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 pointer-events-none z-25"></div>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

// --- SUB-COMPONENT: EDITORIAL PAGE LAYOUT ---
const MagazinePage = ({ product, pageNumber, layout }) => {
  if (!product) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#fdfbf7]"></div>
    );
  }

  const formattedPage = pageNumber < 10 ? `0${pageNumber}` : pageNumber;

  return (
    <div className={`w-full h-full flex ${layout === 'right' ? 'flex-row' : 'flex-row'}`}>
      
      {/* IMAGE SECTION */}
      <div className={`w-[55%] h-full relative overflow-hidden ${layout === 'right' ? 'order-2' : 'order-1'}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover filter contrast-[1.03] sepia-[0.08]"
        />
        <div className="absolute inset-0 bg-[#4a453b] opacity-10 mix-blend-multiply"></div>
      </div>

      {/* CONTENT SECTION */}
      <div className={`w-[45%] h-full relative flex flex-col justify-center px-8 md:px-12 py-10 bg-[#fdfbf7] ${layout === 'right' ? 'order-1' : 'order-2'}`}>
        
        <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[8rem] md:text-[10rem] font-serif leading-none text-[#ebe6da] select-none pointer-events-none z-0">
          {formattedPage}
        </span>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-[1px] w-10 bg-red-900"></span>
            <span className="text-[10px] md:text-xs tracking-[0.25em] text-neutral-500 uppercase font-sans font-bold">Editorial</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-neutral-900 leading-[1.1] mb-6">
            {product.name}
          </h2>

          <div className="mb-8">
             <p className="font-serif text-neutral-600 italic text-sm md:text-[15px] leading-relaxed line-clamp-4 pl-4 border-l border-red-900/30">
               {product.description || "A study in form and function. Tailored for the modern aesthetic with a focus on timeless materials."}
             </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-5 border-t border-neutral-200">
            <span className="font-serif text-xl text-neutral-900">${product.price}</span>
            
            <Link 
              to={`/product/${product.id}`}
              // Added onPointerDown to prevent dragging when trying to click the button
              onPointerDown={(e) => e.stopPropagation()} 
              className="group flex items-center gap-2 bg-[#1a1a1a] text-[#fdfbf7] px-5 py-3 text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-red-900 transition-colors duration-500"
            >
              Shop
              <FaShoppingBag size={10} className="opacity-70 group-hover:opacity-100 mb-[1px]" />
            </Link>
          </div>
        </div>

        <span className={`absolute bottom-8 text-[9px] text-neutral-400 font-bold tracking-[0.2em] ${layout === 'left' ? 'right-12' : 'left-12'}`}>
          ISSUE N°4 — PAGE {pageNumber}
        </span>

      </div>
    </div>
  );
};

export default Lookbook;