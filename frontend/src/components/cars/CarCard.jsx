import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Fuel, 
  Settings, 
  Car, 
  Users,
  Heart,
  Wind,
  Bluetooth,
  Eye,
  Cpu,
  Sparkles,
  Navigation,
  Key,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function getFeatureIcon(featureName) {
  const name = String(featureName || '').toLowerCase();
  if (name.includes('air') || name.includes('climate') || name.includes('ac') || name.includes('vent')) {
    return <Wind className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
  }
  if (name.includes('blue') || name.includes('phone') || name.includes('audio') || name.includes('speak')) {
    return <Bluetooth className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
  }
  if (name.includes('sensor') || name.includes('park') || name.includes('radar') || name.includes('camera') || name.includes('view')) {
    return <Eye className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
  }
  if (name.includes('cruise') || name.includes('adaptive') || name.includes('pilot') || name.includes('assist')) {
    return <Cpu className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
  }
  if (name.includes('heat') || name.includes('warm') || name.includes('seat')) {
    return <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
  }
  if (name.includes('gps') || name.includes('nav') || name.includes('map')) {
    return <Navigation className="w-3.5 h-3.5 text-teal-500 shrink-0" />;
  }
  if (name.includes('key') || name.includes('start') || name.includes('entry')) {
    return <Key className="w-3.5 h-3.5 text-yellow-500 shrink-0" />;
  }
  if (name.includes('safety') || name.includes('guard') || name.includes('shield') || name.includes('protect')) {
    return <Shield className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
  }
  return <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />;
}

export function CarCard({ car }) {
  if (!car) return null;
  const { id, name, model, price, weeklyRate, image, fuel, transmission, category, year } = car;
  
  const displayWeeklyPrice = weeklyRate || price || 50;
  const displayFuel = car.calcFuel || fuel || 'Petrol';
  const displayTrans = car.calcTrans || transmission || 'Auto';
  const displayCategory = category || 'MPV';
  const displayYear = year || '2019';

  // Heart Favorite State
  const [isFavorited, setIsFavorited] = useState(() => {
    try {
      const saved = localStorage.getItem(`car-favorite-${id}`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextVal = !isFavorited;
    setIsFavorited(nextVal);
    try {
      localStorage.setItem(`car-favorite-${id}`, String(nextVal));
    } catch (err) {
      console.error(err);
    }
  };

  const baseImage = image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800';
  const fallbackImages = [
    baseImage,
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  ];
  const galleryImages = Array.isArray(car.images) && car.images.length > 0 ? car.images : fallbackImages;

  const scrollRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(container.scrollLeft / width);
      if (index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
    }
  };

  const scrollToImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: 'smooth'
    });
    setCurrentImageIndex(index);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const newIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    container.scrollTo({
      left: newIndex * container.clientWidth,
      behavior: 'smooth'
    });
    setCurrentImageIndex(newIndex);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const newIndex = currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1;
    container.scrollTo({
      left: newIndex * container.clientWidth,
      behavior: 'smooth'
    });
    setCurrentImageIndex(newIndex);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full w-full group" id={`car-${id}`}>
      {/* 1. Scrollable/Swipeable Image Block */}
      <div className="relative block h-[170px] w-full bg-slate-50 overflow-hidden shrink-0 select-none">
        <style dangerouslySetInnerHTML={{__html: `
          .car-card-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}} />
        
        {/* Horizontal slider container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="car-card-scroll-container w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {galleryImages.map((imgUrl, idx) => (
            <Link 
              key={idx} 
              to={`/cars/${id}`} 
              className="w-full h-full shrink-0 snap-start block"
            >
              <img
                src={imgUrl}
                alt={`${name} ${model} angle ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 pointer-events-none"
              />
            </Link>
          ))}
        </div>

        {/* Navigation Arrows for complete user control */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-xs transition-opacity duration-200 opacity-0 group-hover:opacity-100 z-10 cursor-pointer border border-slate-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-xs transition-opacity duration-200 opacity-0 group-hover:opacity-100 z-10 cursor-pointer border border-slate-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        
        {/* Dynamic interactive slide indicator dots with full control via click/taps */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => scrollToImage(idx, e)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 shadow-xs ${
                  currentImageIndex === idx 
                    ? 'bg-white scale-125 opacity-100' 
                    : 'bg-white/50 hover:bg-white/80 scale-100 opacity-70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Favorite Heart Trigger */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-xs z-10 cursor-pointer transition-colors"
        >
          <Heart 
            className={`w-3.5 h-3.5 ${
              isFavorited ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
            }`} 
          />
        </button>
      </div>

      {/* 2. Custom Snug Detailed Card Body with beautiful spacious padding */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between font-sans text-left gap-4 sm:gap-5">
        <div className="space-y-3 sm:space-y-4">
          {/* Section: Price Details */}
          <div>
            <span className="block text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase leading-none tracking-wide">From</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-black leading-none">£{displayWeeklyPrice}</span>
              <span className="text-[11px] sm:text-xs text-gray-400 font-semibold ml-1">per week</span>
            </div>
          </div>

          {/* Solid subtle divider line */}
          <div className="border-b border-gray-150" />

          {/* Section: Title & Subtitle */}
          <div className="space-y-0.5">
            <Link to={`/cars/${id}`} className="block hover:underline decoration-[#7AC943] decoration-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-[#7AC943] tracking-wide uppercase truncate leading-tight">
                {displayYear} {name}
              </h3>
            </Link>
            <p className="text-sm sm:text-base text-gray-900 font-extrabold leading-tight max-h-8 truncate">
              {model}
            </p>
          </div>

          {/* Section: 2x2 Feature Grid */}
          <div className="grid grid-cols-2 gap-x-2.5 sm:gap-x-3 gap-y-2 sm:gap-y-2.5 pt-1">
            {/* Box 1: Fuel */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
              </div>
              <span className="text-[11px] sm:text-xs text-slate-600 font-semibold truncate capitalize">{displayFuel}</span>
            </div>
            
            {/* Box 2: Transmission */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" strokeWidth={2.2} />
              </div>
              <span className="text-[11px] sm:text-xs text-slate-600 font-semibold truncate capitalize">{displayTrans}</span>
            </div>

            {/* Box 3: Seats */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
              </div>
              <span className="text-[11px] sm:text-xs text-slate-600 font-semibold truncate">5 Seats</span>
            </div>

            {/* Box 4: Category */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Car className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
              </div>
              <span className="text-[11px] sm:text-xs text-slate-600 font-semibold truncate uppercase">{displayCategory}</span>
            </div>
          </div>
        </div>

        {/* Section: Details & Apply buttons side by side */}
        <div className="pt-2 select-none">
          <div className="grid grid-cols-2 gap-2">
            <Link to={`/cars/${id}`} className="block w-full">
              <button className="w-full py-2.5 text-xs font-black uppercase tracking-wider bg-white hover:bg-slate-50 text-[#7AC943] border border-[#7AC943] rounded-lg transition-all duration-155 cursor-pointer flex items-center justify-center font-sans">
                Details
              </button>
            </Link>
            <Link to={`/apply?carId=${id}`} className="block w-full">
              <button className="w-full py-2.5 text-xs font-black uppercase tracking-wider bg-[#7AC943] hover:bg-[#8ED34A] text-white rounded-lg transition-all duration-155 cursor-pointer flex items-center justify-center shadow-xs font-sans">
                Apply
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
