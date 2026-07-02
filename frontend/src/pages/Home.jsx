import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Gift, 
  Percent, 
  Timer, 
  Bell, 
  Check, 
  Cpu, 
  Star, 
  Layers, 
  Smartphone, 
  Gamepad2, 
  Headphones, 
  Laptop
} from 'lucide-react';
import { getProductsApi } from '../services/api';

const HERO_SLIDES = [
  {
    id: 1,
    title: "MEGA GADGET SHOWDOWN",
    subtitle: "UP TO 60% OFF",
    description: "Upgrade your tech arsenal with premium laptops, next-gen consoles, and smart wear. Flash deals are live now!",
    accentText: "Limited Time Offer",
    bgGradient: "from-blue-600/90 to-indigo-950",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    ctaText: "Explore Sale"
  },
  {
    id: 2,
    title: "THE NEXT ERA OF SOUND",
    subtitle: "AURA AUDIO LABS",
    description: "Experience hybrid active noise cancellation, high-fidelity acoustics, and 60-hour battery life with Aura Pods Pro.",
    accentText: "Brand New Launch",
    bgGradient: "from-purple-800/90 to-emerald-950",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    ctaText: "Pre-order Now"
  },
  {
    id: 3,
    title: "REDEFINE WORK & PLAY",
    subtitle: "ULTRA BOOK MONSTERS",
    description: "Power through compile times and rendering with Intel Ultra 9 processors, RTX 4080 graphics, and liquid retina screens.",
    accentText: "Exclusive Deals",
    bgGradient: "from-rose-800/90 to-slate-950",
    image: "https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=800&auto=format&fit=crop",
    ctaText: "Shop Laptops"
  }
];

const FLASH_SALE_ITEMS = [
  {
    id: 1,
    title: "Aura Watch Series 5",
    originalPrice: 9999,
    salePrice: 4999,
    discount: "50% OFF",
    stockTotal: 50,
    stockLeft: 12,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop",
    rating: 4.8
  },
  {
    id: 2,
    title: "Noise-Cancelling Aura Pods",
    originalPrice: 19999,
    salePrice: 14999,
    discount: "25% OFF",
    stockTotal: 40,
    stockLeft: 18,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 3,
    title: "Nova Mechanical Keyboard",
    originalPrice: 7999,
    salePrice: 3999,
    discount: "50% OFF",
    stockTotal: 30,
    stockLeft: 7,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?q=80&w=400&auto=format&fit=crop",
    rating: 4.6
  },
  {
    id: 4,
    title: "Hyperion VR Controller Bundle",
    originalPrice: 14999,
    salePrice: 8999,
    discount: "40% OFF",
    stockTotal: 25,
    stockLeft: 6,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=400&auto=format&fit=crop",
    rating: 4.9
  }
];

const UPCOMING_GADGETS = [
  {
    id: "up-1",
    title: "Aura Phone 3 Pro",
    launchDate: "August 2026",
    specs: ["Snapdragon 8 Gen 5", "200MP Triple Cam", "144Hz LTPO OLED", "5500mAh 120W Charge"],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
    estimatedPrice: "₹74,999",
    highlight: "Next-gen AI integration"
  },
  {
    id: "up-2",
    title: "Vision Glass VR",
    launchDate: "September 2026",
    specs: ["Dual 4K MicroOLED", "Hand & Eye Tracking", "M2 Coprocessor", "Super Light Design"],
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400&auto=format&fit=crop",
    estimatedPrice: "₹2,49,999",
    highlight: "Full spatial computing"
  },
  {
    id: "up-3",
    title: "Apex Soundbar Horizon",
    launchDate: "July 2026",
    specs: ["9.1.4 Dolby Atmos", "Wireless Subwoofer", "Auto-Room Calibration", "True Wireless Rear"],
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=400&auto=format&fit=crop",
    estimatedPrice: "₹45,000",
    highlight: "Acoustic Lens Tech"
  }
];

