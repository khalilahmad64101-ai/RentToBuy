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
  const { id, name, model, price, weeklyRate, image, fuel, transmission, category } = car;
  
  const displayWeeklyPrice = weeklyRate || price || 50;
  const displayFuel = car.calcFuel || fuel || 'Petrol';
  const displayTrans = car.calcTrans || transmission || 'Auto';
  const displayCategory = category || 'MPV';

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
    <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group" id={`car-${id}`}>
      {/* Vehicle image with dynamic overlay */}
      <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden shrink-0">
        <img
          src={image}
          alt={`${name} ${model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
        />
        
        {/* Favorite Heart Trigger Button overlay */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white shadow-xs hover:shadow transition-all group z-10 cursor-pointer"
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-400 group-hover:text-rose-500'
            }`} 
          />
        </button>

        {/* Bottom image fade effect */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

        {/* Multi-image indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10">
          <span className="w-5 h-1 rounded-full bg-white transition-all duration-300"></span>
          <span className="w-1 h-1 rounded-full bg-white/40 transition-all duration-300"></span>
          <span className="w-1 h-1 rounded-full bg-white/40 transition-all duration-300"></span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
        <div>
          {/* Price Header */}
          <div className="space-y-0.5">
            <span className="block text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
              FROM
            </span>
            <div className="flex items-baseline mt-1 sm:mt-1.5">
              <span className="text-2xl sm:text-3xl font-[900] text-slate-900 leading-none">
                £{displayWeeklyPrice}
              </span>
              <span className="text-[11px] sm:text-sm font-semibold text-slate-400 leading-none ml-1 sm:ml-1.5">
                per week
              </span>
            </div>
          </div>

          {/* Thin divider line */}
          <div className="border-b border-gray-100 my-2 sm:my-3.5"></div>

          {/* Name & Model Year */}
          <div className="space-y-0.5 sm:space-y-1 text-left">
            <h3 className="font-sans font-extrabold text-sm sm:text-lg text-[#7CC242] tracking-tight leading-tight uppercase group-hover:text-[#6aae34] transition-colors truncate">
              {name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-extrabold">
              Model {model}
            </p>
          </div>

          {/* 2x2 Feature Box Grid: subtle borders, rounded corners, icon on left, text on right */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2.5 sm:mt-4 shrink-0">
            {/* Feature 1: Fuel Type */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 p-1.5 sm:p-2 bg-white rounded-xl border border-slate-200/80 h-9 sm:h-11 w-full justify-start min-w-0">
              <div className="text-slate-500 shrink-0">
                <Fuel className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.25]" />
              </div>
              <span className="text-[10px] sm:text-sm font-semibold text-slate-600 truncate">{displayFuel}</span>
            </div>

            {/* Feature 2: Transmission */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 p-1.5 sm:p-2 bg-white rounded-xl border border-slate-200/80 h-9 sm:h-11 w-full justify-start min-w-0">
              <div className="text-slate-500 shrink-0">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.25]" />
              </div>
              <span className="text-[10px] sm:text-sm font-semibold text-slate-600 truncate">{displayTrans}</span>
            </div>

            {/* Feature 3: Seats / Doors */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 p-1.5 sm:p-2 bg-white rounded-xl border border-slate-200/80 h-9 sm:h-11 w-full justify-start min-w-0">
              <div className="text-slate-500 shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.25]" />
              </div>
              <span className="text-[10px] sm:text-sm font-semibold text-slate-600 truncate">5 seats</span>
            </div>

            {/* Feature 4: Body Type */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 p-1.5 sm:p-2 bg-white rounded-xl border border-[#cbd5e1] md:border-slate-200/80 h-9 sm:h-11 w-full justify-start min-w-0">
              <div className="text-slate-500 shrink-0">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.25]" />
              </div>
              <span className="text-[10px] sm:text-sm font-semibold text-slate-600 truncate">{displayCategory}</span>
            </div>
          </div>
        </div>

        {/* Action buttons: Equal-width, with Apply visually stronger */}
        <div className="grid grid-cols-2 gap-2 mt-2 sm:mt-auto pt-1 font-sans">
          <Link to={`/cars/${id}`} className="block w-full">
            <button className="w-full h-9 sm:h-11 text-[10px] sm:text-xs font-[900] uppercase tracking-wider bg-white hover:bg-[#7CC242]/5 text-[#7CC242] border-2 border-[#7CC242] rounded-xl transition-all duration-150 cursor-pointer text-center flex items-center justify-center active:scale-98">
              Details
            </button>
          </Link>
          <Link to={`/apply?carId=${id}`} className="block w-full">
            <button className="w-full h-9 sm:h-11 text-[10px] sm:text-xs font-[900] uppercase tracking-wider bg-[#7CC242] hover:bg-[#6db334] text-white border-2 border-[#7CC242] hover:border-[#6db334] rounded-xl shadow-sm transition-all duration-150 cursor-pointer text-center flex items-center justify-center active:scale-95">
              Apply
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
