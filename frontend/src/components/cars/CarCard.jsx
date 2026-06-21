import React, { useState } from 'react';
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
  Shield
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.20)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full w-full group" id={`car-${id}`}>
      {/* 1. Reduced height Image Block with Link to Detail Page */}
      <Link to={`/cars/${id}`} className="relative block xl:h-[220px] overflow-hidden w-full bg-slate-50 overflow-hidden shrink-0">
        <img
          src={image}
          alt={`${name} ${model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
        />
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
      </Link>

      {/* 2. Custom Snug Detailed Card Body with no extra gaps */}
      <div className="p-3.5 flex-1 flex flex-col justify-between font-sans text-left gap-3">
        <div className="space-y-2.5">
          {/* Section: Price Details */}
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase leading-none tracking-wide">From</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-black leading-none">£{displayWeeklyPrice}</span>
              <span className="text-[10px] text-gray-400 font-semibold ml-0.5">per week</span>
            </div>
          </div>

          {/* Solid subtle divider line */}
          <div className="border-b border-gray-100" />

          {/* Section: Title & Subtitle */}
          <div className="space-y-0.5">
            <Link to={`/cars/${id}`} className="block hover:underline decoration-[#7AC943] decoration-1.5">
              <h3 className="font-extrabold text-[12px] sm:text-xs text-[#7AC943] tracking-wide uppercase truncate leading-tight">
                {displayYear} {name}
              </h3>
            </Link>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed max-h-8 truncate">
              {model}
            </p>
          </div>

          {/* Section: 2x2 Feature Grid (Only icon has border and background, text is borderless) */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-0.5">
            {/* Box 1: Fuel */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Fuel className="w-3 h-3 text-slate-500" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold truncate capitalize">{displayFuel}</span>
            </div>
            
            {/* Box 2: Transmission */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Settings className="w-3 h-3 text-slate-500" strokeWidth={2.2} />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold truncate capitalize">{displayTrans}</span>
            </div>

            {/* Box 3: Seats */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Users className="w-3 h-3 text-slate-500" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold truncate">5 Seats</span>
            </div>

            {/* Box 4: Category */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Car className="w-3 h-3 text-slate-500" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold truncate uppercase">{displayCategory}</span>
            </div>
          </div>
        </div>

        {/* Section: Details & Apply buttons side by side */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link to={`/cars/${id}`} className="block w-full">
            <button className="w-full py-2 text-[11px] font-black uppercase tracking-wider bg-white hover:bg-slate-50 text-[#7AC943] border border-[#7AC943] rounded-lg transition-all duration-155 cursor-pointer flex items-center justify-center">
              Details
            </button>
          </Link>
          <Link to={`/apply?carId=${id}`} className="block w-full">
            <button className="w-full py-2 text-[11px] font-black uppercase tracking-wider bg-[#7AC943] hover:bg-[#8ED34A] text-white rounded-lg transition-all duration-155 cursor-pointer flex items-center justify-center shadow-2xs">
              Apply
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
