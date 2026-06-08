import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Fuel, 
  Orbit, 
  ShieldCheck, 
  CheckCircle, 
  Wind, 
  Bluetooth, 
  Eye, 
  Cpu, 
  Sparkles, 
  Navigation, 
  Key, 
  Shield,
  Heart
} from 'lucide-react';
import { Button } from '../ui/Button';

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
  const { id, name, model, price, weeklyRate, image, fuel, transmission, economy, features, specs } = car;
  
  const displayWeeklyPrice = weeklyRate || price || 50;
  // Calculate monthly payment as Weekly * 4.33 (standard weeks in major global month models)
  const displayMonthlyPrice = Math.round(displayWeeklyPrice * 4.33);
  const displayEconomy = economy || '55 mpg';
  const displayFeatures = features || specs || [];
  const displayFuel = car.calcFuel || fuel || 'Petrol';
  const displayTrans = car.calcTrans || transmission || 'Auto';

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
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full" id={`car-${id}`}>
      {/* Vehicle image with dynamic overlay */}
      <div className="relative aspect-video bg-gray-50 overflow-hidden shrink-0">
        <img
          src={image}
          alt={`${name} ${model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        
        {/* Favorite Heart Trigger Button overlay */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow transition-all group z-10 cursor-pointer"
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-400 group-hover:text-rose-500'
            }`} 
          />
        </button>

        <div className="absolute top-3 left-3 bg-brand-secondary text-white font-sans text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide shadow-xs">
          Ready to drive
        </div>
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] uppercase font-black tracking-wide px-2 py-1 rounded flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
          <span>Cover & Licensing Included</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <div>
              <h3 className="font-sans font-bold text-lg text-brand-secondary tracking-tight leading-tight">{name}</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{model}</p>
            </div>
            
            <div className="text-right shrink-0">
              <div className="flex flex-col">
                <span className="text-xl font-black font-sans text-brand-primary">£{displayWeeklyPrice}<span className="text-[10px] text-gray-400 font-medium uppercase tracking-normal">/wk</span></span>
                <span className="text-[11px] text-brand-secondary font-extrabold mt-0.5">£{displayMonthlyPrice}<span className="text-[9px] text-slate-400 font-normal uppercase">/mo</span></span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-100 mb-4 text-[11px] text-slate-600 font-bold">
            <div className="flex items-center space-x-1 justify-center">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{displayFuel}</span>
            </div>
            <div className="flex items-center space-x-1 justify-center border-x border-gray-100">
              <Orbit className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{displayTrans}</span>
            </div>
            <div className="flex items-center space-x-1 justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span>{displayEconomy}</span>
            </div>
          </div>

          {/* Key Features Bullet List */}
          <div className="space-y-2 mb-5 shrink-0">
            {displayFeatures.slice(0, 3).map((feat, index) => (
              <div key={index} className="flex items-center space-x-2.5 text-xs text-slate-600 font-medium">
                {getFeatureIcon(feat)}
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button triggers matching target requirements exactly */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
          <Link to={`/cars/${id}`} className="block">
            <Button variant="secondary" size="sm" className="w-full text-[11px] font-bold py-2.5">
              View Details
            </Button>
          </Link>
          <Link to={`/apply?carId=${id}`} className="block">
            <Button variant="primary" size="sm" className="w-full text-[11px] font-bold py-2.5">
              Start Application
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
