import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaAsterisk, FaTimes, FaDownload, FaBook, FaCheck } from 'react-icons/fa';

// --- ASSETS: GRAIN TEXTURE ---
const GrainTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-multiply"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }}
  />
);

// --- COMPONENT: STRAIGHT METALLIC BINDING ---
const SpringBinding = () => (
  <div className="relative w-full h-14 z-50 flex justify-between items-end px-6 sm:px-10 pointer-events-none select-none bg-stone-200 border-b border-stone-300 shadow-sm">
    <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-b from-black/10 to-transparent z-0" />
    
    {[...Array(14)].map((_, i) => (
      <div key={i} className="relative z-10 w-4 h-full flex flex-col items-center justify-end group"> 
         
         {/* The Hole in the binding bar (Single punch now) */}
         <div className="absolute bottom-2 w-3 h-3 bg-stone-800 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] z-0" />
         
         {/* The Metallic Ring */}
         <div 
            className="relative z-20 w-2.5 h-16 rounded-full mb-2"
            style={{
                background: 'linear-gradient(90deg, #2a2a2a 0%, #78716c 20%, #ffffff 50%, #78716c 80%, #2a2a2a 100%)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
                transform: 'translateY(6px)', 
            }}
         />
      </div>
    ))}
  </div>
);

// --- ANIMATION VARIANTS ---
const notebookVariants = {
    initial: { rotateX: -105, opacity: 1, transformOrigin: "top center", filter: "brightness(0.5)" },
    animate: { rotateX: 0, opacity: 1, filter: "brightness(1)", transition: { type: "spring", stiffness: 70, damping: 12, mass: 1.5 } },
    exit: { rotateX: -105, opacity: 1, filter: "brightness(0.5)", transition: { duration: 0.4, ease: "easeIn" } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 60, damping: 20 } }
};

