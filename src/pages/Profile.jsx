import React, { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { 
  FaShoppingBag, FaHeart, FaUser, FaMapMarkerAlt, 
  FaBook, FaCamera, FaTimes, FaBoxOpen, FaCheck, FaChevronLeft, FaChevronRight, 
  FaSave, FaHistory, FaArrowRight, FaTint, FaBirthdayCake, FaPhone, FaLocationArrow,
  FaCheckCircle
} from 'react-icons/fa';

// --- CONSTANTS ---
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// --- UTILS ---
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return canvas.toDataURL('image/jpeg');
}

const INITIAL_LEDGER_DATA = Array.from({ length: 12 }, (_, i) => ({
    monthIndex: i,
    monthName: new Date(0, i).toLocaleString("default", { month: "long" }),
    expenses: { Inventory: 0, Marketing: 0, Logistics: 0, Misc: 0 },
}));

// ==================================================================================
// ========================= LEDGER BOOK COMPONENTS =================================
// ==================================================================================

const PaperGrain = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-[0.08] mix-blend-multiply">
    <filter id='paperNoise'>
      <feTurbulence type='fractalNoise' baseFrequency='0.60' numOctaves='4' stitchTiles='stitch' />
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width='100%' height='100%' filter='url(#paperNoise)' fill="#f0ead6"/>
  </svg>
);