const BUNDLE_TABS = {
  combos: [
    {
      title: "Creator's Production Bundle",
      description: "Buy the Ultra-Slim Laptop & get Noise-Canceling Headphones at 50% Off!",
      saving: "Save ₹7,500",
      badge: "Best Seller",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "Active Wear Combo Pack",
      description: "Combine the Smart Fitness Watch and Wireless Earbuds for an all-in-one workout setup.",
      saving: "Save ₹3,000",
      badge: "Healthy Choice",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop"
    }
  ],
  exchanges: [
    {
      title: "Flagship Upgrade Plan",
      description: "Exchange your old smartphone and receive up to ₹25,000 instant value towards the Premium Smartphone.",
      saving: "Max Value Guarantee",
      badge: "Easy Exchange",
      image: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "Old-to-New Laptop Swap",
      description: "Trade in any working or non-working old laptop for a flat ₹10,000 additional discount on next-gen notebooks.",
      saving: "Flat Discounts",
      badge: "Eco-Friendly",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&auto=format&fit=crop"
    }
  ],
  bank: [
    {
      title: "HDFC Credit Cards Instant Off",
      description: "Flat 10% instant discount up to ₹5,000 on transactions above ₹20,000 using HDFC Bank Credit Cards.",
      saving: "10% Instant Off",
      badge: "Bank Offer",
      image: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "No-Cost EMI Options",
      description: "Up to 12 months No-Cost EMI on all major credit cards and Bajaj Finserv cards. Zero downpayment.",
      saving: "0% Interest",
      badge: "Flexible Pay",
      image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=400&auto=format&fit=crop"
    }
  ]
};

