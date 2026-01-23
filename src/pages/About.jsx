import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FaQuoteLeft, FaNewspaper } from 'react-icons/fa';

// --- UTILITY: PAPER TEXTURE OVERLAY ---
const PaperTexture = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.4] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
);

// --- UTILITY: VINTAGE MARQUEE (TICKER TAPE) ---
const NewsTicker = ({ text }) => {
  return (
    <div className="w-full border-y-2 border-black py-2 overflow-hidden flex whitespace-nowrap relative z-20 bg-transparent">
      <motion.div 
        className="flex gap-12 font-mono text-sm uppercase tracking-widest text-black"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="flex items-center gap-12">
            {text} <span className="text-xl">★</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- MAIN NEWSPAPER WRAPPER ANIMATION ---
const NewspaperEntry = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0.2, rotate: -720, y: 500, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 50, 
        damping: 15, 
        mass: 1.2,
        duration: 1.5,
        delay: 0.2 
      }}
      className="origin-center"
    >
      {children}
    </motion.div>
  );
};

// --- COMPONENT: PARALLAX PHOTO (Black & White Halftone Style) ---
const NewspaperImage = ({ src, alt, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden border-2 border-black p-1 ${className}`}>
      <div className="overflow-hidden h-full w-full relative grayscale contrast-125">
         {/* Halftone Overlay Effect */}
         <div className="absolute inset-0 z-10 opacity-20 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:4px_4px] pointer-events-none"></div>
         
         <motion.img 
           style={{ y, scale: 1.1 }}
           src={src} 
           alt={alt} 
           className="w-full h-full object-cover"
         />
      </div>
      <div className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase z-20">
         Fig. 1.0 - The Collection
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const About = () => {
  return (
    <div className="bg-[#2a2a2a] min-h-screen py-8 md:py-16 px-4 overflow-hidden font-serif selection:bg-black selection:text-white perspective-1000">
      
      {/* THE NEWSPAPER ANIMATION WRAPPER */}
      <NewspaperEntry>
        <div className="max-w-[1400px] mx-auto bg-[#f4f1ea] text-black shadow-2xl relative overflow-hidden">
          
          <PaperTexture />

          {/* --- 1. THE MASTHEAD (Header) --- */}
          <header className="p-4 md:p-8 border-b-4 border-black relative z-10 text-center">
            <div className="flex justify-between border-b border-black pb-2 mb-4 font-mono text-xs uppercase tracking-widest">
               <span>Vol. 01</span>
               <span>Global Edition</span>
               <span>Price: $0.00</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-4 font-serif transform scale-y-110">
              The Daily <br className="md:hidden" /> Fashion
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-center border-t-2 border-black pt-2 font-bold font-sans text-sm md:text-base">
               <div className="flex items-center gap-2">
                 <FaNewspaper /> <span>EST. 2025</span>
               </div>
               <div className="uppercase tracking-widest">Defining the Art of Dressing</div>
               <div>Avishikta Karali, Editor-in-Chief</div>
            </div>
          </header>

          {/* --- 2. HERO HEADLINE & LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b-4 border-black">
            
            {/* Left Column: Big Headline */}
            <div className="lg:col-span-8 p-4 md:p-12 border-b lg:border-b-0 lg:border-r-2 border-black relative">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1 }}
               >
                 <span className="font-mono text-xs bg-black text-white px-2 py-1 mb-4 inline-block">BREAKING NEWS</span>
                 <h2 className="text-5xl md:text-7xl font-bold leading-none mb-6">
                   STYLE IS A VOCABULARY <br/> <span className="italic font-light">WITHOUT WORDS.</span>
                 </h2>
                 
                 <div className="columns-1 md:columns-2 gap-8 text-justify font-serif text-lg leading-relaxed">
                    <p className="mb-4 first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                       Worn in a small studio with nothing but a sketchpad and a restless ambition, 
                       Fashion.Store was created for the modern dreamer. We believe that what you wear 
                       is the most immediate form of self-expression.
                    </p>
                    <p>
                       Our collections are not dictated by fleeting trends, but by a commitment to 
                       timeless elegance and sustainable innovation. We don't just sell clothes; we curate identities for the future.
                    </p>
                 </div>
               </motion.div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-4 p-4 flex flex-col justify-center bg-[#e8e4d9]">
               <NewspaperImage 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                  alt="Fashion Week"
                  className="h-[400px] md:h-[600px] w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
               />
               <p className="text-center font-mono text-xs mt-4 italic">Fig 1.1: The Autumn Collection Debut in Paris.</p>
            </div>
          </div>

          {/* --- 3. TICKER TAPE --- */}
          <NewsTicker text="EXTRA! EXTRA! READ ALL ABOUT IT • SUSTAINABILITY IS THE NEW LUXURY • DESIGNED FOR THE BOLD" />

          {/* --- 4. CORE VALUES (Editorial Layout) --- */}
          <div className="p-8 md:p-16 relative">
             {/* FIX APPLIED HERE: 
                 Changed 'top-0' to 'top-8' (md:p-16 is roughly 4rem, p-8 is 2rem). 
                 'top-8' (2rem) aligns it exactly with the start of the padding box, 
                 creating a nice overlap effect with the border below without hitting the ticker above.
             */}
             <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f4f1ea] px-4 border-2 border-black z-10">
                <h3 className="font-mono uppercase text-xl font-bold">Our Philosophy</h3>
             </div>
             
             <div className="border-2 border-black p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x-2 divide-black">
                {[
                  { title: "Sustainability", desc: "Sourcing fabrics that respect the planet, minimizing carbon footprint." },
                  { title: "Craftsmanship", desc: "Every stitch tells a story. Collaboration with master artisans." },
                  { title: "Inclusivity", desc: "Fashion is for everyone. Celebrating every body type." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="pt-4 md:pt-0 md:pl-4 text-center"
                  >
                     <div className="text-6xl font-black mb-4 opacity-10">{`0${i+1}`}</div>
                     <h4 className="text-2xl font-bold uppercase mb-2 border-b-2 border-black inline-block pb-1">{item.title}</h4>
                     <p className="font-serif text-lg leading-tight">{item.desc}</p>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* --- 5. THE TEAM (Mugshots style) --- */}
          <div className="bg-black text-[#f4f1ea] p-8 md:p-16">
             <div className="border-b border-[#f4f1ea] mb-12 pb-4 flex justify-between items-end">
                <h2 className="text-4xl md:text-6xl uppercase font-bold">Contributors</h2>
                <span className="font-mono text-xs">SECTION B</span>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {[
                   { name: "Alex Morgan", role: "Creative Dir.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80" },
                   { name: "Sarah Jenkins", role: "Head Design", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" },
                   { name: "David Chen", role: "Eco Lead", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" },
                   { name: "E. Rodriguez", role: "Brand Mgr.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80" }
                ].map((member, i) => (
                   <motion.div 
                      key={i}
                      whileHover={{ y: -10 }}
                      className="border border-[#f4f1ea] p-2"
                   >
                      <div className="aspect-[3/4] overflow-hidden mb-4 grayscale hover:grayscale-0 transition-all duration-500">
                         <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-xl uppercase font-serif">{member.name}</h4>
                      <p className="font-mono text-xs opacity-70">{member.role}</p>
                   </motion.div>
                ))}
             </div>
          </div>

          {/* --- 6. FOOTER QUOTE --- */}
          <div className="p-16 md:p-32 text-center relative">
             <FaQuoteLeft className="text-6xl mx-auto mb-8 opacity-20" />
             <div className="max-w-4xl mx-auto">
                <p className="text-3xl md:text-5xl font-black uppercase leading-tight transform -rotate-1">
                   "Style is a way to say who you are without having to speak."
                </p>
                <div className="mt-8 font-mono text-sm border-t border-black inline-block pt-2 px-8">
                   — THE MANIFESTO
                </div>
             </div>
             
             {/* Barcode Footer */}
             <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 opacity-50">
                 <div className="h-12 w-32 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EAN13.svg/1200px-EAN13.svg.png')] bg-cover"></div>
             </div>
          </div>

        </div>
      </NewspaperEntry>
    </div>
  );
};

export default About;