const LedgerInputRow = memo(({ label, value, onChange, disabled }) => (
  <div className="flex items-center justify-between border-b border-[#5c4033]/20 pb-1 mb-3 hover:bg-[#5c4033]/5 transition-colors px-2">
    <label className="font-serif italic text-gray-700 w-32 text-sm">{label}</label>
    <div className="flex items-center">
        <span className="text-gray-400 mr-2 font-mono text-xs">$</span>
        <input 
            type="number" 
            disabled={disabled}
            placeholder="0"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`bg-transparent text-right font-mono text-lg font-bold text-[#5c4033] focus:outline-none w-24 placeholder-gray-300 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        />
    </div>
  </div>
));

const LedgerLeftPage = ({ pageIndex, data, year }) => {
    if (pageIndex === 12) {
        return (
            <div className="w-full h-full p-10 border-r border-[#dcd6ce] flex flex-col justify-center items-center text-center bg-[#f4f1ea] relative">
                <PaperGrain />
                <h2 className="text-4xl font-serif font-black text-[#5c4033] mb-4 relative z-10">Annual<br/>Report</h2>
                <h3 className="text-xl font-mono text-[#5c4033]/60 mb-6 relative z-10">{year}</h3>
                <p className="font-mono text-xs text-gray-500 max-w-xs leading-relaxed relative z-10">
                   Summary of all expenses recorded from January through December.
                </p>
                <span className="text-[10px] text-center font-mono text-gray-400 block mt-auto relative z-10">Page {pageIndex * 2 + 1}</span>
            </div>
        );
    }

    if (!data) return <div className="w-full h-full bg-[#f4f1ea] relative"><PaperGrain/></div>;

    return (
        <div className="w-full h-full p-10 border-r border-[#dcd6ce] flex flex-col justify-between bg-[#f4f1ea] relative">
            <PaperGrain />
            <div className="relative z-10 h-full flex flex-col">
                <div className="mt-8 text-center">
                    <h3 className="text-xs font-bold tracking-[0.3em] text-[#5c4033]/60 uppercase mb-2">Month {pageIndex + 1} • {year}</h3>
                    <h2 className="text-5xl font-serif font-black text-[#5c4033] tracking-wide">{data.monthName}</h2>
                    <div className="w-12 h-1 bg-[#5c4033] mx-auto mt-6"></div>
                </div>
                
                <div className="space-y-4 mb-8 opacity-60 mt-auto">
                    <div className="h-[1px] w-full bg-[#5c4033]/20"></div>
                    <p className="font-serif italic text-center text-[#5c4033] text-sm">
                        "A penny saved is a penny earned."
                    </p>
                    <div className="h-[1px] w-full bg-[#5c4033]/20"></div>
                </div>

                <div className="text-center mb-8">
                        <p className="font-mono text-xs uppercase text-gray-400 mb-1">Current Total</p>
                        <p className="font-mono text-3xl font-bold text-[#5c4033]">
                        ${Object.values(data.expenses).reduce((a, b) => a + Number(b), 0).toFixed(2)}
                        </p>
                </div>
                <span className="text-[10px] text-center font-mono text-gray-400 block mt-auto">Page {pageIndex * 2 + 1}</span>
            </div>
        </div>
    );
};

const LedgerRightPage = ({ 
    pageIndex, data, yearlyStats, handleInputChange, 
    maxExpense, totalYearly, year, isReadOnly, onSaveYear 
}) => {
    if (pageIndex === 12) {
        return (
            <div className="w-full h-full p-10 bg-[#fffefb] flex flex-col relative">
                 <PaperGrain />
                 <div className="relative z-10 h-full flex flex-col">
                    <h3 className="font-serif italic text-xl text-[#5c4033] mb-4 border-b border-[#5c4033]/20 pb-2">Analysis ({year})</h3>
                    <div className="flex-1 flex items-end justify-between gap-1 pb-4">
                        {yearlyStats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center w-full h-full justify-end group">
                                <div className="w-full relative flex items-end h-full justify-center">
                                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-1 py-0.5 rounded pointer-events-none">
                                        ${stat.total}
                                        </div>
                                        <div 
                                        style={{ height: `${Math.max((stat.total / maxExpense) * 100, 5)}%` }}
                                        className={`w-full max-w-[24px] rounded-t-[2px] transition-all duration-500 ${stat.total > 0 ? 'bg-[#5c4033]' : 'bg-gray-200'}`}
                                        />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between border-t border-[#5c4033] pt-2">
                        {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m,i) => (
                            <span key={i} className="text-[9px] font-bold text-gray-400 w-full text-center">{m}</span>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-serif italic text-sm text-[#5c4033]">Grand Total</span>
                        <span className="font-mono text-2xl font-bold text-[#5c4033] border-b-2 border-double border-[#5c4033]">
                            ${totalYearly.toFixed(2)}
                        </span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#5c4033]/10">
                        {!isReadOnly ? (
                            <button 
                                onClick={onSaveYear}
                                className="w-full py-3 bg-[#5c4033] text-[#f4f1ea] font-serif italic text-sm hover:bg-[#4a332a] transition-colors flex items-center justify-center gap-2 shadow-sm rounded-sm"
                            >
                                <FaSave /> Save {year} Ledger & Start New
                            </button>
                        ) : (
                            <div className="w-full py-3 bg-gray-100 text-gray-400 font-serif italic text-sm flex items-center justify-center gap-2 rounded-sm border border-gray-200 cursor-not-allowed">
                                <FaCheck /> {year} Ledger Archived
                            </div>
                        )}
                    </div>

                    <span className="text-[10px] text-center font-mono text-gray-400 block mt-auto">Page {pageIndex * 2 + 2}</span>
                </div>
            </div>
        );
    }

    if (!data) return <div className="w-full h-full bg-[#fffefb] relative"><PaperGrain/></div>;

    return (
        <div className="w-full h-full p-10 bg-[#fffefb] flex flex-col relative">
            <PaperGrain />
            <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-end mb-8 border-b border-[#5c4033]/20 pb-2">
                    <h3 className="font-serif italic text-xl text-[#5c4033]">Expenses</h3>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{year}</span>
                </div>

                <div className="space-y-1">
                    {Object.keys(data.expenses).map((key) => (
                        <LedgerInputRow 
                            key={key} 
                            label={key} 
                            value={data.expenses[key]} 
                            onChange={(val) => handleInputChange(val, key)} 
                            disabled={isReadOnly}
                        />
                    ))}
                </div>
                
                <span className="text-[10px] text-center font-mono text-gray-400 block mt-auto">Page {pageIndex * 2 + 2}</span>
            </div>
        </div>
    );
};

const LedgerBook = ({ isOpen, onClose }) => {
    const [page, setPage] = useState(0); 
    const [currentDraftYear, setCurrentDraftYear] = useState(2025); 
    const [viewingYear, setViewingYear] = useState(2025); 
    const [savedLedgers, setSavedLedgers] = useState({}); 
    const [draftData, setDraftData] = useState(INITIAL_LEDGER_DATA);
    const isReadOnly = viewingYear !== currentDraftYear;
    
    const activeData = useMemo(() => {
        if (viewingYear === currentDraftYear) return draftData;
        return savedLedgers[viewingYear] || INITIAL_LEDGER_DATA;
    }, [viewingYear, currentDraftYear, draftData, savedLedgers]);

    const [direction, setDirection] = useState(0); 
    const [isAnimating, setIsAnimating] = useState(false);
    
    const yearlyStats = useMemo(() => {
      return activeData.map((data) => {
        const total = Object.values(data.expenses).reduce((a, b) => a + Number(b), 0);
        return { month: data.monthName.substring(0, 3), total };
      });
    }, [activeData]);

    const maxExpense = Math.max(...yearlyStats.map((s) => s.total), 100); 
    const totalYearly = yearlyStats.reduce((acc, curr) => acc + curr.total, 0);

    const handleInputChange = useCallback((value, field) => {
      if(isAnimating || isReadOnly) return; 
      setDraftData(prev => {
        const newData = prev.map(item => ({...item, expenses: {...item.expenses}})); 
        if (newData[page]) newData[page].expenses[field] = Number(value);
        return newData;
      });
    }, [page, isAnimating, isReadOnly]);

    const handleSaveYear = () => {
        setSavedLedgers(prev => ({ ...prev, [currentDraftYear]: draftData }));
        const nextYear = currentDraftYear + 1;
        setCurrentDraftYear(nextYear);
        setDraftData(INITIAL_LEDGER_DATA);
        setViewingYear(nextYear);
        setPage(0);
    };

    const totalPages = 13; 
    const ANIMATION_DURATION = 600;

    const handleNext = () => {
        if (isAnimating || page >= totalPages - 1) return;
        setDirection(1);
        setIsAnimating(true);
        setTimeout(() => { setPage(p => p + 1); setIsAnimating(false); }, ANIMATION_DURATION);
    };

    const handlePrev = () => {
        if (isAnimating || page <= 0) return;
        setDirection(-1);
        setIsAnimating(true);
        setTimeout(() => { setPage(p => p - 1); setIsAnimating(false); }, ANIMATION_DURATION);
    };

    let leftBgIdx = page;
    let rightBgIdx = page;
    let flipperFrontIdx = page;
    let flipperBackIdx = page;

    if (isAnimating) {
        if (direction === 1) {
            leftBgIdx = page; rightBgIdx = page + 1; flipperFrontIdx = page; flipperBackIdx = page + 1;  
        } else {
            leftBgIdx = page - 1; rightBgIdx = page; flipperFrontIdx = page - 1; flipperBackIdx = page;          
        }
    }

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } }
    };

    const bookVariants = {
        hidden: { scale: 0.95, opacity: 0, rotateX: 5, y: 20 },
        visible: { scale: 1, opacity: 1, rotateX: 0, y: 0, transition: { type: "spring", damping: 30, stiffness: 200, mass: 0.8 } },
        exit: { scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.25, ease: "easeInOut" } }
    };

    return (
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 perspective-2000" initial="hidden" animate="visible" exit="exit">
        <motion.div className="absolute inset-0 bg-black/90" variants={backdropVariants} onClick={onClose} />
        
        <motion.div variants={backdropVariants} className="absolute top-8 left-8 z-[60] flex items-center gap-3">
            <div className="relative">
                <FaHistory className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xs pointer-events-none"/>
                <select value={viewingYear} onChange={(e) => { setViewingYear(Number(e.target.value)); setPage(0); }} className="pl-8 pr-4 py-2 bg-white/10 text-white border border-white/20 rounded-full text-sm focus:outline-none focus:bg-white/20 hover:bg-white/20 transition-all appearance-none cursor-pointer font-mono">
                    <option value={currentDraftYear} className="bg-gray-900 text-white">Draft: {currentDraftYear}</option>
                    {Object.keys(savedLedgers).sort((a,b) => b-a).map(y => ( <option key={y} value={y} className="bg-gray-900 text-white">Saved: {y}</option> ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white/50"></div>
            </div>
        </motion.div>
        <motion.button onClick={onClose} className="absolute top-8 right-8 z-[60] text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-red-500/80" variants={backdropVariants}><FaTimes size={24} /></motion.button>
        <motion.button onClick={handlePrev} disabled={page === 0 || isAnimating} className={`absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-[60] text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/20 p-4 rounded-full ${page === 0 ? 'opacity-30 cursor-not-allowed' : ''}`} variants={backdropVariants}><FaChevronLeft size={32} /></motion.button>
        <motion.button onClick={handleNext} disabled={page === totalPages - 1 || isAnimating} className={`absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-[60] text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/20 p-4 rounded-full ${page === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : ''}`} variants={backdropVariants}><FaChevronRight size={32} /></motion.button>

        <motion.div className="relative w-full max-w-[900px] aspect-[1.7/1] shadow-2xl flex rounded-lg bg-[#2a1d17] perspective-[2500px]" variants={bookVariants} onClick={(e) => e.stopPropagation()}>
             <div className="absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.3)] to-transparent z-40 pointer-events-none mix-blend-multiply"></div>
             <div className="absolute left-1/2 top-[1%] bottom-[1%] w-[1px] bg-[#5c4033]/30 z-40 opacity-60"></div>

             <div className="flex-1 rounded-l-lg border-r border-[#dcd6ce] overflow-hidden relative z-0 bg-[#f4f1ea]">
                <LedgerLeftPage key={`left-${leftBgIdx}`} pageIndex={leftBgIdx} data={activeData[leftBgIdx] || activeData[0]} year={viewingYear}/>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[rgba(0,0,0,0.05)] to-transparent z-20 pointer-events-none"></div>
             </div>

             <div className="flex-1 rounded-r-lg overflow-hidden relative z-0 bg-[#fffefb]">
                <LedgerRightPage key={`right-${rightBgIdx}`} pageIndex={rightBgIdx} data={activeData[rightBgIdx] || activeData[0]} yearlyStats={yearlyStats} handleInputChange={handleInputChange} maxExpense={maxExpense} totalYearly={totalYearly} year={viewingYear} isReadOnly={isReadOnly} onSaveYear={handleSaveYear} />
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[rgba(0,0,0,0.05)] to-transparent z-20 pointer-events-none"></div>
             </div>

             {isAnimating && (
                <motion.div
                    initial={{ rotateY: direction === 1 ? 0 : -180 }}
                    animate={{ rotateY: direction === 1 ? -180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1.000] }}
                    style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d', position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', zIndex: 30 }}
                >
                    <div className="absolute inset-0 w-full h-full bg-[#fffefb] rounded-r-lg backface-hidden overflow-hidden border-l border-[#dcd6ce]" style={{ backfaceVisibility: 'hidden' }}>
                        <LedgerRightPage key={`flip-front-${flipperFrontIdx}`} pageIndex={flipperFrontIdx} data={activeData[flipperFrontIdx] || activeData[0]} yearlyStats={yearlyStats} handleInputChange={() => {}} maxExpense={maxExpense} totalYearly={totalYearly} year={viewingYear} isReadOnly={isReadOnly} onSaveYear={handleSaveYear} />
                         <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[rgba(0,0,0,0.1)] to-transparent z-20 pointer-events-none"></div>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "linear" }} className="absolute inset-0 bg-gradient-to-l from-transparent to-black pointer-events-none z-25" />
                    </div>
                    <div className="absolute inset-0 w-full h-full bg-[#f4f1ea] rounded-l-lg backface-hidden overflow-hidden border-r border-[#dcd6ce]" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <LedgerLeftPage key={`flip-back-${flipperBackIdx}`} pageIndex={flipperBackIdx} data={activeData[flipperBackIdx] || activeData[0]} year={viewingYear} />
                         <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[rgba(0,0,0,0.1)] to-transparent z-20 pointer-events-none"></div>
                         <motion.div initial={{ opacity: 0.1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.3, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent to-black pointer-events-none z-25" />
                    </div>
                </motion.div>
             )}
        </motion.div>
      </motion.div>
    );
};

// ==================================================================================
// ========================= MAIN PROFILE COMPONENT =================================
// ==================================================================================

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- 1. NEW STATE FOR TOAST NOTIFICATION ---
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }

  // --- DYNAMIC STATE ---
  const [user, setUser] = useState({
      name: "Loading...",
      email: "",
      mobile: "",
      dob: "",
      bloodGroup: "",
      address: "",
      tier: "Silver",
      points: 0,
      avatar: DEFAULT_AVATAR,
      createdAt: null
  });
  const [orders, setOrders] = useState([]);

  // Image Upload State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);

  // --- HELPER: SHOW TOAST ---
  const showToast = (message) => {
      setToast(message);
      setTimeout(() => setToast(null), 3000); // Hide after 3 seconds
  };

  // --- 2. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : null;

        if (!token) {
             setLoading(false);
             return; 
        }

        try {
            const userRes = await fetch('https://fashion-store-ak.onrender.com/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (userRes.status === 401) {
                localStorage.removeItem('userInfo');
                window.location.reload();
                return;
            }

            const userData = await userRes.json();
            if(userRes.ok) {
                setUser(prev => ({ ...prev, ...userData, avatar: userData.avatar || DEFAULT_AVATAR }));
                // ⚠️ SHOW WELCOME TOAST ON LOAD
                showToast(`Welcome back, ${userData.name.split(' ')[0]}!`);
            }

            const orderRes = await fetch('https://fashion-store-ak.onrender.com/api/orders/myorders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const orderData = await orderRes.json();
            if(orderRes.ok) setOrders(orderData);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels), []);
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => { setImageSrc(reader.result); setIsCropping(true); });
      reader.readAsDataURL(file);
    }
  };
  
  const showCroppedImage = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      setUser(prev => ({ ...prev, avatar: croppedImageBase64 }));
      setIsCropping(false); 
      setImageSrc(null);
    } catch (e) { console.error(e); }
  };

  const handleGetLocation = () => {
      if (!navigator.geolocation) {
          alert("Geolocation is not supported by your browser");
          return;
      }
      navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await response.json();
              if (data && data.display_name) {
                  setUser(prev => ({ ...prev, address: data.display_name }));
              } else {
                  alert("Could not fetch address details.");
              }
          } catch (error) {
              console.error("Geocoding error:", error);
              alert("Error fetching address details.");
          }
      }, () => {
          alert("Unable to retrieve your location. Please check permissions.");
      });
  };

  const handleSaveChanges = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) return;
      const token = JSON.parse(userInfo).token;
      
      try {
          const res = await fetch('https://fashion-store-ak.onrender.com/api/users/profile', {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                  name: user.name,
                  email: user.email,
                  mobile: user.mobile,
                  dob: user.dob,
                  bloodGroup: user.bloodGroup,
                  address: user.address,
                  avatar: user.avatar 
              })
          });

          const updatedUser = await res.json();
          if (res.ok) {
              setUser(prev => ({ ...prev, ...updatedUser }));
              const ls = JSON.parse(localStorage.getItem('userInfo'));
              ls.name = updatedUser.name;
              localStorage.setItem('userInfo', JSON.stringify(ls));
              
              setIsEditing(false);
              // ⚠️ SHOW SUCCESS TOAST
              showToast("Profile Updated Successfully!");
          } else {
              alert(updatedUser.message || "Failed to update profile");
          }
      } catch (error) {
          console.error(error);
          alert("Server Error");
      }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

  const NavItem = ({ icon, label, active, onClick }) => (
    <motion.button 
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
      whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.02)" }} whileTap={{ scale: 0.98 }}
      onClick={onClick} 
      className={`w-full flex items-center justify-between p-5 mb-2 rounded-none border-l-2 transition-all duration-300 group ${active ? 'border-black bg-gray-50' : 'border-transparent hover:border-gray-300'}`}
    >
      <div className="flex items-center gap-5">
        <span className={`text-xl transition-colors ${active ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>{icon}</span>
        <span className={`font-serif text-lg tracking-wide ${active ? 'text-black font-medium' : 'text-gray-500 group-hover:text-gray-900'}`}>{label}</span>
      </div>
      {active && <motion.div layoutId="nav-dot" className="w-1.5 h-1.5 bg-black rounded-full" />}
    </motion.button>
  );

  const OrderRow = ({ order }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="flex flex-col md:flex-row items-center gap-6 p-6 border border-gray-100 bg-white group cursor-pointer relative overflow-hidden transition-all duration-300"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
      <div className="w-full md:w-24 h-32 bg-gray-100 overflow-hidden shrink-0 relative">
        <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.7 }} src={order.orderItems?.[0]?.image || DEFAULT_AVATAR} alt="Product" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 w-full">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-mono text-xs text-gray-400 tracking-widest">#{order._id?.slice(-6).toUpperCase()}</h4>
          <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 border ${order.status === 'Delivered' ? 'border-gray-200 text-gray-600' : 'border-black text-black'}`}>{order.status || "Processing"}</span>
        </div>
        <h3 className="font-serif text-xl text-gray-900 mb-2 group-hover:underline decoration-1 underline-offset-4">{order.orderItems?.length || 0} Items</h3>
        <div className="flex justify-between items-center mt-4 border-t border-gray-50 pt-3">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</span>
          <span className="font-serif text-lg italic">₹{order.totalPrice}</span>
        </div>
      </div>
      <div className="hidden md:flex text-gray-300 group-hover:text-black transition-colors transform group-hover:translate-x-1 duration-300">
          <FaArrowRight />
      </div>
    </motion.div>
  );

  return (
    <motion.div className="min-h-screen bg-white text-gray-900 font-sans pb-20 selection:bg-black selection:text-white" initial="hidden" animate="visible" variants={containerVariants}>
      
      {/* HEADER */}
      <div className="h-[40vh] w-full relative overflow-hidden bg-gray-900">
         <motion.div initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Header"/>
         </motion.div>
         <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
         <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-7xl mx-auto">
             <motion.h1 className="text-6xl md:text-9xl font-serif text-transparent stroke-text opacity-10 leading-none select-none absolute -top-20 md:-top-32 left-0 w-full" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.2)" }}>PORTFOLIO</motion.h1>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-end gap-10 mb-16">
           <div className="relative group">
              <motion.div whileHover={{ scale: 1.02 }} className="w-40 h-40 md:w-56 md:h-56 shadow-2xl overflow-hidden bg-white relative z-10">
                <img src={user.avatar || DEFAULT_AVATAR} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" />
                <div className="absolute inset-0 border border-black/10"></div>
              </motion.div>
              
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current.click()} className="absolute -bottom-4 -right-4 z-20 bg-black text-white w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <FaCamera size={16} />
              </motion.button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
           </div>
           
           <div className="flex-1 pb-4">
              <motion.div variants={itemVariants}>
                  <h1 className="text-5xl md:text-7xl font-serif font-medium mb-3 tracking-tight">{user.name || "Loading..."}</h1>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium tracking-widest uppercase">
                      <span>{user.email}</span>
                      <span className="w-1 h-1 bg-black rounded-full"></span>
                      <span>Joined {user.createdAt ? new Date(user.createdAt).getFullYear() : '...'}</span>
                      <span className="w-1 h-1 bg-black rounded-full"></span>
                      <span className="text-black border-b border-black pb-0.5">{user.tier || 'Member'}</span>
                  </div>
              </motion.div>
           </div>
           
           <motion.div variants={itemVariants} className="hidden md:block pb-6">
              <button onClick={() => setIsEditing(true)} className="px-10 py-4 bg-white border border-gray-200 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 hover:shadow-xl">
                Edit Profile
              </button>
           </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3 space-y-2">
            <NavItem icon={<FaUser />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavItem icon={<FaShoppingBag />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
            <NavItem icon={<FaHeart />} label="Wishlist" active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} />
            <NavItem icon={<FaMapMarkerAlt />} label="Address" active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-12 mt-8 border-t border-gray-100">
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "#fdfbf7" }} whileTap={{ scale: 0.98 }} onClick={() => setIsLedgerOpen(true)} className="w-full flex flex-col items-center gap-4 text-[#5c4033] p-8 border border-[#5c4033]/20 hover:border-[#5c4033] transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#5c4033] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <FaBook className="text-3xl mb-2 opacity-80 group-hover:scale-110 transition-transform duration-500" /> 
                    <div className="text-center">
                        <span className="font-serif font-bold italic text-xl block mb-1">The Ledger</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-60">Monthly Expenses</span>
                    </div>
                </motion.button>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-9 min-h-[500px]">
             <AnimatePresence mode="wait">
               <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5, ease: "circOut" }}>
                 
                 {activeTab === 'overview' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="md:col-span-1">
                             <motion.div whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02 }} style={{ perspective: 1000 }} className="relative w-full aspect-[1.586/1] bg-[#111] text-white overflow-hidden shadow-2xl p-8 flex flex-col justify-between group transition-all">
                                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                <motion.div className="absolute -right-20 -top-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />
                                <div className="relative z-10 flex justify-between items-start">
                                    <h3 className="font-serif text-3xl italic">FASHION<span className="text-red-600">.</span></h3>
                                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                        <div className="w-full h-[1px] bg-white transform -rotate-45"></div>
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <p className="font-mono text-xl tracking-[0.2em] mb-6 text-gray-300 group-hover:text-white transition-colors">•••• •••• •••• {user._id ? user._id.slice(-4) : "8842"}</p>
                                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                        <div><p className="text-[9px] uppercase text-gray-500 tracking-widest mb-1">Holder</p><p className="font-sans text-sm font-medium uppercase tracking-wider">{user.name}</p></div>
                                        <div className="text-right"><p className="text-[9px] uppercase text-gray-500 tracking-widest mb-1">Points</p><p className="font-serif text-2xl italic">{user.points?.toLocaleString()}</p></div>
                                    </div>
                                </div>
                             </motion.div>

                             <div className="mt-8 bg-gray-50 p-6 rounded-md border border-gray-100">
                                 <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Personal Details</h3>
                                 <div className="space-y-3">
                                     <div className="flex items-center gap-3"><FaPhone className="text-gray-300" /><span className="text-sm">{user.mobile || "N/A"}</span></div>
                                     <div className="flex items-center gap-3"><FaBirthdayCake className="text-gray-300" /><span className="text-sm">{user.dob || "N/A"}</span></div>
                                     <div className="flex items-center gap-3"><FaTint className="text-gray-300" /><span className="text-sm">{user.bloodGroup || "N/A"}</span></div>
                                     <div className="flex items-center gap-3"><FaLocationArrow className="text-gray-300" /><span className="text-sm truncate">{user.address || "N/A"}</span></div>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="md:col-span-1">
                             <div className="flex justify-between items-baseline mb-6 border-b border-black pb-2">
                                 <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Latest Purchase</h2>
                                 <button onClick={() => setActiveTab('orders')} className="text-[10px] uppercase tracking-widest hover:underline decoration-1 underline-offset-4">View All</button>
                             </div>
                             {orders.length > 0 ? (
                                <OrderRow order={orders[0]} />
                             ) : (
                                <p className="text-sm text-gray-400 italic">No orders yet.</p>
                             )}
                             
                             <div className="mt-12 grid grid-cols-2 gap-6">
                                 <motion.div whileHover={{ y: -5 }} className="bg-gray-50 p-8 text-center cursor-pointer border border-transparent hover:border-black transition-all duration-500 group">
                                     <FaBoxOpen className="mx-auto text-3xl text-gray-300 mb-4 group-hover:text-black transition-colors" />
                                     <span className="block text-4xl font-serif font-medium mb-1">{orders.length}</span>
                                     <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest group-hover:text-black">Orders</span>
                                 </motion.div>
                                 <motion.div whileHover={{ y: -5 }} className="bg-gray-50 p-8 text-center cursor-pointer border border-transparent hover:border-black transition-all duration-500 group">
                                     <FaHeart className="mx-auto text-3xl text-gray-300 mb-4 group-hover:text-red-500 transition-colors" />
                                     <span className="block text-4xl font-serif font-medium mb-1">0</span>
                                     <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest group-hover:text-black">Saved</span>
                                 </motion.div>
                             </div>
                         </div>
                     </div>
                 )}

                 {activeTab === 'orders' && (
                   <div className="space-y-8">
                       <div className="flex justify-between items-end border-b border-black pb-4 mb-8">
                            <h2 className="text-3xl font-serif italic">Order History</h2>
                            <span className="font-mono text-xs text-gray-400">{new Date().getFullYear()}</span>
                       </div>
                       <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                           {orders.length > 0 ? orders.map((order) => <OrderRow key={order._id} order={order} />) : <p className="text-gray-400">No orders found.</p>}
                       </motion.div>
                   </div>
                 )}

                 {(activeTab === 'wishlist' || activeTab === 'addresses') && (
                     <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
                         <p className="text-gray-400 text-sm uppercase tracking-widest">Coming Soon</p>
                     </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CROPPER OVERLAY */}
      {isCropping && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-black flex flex-col">
            <div className="relative flex-1 bg-black"><Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
            <div className="h-24 bg-white p-6 flex items-center justify-between gap-8">
                <div className="flex-1"><input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"/></div>
                <div className="flex gap-4">
                    <button onClick={() => { setIsCropping(false); setImageSrc(null); }} className="px-8 py-2 border border-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={showCroppedImage} className="px-8 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 transition-colors"><FaCheck /> Crop</button>
                </div>
            </div>
        </motion.div>
      )}

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditing && (
            <div className="fixed inset-0 z-50 overflow-hidden">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-white/80 backdrop-blur-md" />
                <motion.div 
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 30, stiffness: 300 }} 
                    className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100"
                >
                    <div className="p-10 flex justify-between items-center bg-white z-10">
                        <h2 className="text-3xl font-serif italic">Edit Profile</h2>
                        <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center hover:rotate-90 transition-transform duration-300"><FaTimes size={20}/></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-10 space-y-8">
                        {/* INPUT FIELDS (Keep all your existing inputs here) */}
                        <div className="group relative">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest group-focus-within:text-black transition-colors">Full Name</label>
                            <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="w-full border-b border-gray-200 py-3 text-xl font-serif focus:outline-none focus:border-black bg-transparent transition-colors" />
                        </div>
                        <div className="group relative">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest group-focus-within:text-black transition-colors">Email Address</label>
                            <input type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="w-full border-b border-gray-200 py-3 text-xl font-serif focus:outline-none focus:border-black bg-transparent transition-colors" />
                        </div>
                        <div className="group relative">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest group-focus-within:text-black transition-colors">Mobile Number</label>
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-gray-300" />
                                <input type="tel" value={user.mobile || ''} onChange={(e) => setUser({...user, mobile: e.target.value})} placeholder="+91..." className="w-full border-b border-gray-200 py-3 text-xl font-serif focus:outline-none focus:border-black bg-transparent transition-colors" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group relative">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest group-focus-within:text-black transition-colors">Date of Birth</label>
                                <input type="date" value={user.dob || ''} onChange={(e) => setUser({...user, dob: e.target.value})} className="w-full border-b border-gray-200 py-3 text-lg font-serif focus:outline-none focus:border-black bg-transparent transition-colors" />
                            </div>
                            <div className="group relative">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest group-focus-within:text-black transition-colors">Blood Group</label>
                                <select value={user.bloodGroup || ''} onChange={(e) => setUser({...user, bloodGroup: e.target.value})} className="w-full border-b border-gray-200 py-3 text-lg font-serif focus:outline-none focus:border-black bg-transparent transition-colors appearance-none cursor-pointer">
                                    <option value="">Select</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                        </div>
                        <div className="group relative">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest group-focus-within:text-black transition-colors">Address</label>
                            <div className="relative">
                                <textarea rows="3" value={user.address || ''} onChange={(e) => setUser({...user, address: e.target.value})} className="w-full border border-gray-200 p-3 text-sm font-sans focus:outline-none focus:border-black bg-gray-50 rounded-none transition-colors resize-none mb-2" placeholder="Enter address or fetch location..." />
                                <button type="button" onClick={handleGetLocation} className="absolute right-2 bottom-4 text-[10px] bg-black text-white px-2 py-1 uppercase tracking-widest flex items-center gap-1 hover:bg-gray-800 transition-colors">
                                    <FaLocationArrow /> Get Location
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-10 bg-gray-50 border-t border-gray-100">
                        <button onClick={handleSaveChanges} className="w-full bg-black text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl">
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLedgerOpen && <LedgerBook isOpen={isLedgerOpen} onClose={() => setIsLedgerOpen(false)} />}
      </AnimatePresence>

      {/* --- ⚠️ NEW: TOAST NOTIFICATION COMPONENT --- */}
      <AnimatePresence>
        {toast && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 20 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="fixed bottom-8 right-8 z-[100] bg-black text-white px-6 py-4 rounded shadow-2xl flex items-center gap-4 border-l-4 border-green-500"
            >
                <FaCheckCircle className="text-green-400 text-xl" />
                <span className="font-serif italic tracking-wide text-sm">{toast}</span>
            </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Profile;