// --- COMPONENT: ENVELOPE ---
const Envelope = ({ stage }) => {
    const isSending = stage === 'sending' || stage === 'sent';
    const isClosed = stage === 'enveloping-close' || isSending;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                y: isSending ? -100 : 0,
                x: isSending ? 1500 : 0, 
                rotate: isSending ? 5 : 0,
            }}
            transition={{ 
                x: { duration: 0.8, ease: "easeInOut" },
                default: { duration: 0.5 }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-48 z-30 perspective-1000"
        >
            <div className="absolute inset-0 bg-stone-200 shadow-xl rounded-sm border border-stone-300 z-0" />
            
            {stage === 'enveloping-insert' && (
                <motion.div 
                    initial={{ y: -200, scale: 0.9, opacity: 0 }}
                    animate={{ y: 15, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "circOut", delay: 0.1 }}
                    className="absolute left-4 right-4 h-40 bg-white shadow-sm z-10 p-4"
                >
                    <div className="w-full h-2 bg-stone-100 mb-2"/>
                    <div className="w-2/3 h-2 bg-stone-100"/>
                </motion.div>
            )}

            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[160px] border-l-transparent border-b-[100px] border-b-stone-100 border-r-[160px] border-r-transparent z-20 pointer-events-none drop-shadow-sm" />
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[100px] border-l-stone-200 border-t-[80px] border-t-transparent border-b-[90px] border-b-stone-200 z-20 pointer-events-none mix-blend-multiply opacity-20" />
            <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[100px] border-r-stone-200 border-t-[80px] border-t-transparent border-b-[90px] border-b-stone-200 z-20 pointer-events-none mix-blend-multiply opacity-20" />

            <motion.div 
                initial={{ rotateX: 180 }}
                animate={{ rotateX: isClosed ? 0 : 180 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute top-0 left-0 w-full z-30 drop-shadow-md"
            >
                <div className="w-0 h-0 border-l-[160px] border-l-transparent border-t-[90px] border-t-stone-300 border-r-[160px] border-r-transparent" />
            </motion.div>
        </motion.div>
    );
};

// --- SUB-COMPONENT: CONTACT FORM ---
const ContactForm = ({ onSend, animationStage }) => {
    const isRipping = animationStage === 'ripping';
    const isFolding = animationStage === 'folding';
    const isGone = ['enveloping-insert', 'enveloping-close', 'sending', 'sent'].includes(animationStage);

    if (isGone) return null;

    return (
        <motion.div 
            className="w-full h-full bg-[#f4f4f4] relative origin-top"
            animate={
                isFolding ? { 
                    scale: 0.15, 
                    opacity: 0, 
                    y: 200, 
                    rotate: -5
                } : 
                isRipping ? { 
                    y: 80, 
                    rotate: 2, 
                    scale: 0.98
                } : { 
                    y: 0, 
                    rotate: 0, 
                    scale: 1 
                }
            }
            transition={{ 
                duration: 0.5, 
                type: isRipping ? "spring" : "tween",
                bounce: 0.2
            }}
        >
            <div className="p-8 md:p-12 overflow-y-auto h-full relative">
                
                {/* Visual Holes on the Paper - HIDDEN unless ripping to prevent double-punch look */}
                <div 
                    className={`absolute top-0 left-0 w-full flex justify-between px-6 sm:px-10 pointer-events-none transition-opacity duration-200 ${isRipping ? 'opacity-100' : 'opacity-0'}`}
                >
                    {[...Array(14)].map((_, i) => (
                        <div key={i} className="w-4 flex justify-center">
                            <div className={`w-3 h-3 rounded-full bg-[#e5e5e5] shadow-inner`} />
                        </div>
                    ))}
                </div>

                {/* Jagged Edge (Only appears when ripping) */}
                {isRipping && (
                     <div className="absolute -top-3 left-0 w-full overflow-hidden h-4 flex">
                        {[...Array(40)].map((_, i) => (
                            <div key={i} className="w-4 h-6 bg-[#f4f4f4] -ml-2 rotate-45 transform origin-top-left border-l border-stone-200 shadow-sm" />
                        ))}
                     </div>
                )}

                <motion.div animate={{ opacity: isFolding ? 0 : 1 }} transition={{ duration: 0.3 }}>
                    <div className="mb-10 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaAsterisk className="text-red-600 text-xs animate-spin-slow" />
                            <span className="text-xs font-bold uppercase tracking-widest text-red-600">Priority Channel</span>
                        </div>
                        <h2 className="text-3xl font-serif italic text-black">Customer Care / Compose</h2>
                        <p className="text-sm text-stone-500 mt-2 font-mono">
                        Direct line to support. Responses typically within 2 hours.
                        </p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
                        <div className="relative group">
                            <input type="text" required placeholder=" " className="block w-full border-b border-stone-300 py-3 text-lg bg-transparent focus:outline-none focus:border-black transition-colors peer rounded-none" />
                            <label className="absolute left-0 top-3 text-stone-400 text-sm font-mono uppercase transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-4 peer-valid:text-xs peer-valid:text-black pointer-events-none">Full Name</label>
                        </div>
                        <div className="relative group">
                            <input type="email" required placeholder=" " className="block w-full border-b border-stone-300 py-3 text-lg bg-transparent focus:outline-none focus:border-black transition-colors peer rounded-none" />
                            <label className="absolute left-0 top-3 text-stone-400 text-sm font-mono uppercase transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-4 peer-valid:text-xs peer-valid:text-black pointer-events-none">Email Address</label>
                        </div>
                        <div className="relative group mt-2">
                            <textarea rows="4" required placeholder=" " className="block w-full border border-stone-200 bg-stone-50 p-4 text-sm focus:outline-none focus:border-black focus:bg-white transition-all resize-none peer rounded-none font-mono"></textarea>
                            <label className="absolute left-4 top-4 text-stone-400 text-xs font-mono uppercase transition-all peer-focus:-top-6 peer-focus:left-0 peer-focus:text-black peer-valid:-top-6 peer-valid:left-0 peer-valid:text-black pointer-events-none">Message</label>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.01 }} 
                            whileTap={{ scale: 0.99 }} 
                            className="w-full bg-[#111] text-white h-14 flex items-center justify-between px-6 mt-2 shadow-lg"
                        >
                            <span className="font-mono text-xs uppercase tracking-widest">Send Message</span>
                            <FaArrowRight />
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

const SuccessMessage = () => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full h-full flex flex-col items-center justify-center bg-[#f4f4f4] text-center p-12"
    >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
            <FaCheck size={24} />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Message Sent</h2>
        <p className="font-mono text-stone-500 text-sm mb-8">Our team has received your inquiry.</p>
        <button onClick={() => window.location.reload()} className="text-xs border-b border-stone-400 uppercase tracking-widest hover:text-red-600 hover:border-red-600 transition-colors">Start New Session</button>
    </motion.div>
);

const InfoPage = ({ data, onClose }) => (
    <motion.div 
        variants={notebookVariants}
        initial="initial" animate="animate" exit="exit"
        className="absolute inset-0 w-full h-full bg-[#fffdf5] origin-top z-40 flex flex-col overflow-hidden border-t border-stone-200"
        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
    >
        <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        <div className="h-full overflow-y-auto relative z-10">
            <div className="h-[30vh] w-full relative overflow-hidden bg-stone-800">
                <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} src={data.image} alt={data.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
                <button onClick={onClose} className="absolute top-4 right-4 bg-white/10 backdrop-blur text-white hover:bg-white hover:text-red-600 transition-all p-2 rounded-full z-50">
                    <FaTimes size={16} />
                </button>
            </div>
            <div className="p-8 md:p-12">
                <div className="mb-8 border-l-2 border-red-600 pl-6">
                    <span className="text-stone-400 font-mono text-xs uppercase tracking-widest mb-2 block">Dept. Protocol 0{data.id}</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-stone-900">{data.title}</h2>
                    <p className="text-stone-600 font-serif italic text-lg leading-relaxed">{data.description}</p>
                </div>
                <div className="pt-8">
                    <h4 className="font-mono text-xs uppercase text-stone-400 mb-6 border-b border-stone-200 pb-2">Documents</h4>
                    <div className="grid gap-3">
                        {data.resources.map((res, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (idx * 0.1) }} className="flex items-center justify-between group cursor-pointer bg-white p-4 transition-all border border-stone-200 hover:border-black shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-stone-100 rounded-sm"><FaBook className="text-stone-500 group-hover:text-black" size={14} /></div>
                                    <div><p className="font-bold text-xs uppercase tracking-wide">{res.name}</p></div>
                                </div>
                                <FaDownload className="text-xs text-stone-400 group-hover:text-red-600" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const DepartmentItem = ({ id, title, email, isActive, onClick, onHover, onLeave }) => (
  <motion.div variants={itemVariants} onClick={() => onClick(id)} onMouseEnter={onHover} onMouseLeave={onLeave} className={`group relative py-6 border-b border-stone-300 cursor-pointer transition-colors duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
    <div className="flex justify-between items-baseline">
      <h3 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter transition-transform duration-500 ease-out ${isActive ? 'translate-x-4' : 'group-hover:translate-x-4'}`}>
        {title}
      </h3>
      <span className={`hidden md:block text-xs font-mono tracking-widest uppercase text-red-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        [{isActive ? 'Active' : 'Open'}]
      </span>
    </div>
    <div className={`mt-2 text-sm font-mono text-stone-500 flex items-center gap-2 transition-transform duration-500 ease-out delay-75 ${isActive ? 'translate-x-4' : 'group-hover:translate-x-4'}`}>
      <div className={`w-2 h-2 bg-red-600 rounded-full transition-opacity duration-300 ${isActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
      {email}
    </div>
  </motion.div>
);

// --- MAIN COMPONENT ---
const FashionContactPage = () => {
  const [ticketID, setTicketID] = useState("000000");
  const [activeTab, setActiveTab] = useState(1); 
  const [hoveredDept, setHoveredDept] = useState(null);
  
  // Animation State: 'idle', 'ripping', 'folding', 'enveloping-insert', 'enveloping-close', 'sending', 'sent'
  const [sendStage, setSendStage] = useState('idle');

  useEffect(() => {
    setTicketID(Math.floor(Math.random() * 900000 + 100000).toString());
  }, []);

  const handleSendSequence = () => {
      // 1. Rip the paper (0.5s)
      setSendStage('ripping');
      
      // 2. Fold the paper & Shrink (Happens after rip finishes)
      setTimeout(() => setSendStage('folding'), 500);
      
      // 3. Envelope appears and paper slides in (Happens as fold finishes)
      setTimeout(() => setSendStage('enveloping-insert'), 1000);

      // 4. Envelope closes (After insert animation)
      setTimeout(() => setSendStage('enveloping-close'), 1800);

      // 5. Envelope wooshes away
      setTimeout(() => setSendStage('sending'), 2400);

      // 6. Show success message
      setTimeout(() => setSendStage('sent'), 3200);
  };

  const departments = [
    { id: 1, title: "Customer Care", email: "care@system.com" },
    { id: 2, title: "Wholesale", email: "buying@system.com", description: "Access for registered retailers.", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2671&auto=format&fit=crop", resources: [{ name: "SS25 Line Sheet", size: "PDF" }] },
    { id: 3, title: "Press / PR", email: "press@system.com", description: "Media inquiries and archival access.", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop", resources: [{ name: "Brand Assets", size: "ZIP" }] },
    { id: 4, title: "Atelier", email: "custom@system.com", description: "Bespoke tailoring services.", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2680&auto=format&fit=crop", resources: [{ name: "Material Archive", size: "PDF" }] }
  ];

  const activeData = departments.find(d => d.id === activeTab);
  const isOverlayOpen = activeTab !== 1;

  return (
    <div className="relative min-h-screen bg-[#F4F4F4] text-[#111] font-sans overflow-hidden">
      <GrainTexture />

      <main className="grid grid-cols-1 lg:grid-cols-12 min-h-screen pt-0">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 relative flex flex-col border-r border-stone-300">
           <div className="absolute inset-0 overflow-hidden -z-10 bg-stone-200">
             <AnimatePresence mode="wait">
               {hoveredDept && (
                 <motion.div key={hoveredDept} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 0.15, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full bg-black">
                   <div className="w-full h-full grayscale opacity-50 bg-[url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center" />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          <div className="relative z-10 p-6 md:p-12 lg:p-16 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-12">
                <div className="flex flex-col">
                    <span className="font-bold tracking-tight text-xl">CONTACT<span className="text-red-500">_</span>SYS</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest mt-1">Global Portal</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-mono uppercase">Session ID</span>
                    <span className="block text-xl font-mono tracking-widest">#{ticketID}</span>
                </div>
            </div>
            <div>
                <h1 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 md:mb-12 text-stone-400">01 — Select Department</h1>
                <div className="flex flex-col">
                {departments.map((dept) => (
                    <DepartmentItem key={dept.id} id={dept.id} title={dept.title} email={dept.email} isActive={activeTab === dept.id} onClick={setActiveTab} onHover={() => setHoveredDept(dept.id)} onLeave={() => setHoveredDept(null)} />
                ))}
                </div>
            </div>
            <div className="mt-16 md:mt-12 flex flex-col md:flex-row gap-8 md:gap-12 text-xs font-mono uppercase text-stone-500">
              <div><span className="block text-black font-bold">Location</span><span className="block mt-1">102 Rue de Turenne</span></div>
              <div><span className="block text-black font-bold">Hours</span><span className="block mt-1">Mon - Fri / 09:00 - 18:00</span></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 bg-stone-100 flex flex-col h-[50vh] lg:h-auto overflow-hidden relative z-0">
            <SpringBinding />

            <div className="relative flex-1 w-full perspective-[2500px]">
                {/* 1. CONTACT FORM (Transforms into paper) */}
                <div className="absolute inset-0 z-10">
                    {sendStage === 'sent' ? (
                        <SuccessMessage />
                    ) : (
                        <ContactForm onSend={handleSendSequence} animationStage={sendStage} />
                    )}
                </div>

                {/* 2. ENVELOPE (Appears during animation) */}
                <AnimatePresence>
                    {(['enveloping-insert', 'enveloping-close', 'sending'].includes(sendStage)) && (
                        <Envelope stage={sendStage} />
                    )}
                </AnimatePresence>

                {/* 3. FLIPPING INFO PAGES */}
                <AnimatePresence>
                    {isOverlayOpen && (
                        <InfoPage key={activeTab} data={activeData} onClose={() => setActiveTab(1)} />
                    )}
                </AnimatePresence>
            </div>
        </div>

      </main>
    </div>
  );
};

export default FashionContactPage;