export default function Home() {
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = useState([]);
  
  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 55 });

  // Notifications State for Upcoming Gadgets
  const [notifiedGadgets, setNotifiedGadgets] = useState({});

  // Active Tab State
  const [activeTab, setActiveTab] = useState('combos');

  // Load featured products from DB on mount
  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await getProductsApi();
        if (data && data.length > 0) {
          setDbProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.warn('API connection failed, falling back to mock UI datasets:', err);
      }
    }
    loadFeatured();
  }, []);

  // Slide rotation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 0, seconds: 0 }; // Restart cycle
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time utility
  const formatTime = (val) => String(val).padStart(2, '0');

  // Toggle notifications for gadgets
  const handleNotifyMe = (id) => {
    setNotifiedGadgets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-16 animate-[fadeIn_0.5s_ease-out]">
      
      {/* 1. HERO SALES CAROUSEL */}
      <section className="relative overflow-hidden group select-none">
        <div className="relative h-[480px] md:h-[520px] w-full flex items-center">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex flex-col md:flex-row items-center justify-between p-8 md:p-16 bg-gradient-to-br ${slide.bgGradient} text-white border border-[var(--border-color)] ${
                  isActive ? 'opacity-100 translate-x-0 pointer-events-auto z-10' : 'opacity-0 translate-x-8 pointer-events-none z-0'
                }`}
              >
                {/* Text Content */}
                <div className="max-w-xl space-y-6 text-left shrink-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-[var(--accent-bg-light)]">
                    <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
                    {slide.accentText}
                  </div>
                  <div className="space-y-2">
                    <span className="text-yellow-300 text-sm md:text-base font-extrabold tracking-wider block">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-tight tracking-tight drop-shadow-sm">
                      {slide.title}
                    </h1>
                  </div>
                  <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-md">
                    {slide.description}
                  </p>
                  <button
                    onClick={() => navigate('/products')}
                    className="btn-custom bg-white text-black hover:bg-yellow-300 hover:text-black border-white px-8 py-3.5 flex items-center gap-2 group/btn font-bold mt-2"
                  >
                    {slide.ctaText}
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                  </button>
                </div>

                {/* Hero Image */}
                <div className="hidden md:block w-[380px] h-[340px] shrink-0 relative p-4 bg-white/5 backdrop-blur-sm border border-white/15 shadow-2xl">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                  />
                  <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-black px-4 py-2 font-black text-xs tracking-wider uppercase animate-bounce">
                    HOT DEAL
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 backdrop-blur-sm border border-white/10 hover:scale-105 transition active:scale-95 hidden group-hover:block"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 backdrop-blur-sm border border-white/10 hover:scale-105 transition active:scale-95 hidden group-hover:block"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Dots indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3.5 h-1.5 transition-all duration-300 ${
                index === activeSlide ? 'bg-yellow-400 w-8' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. FLASH SALE SECTION WITH LIVE COUNTDOWN */}
      <section className="glass-card p-6 md:p-8 space-y-8 relative overflow-hidden border-t-4 border-t-red-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 text-white p-3 animate-pulse">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight flex items-center gap-2">
                SUPER DEALS OF THE DAY
              </h2>
              <p className="text-sm text-[var(--text-muted)] font-medium">Limited quantities available. Act fast!</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-[var(--accent-bg-light)] text-[var(--accent-text-light)] px-5 py-3 border border-[var(--accent-color)]/20 shadow-sm shrink-0">
            <Timer className="w-5 h-5 animate-spin-slow" />
            <span className="text-xs uppercase font-extrabold tracking-widest mr-2">ENDS IN</span>
            <div className="flex items-center gap-1 font-mono text-lg font-bold">
              <span className="bg-[var(--surface-color)] px-2 py-0.5 border border-[var(--border-color)]">{formatTime(timeLeft.hours)}</span>:
              <span className="bg-[var(--surface-color)] px-2 py-0.5 border border-[var(--border-color)]">{formatTime(timeLeft.minutes)}</span>:
              <span className="bg-[var(--surface-color)] px-2 py-0.5 border border-[var(--border-color)]">{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLASH_SALE_ITEMS.map((item) => {
            const stockPercent = (item.stockLeft / item.stockTotal) * 100;
            return (
              <div 
                key={item.id} 
                className="glass-card p-4 flex flex-col justify-between hover:border-red-400 group transition duration-300 relative"
              >
                {/* Discount Tag */}
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 uppercase shadow-md animate-pulse">
                  {item.discount}
                </div>

                {/* Image Aspect Box */}
                <div className="aspect-square bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center p-3 relative overflow-hidden mb-4 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-base leading-snug group-hover:text-red-500 transition duration-150">
                    {item.title}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-yellow-500" />
                    <span className="font-bold text-[var(--text-primary)]">{item.rating}</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-red-500">₹{item.salePrice.toLocaleString()}</span>
                    <span className="text-sm text-[var(--text-muted)] line-through">₹{item.originalPrice.toLocaleString()}</span>
                  </div>

                  {/* Inventory Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)]">
                      <span>Stock Claimed</span>
                      <span className="text-red-500 font-bold">{item.stockTotal - item.stockLeft} / {item.stockTotal}</span>
                    </div>
                    <div className="w-full bg-[var(--border-color)] h-1.5">
                      <div 
                        className="bg-red-500 h-full transition-all duration-1000"
                        style={{ width: `${100 - stockPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <button 
                    onClick={() => navigate('/products')}
                    className="w-full btn-custom py-2.5 text-xs tracking-wider uppercase font-extrabold hover:bg-red-500 hover:border-red-500 mt-2"
                  >
                    Grab Deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES GRID */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-center tracking-tight">
          SHOP BY TOP CATEGORIES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Smartphones', icon: Smartphone, bg: 'from-amber-500/10 to-amber-500/20', hover: 'hover:border-amber-400' },
            { name: 'Laptops', icon: Laptop, bg: 'from-blue-500/10 to-blue-500/20', hover: 'hover:border-blue-400' },
            { name: 'Audio Gear', icon: Headphones, bg: 'from-purple-500/10 to-purple-500/20', hover: 'hover:border-purple-400' },
            { name: 'Gaming', icon: Gamepad2, bg: 'from-emerald-500/10 to-emerald-500/20', hover: 'hover:border-emerald-400' }
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/products')}
              className={`glass-card p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-gradient-to-b ${cat.bg} ${cat.hover} hover:-translate-y-1 text-center group`}
            >
              <div className="p-4 bg-[var(--surface-color)] border border-[var(--border-color)] group-hover:scale-110 group-hover:border-[var(--accent-color)] transition-all duration-300 rounded-full mb-4">
                <cat.icon className="w-8 h-8 text-[var(--accent-color)]" />
              </div>
              <span className="font-bold text-sm md:text-base tracking-wider uppercase group-hover:text-[var(--accent-color)] transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE LAUNCHPAD - UPCOMING TECH & GADGETS */}
      <section className="space-y-8 bg-slate-950 text-white p-6 md:p-10 border border-slate-800 relative">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            The Launchpad
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight">
            UPCOMING TECH & FUTURE RELEASES
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            Get an exclusive sneak peek at next-generation gadgets. Pre-orders are opening soon. Register for drop alerts!
          </p>
        </div>

        {/* Tech Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {UPCOMING_GADGETS.map((gadget) => {
            const isNotified = notifiedGadgets[gadget.id];
            return (
              <div 
                key={gadget.id} 
                className="bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group"
              >
                <div className="space-y-4">
                  {/* Status Indicator */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20">
                      COMING {gadget.launchDate}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{gadget.estimatedPrice} (Est.)</span>
                  </div>

                  {/* Image Frame */}
                  <div className="aspect-video bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={gadget.image}
                      alt={gadget.title}
                      className="object-cover h-full w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                      {gadget.title}
                    </h3>
                    <p className="text-[11px] font-extrabold uppercase text-indigo-300 tracking-wider">
                      ✨ {gadget.highlight}
                    </p>
                  </div>

                  {/* Specifications List */}
                  <ul className="space-y-2 pt-2 border-t border-slate-800">
                    {gadget.specs.map((spec, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-indigo-500 shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Notify Action */}
                <button
                  onClick={() => handleNotifyMe(gadget.id)}
                  className={`w-full mt-6 py-3 text-xs tracking-wider uppercase font-bold border transition duration-200 flex items-center justify-center gap-2 ${
                    isNotified 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-transparent border-indigo-500/40 text-indigo-300 hover:bg-indigo-500 hover:text-white hover:border-indigo-500'
                  }`}
                >
                  {isNotified ? (
                    <>
                      <Check className="w-4 h-4" />
                      Alert Set Successfully
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 animate-bounce" />
                      Get Drop Alert
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE SPECIAL OFFERS & BUNDLES */}
      <section className="glass-card p-6 md:p-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight">
            SPECIAL OFFERS & SHOPPING EXCLUSIVES
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-medium max-w-md mx-auto">
            Choose from bundle packs, exchange programs, or credit card incentives to maximize your purchase benefits.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[var(--border-color)] max-w-md mx-auto">
          {[
            { id: 'combos', label: 'Combo Deals', icon: Gift },
            { id: 'exchanges', label: 'Exchange Offers', icon: Layers },
            { id: 'bank', label: 'Bank Discounts', icon: Percent }
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 pb-4 flex items-center justify-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider transition border-b-2 ${
                  isTabActive 
                    ? 'border-[var(--accent-color)] text-[var(--accent-color)]' 
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-[fadeIn_0.3s_ease-out]">
          {BUNDLE_TABS[activeTab].map((offer, idx) => (
            <div 
              key={idx} 
              className="bg-[var(--bg-color)] border border-[var(--border-color)] p-5 flex flex-col sm:flex-row items-center gap-6 group hover:border-[var(--accent-color)]/50 transition duration-300"
            >
              {/* Offer Image Frame */}
              <div className="w-32 h-32 shrink-0 overflow-hidden border border-[var(--border-color)] bg-[var(--surface-color)] p-1">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Text Area */}
              <div className="flex-grow space-y-3 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest bg-[var(--accent-bg-light)] text-[var(--accent-text-light)] px-2 py-0.5 border border-[var(--accent-color)]/10 uppercase">
                    {offer.badge}
                  </span>
                  <span className="text-xs font-black text-green-600 uppercase">{offer.saving}</span>
                </div>
                <h3 className="font-extrabold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                  {offer.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {offer.description}
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="text-xs font-black uppercase text-[var(--text-primary)] hover:text-[var(--accent-color)] flex items-center justify-center sm:justify-start gap-1 group/link"
                >
                  Claim Offer 
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
