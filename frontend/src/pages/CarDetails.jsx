import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader } from '../components/ui/Loader';
import { 
  Fuel, 
  Settings, 
  Users, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { getFeatureIcon } from '../components/cars/CarCard';
import { useSEO } from '../hooks/useSEO';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Read / Write saved state from localStorage for real functionality
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = localStorage.getItem(`car-favorite-${id}`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useSEO({
    title: car ? `Rent-to-Buy ${car.name} ${car.model} | R2BuyCar` : 'Vehicle Specifications | R2BuyCar',
    description: car 
      ? `Rent-to-buy program details for the ${car.name} ${car.model}. Secure this vehicle for £${car.weeklyRate || car.price || 50}/week with comprehensive servicing, road tax, and maintenance covered.` 
      : 'Get on the road with clear rent-to-buy parameters, inclusive services, and low weekly contributions.',
    ogImage: car?.image,
    twitterImage: car?.image
  });

  useEffect(() => {
    api.cars.list()
      .then((data) => {
        const match = data.find((c) => c.id === id);
        setCar(match || null);
      })
      .catch((err) => console.error('Error finding vehicle details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveToggle = () => {
    const nextVal = !isSaved;
    setIsSaved(nextVal);
    try {
      localStorage.setItem(`car-favorite-${id}`, String(nextVal));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <Loader label="Reading technical files for stock item..." />;
  }

  if (!car) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4" id="car-not-found">
        <h2 className="font-sans font-bold text-xl text-gray-950">Listed Stock Item Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          The requested vehicle specifications may have been updated or leased.
        </p>
        <Link to="/cars" className="inline-block mt-6">
          <button className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl uppercase tracking-wider">
            Go back to Status Fleet
          </button>
        </Link>
      </div>
    );
  }

  const { name, model, price, weeklyRate, image, fuel, transmission, economy, mpg, features, specs, color, engine, description } = car;

  const displayWeekly = weeklyRate || price || 50;
  const displayFeatures = features || specs || [];
  const baseImage = image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800';
  const fallbackImages = [
    baseImage,
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
  ];
  const galleryImages = Array.isArray(car.images) && car.images.length > 0 ? car.images : fallbackImages;

  return (
    <div className="w-full max-w-lg mx-auto bg-white min-h-screen px-4 pb-24 font-sans antialiased text-slate-900" id="vehicle-details-view">
      
      {/* Back button */}
      <div className="py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center text-xs font-black text-slate-500 hover:text-slate-900 focus:outline-none transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          Back
        </button>
        <span className="text-[10px] font-black text-[#7CC242] uppercase bg-[#7CC242]/10 px-2 py-0.5 rounded-md">
          Available Now
        </span>
      </div>

      {/* Car Image Slider */}
      <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-xs group">
        <img
          src={galleryImages[activeImgIndex] || baseImage}
          alt={`${name} ${model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Overlays */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-lg">
          {activeImgIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Mini DOT indications */}
      {galleryImages.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2.5">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImgIndex(idx)}
              className={`h-1 rounded-full transition-all ${activeImgIndex === idx ? 'w-4 bg-[#7CC242]' : 'w-1 bg-slate-300'}`}
            />
          ))}
        </div>
      )}

      {/* Main Metadata and Price Block */}
      <div className="mt-2 text-left space-y-1">
        <h1 className="font-black text-xl text-slate-900 uppercase tracking-tight leading-tight">
          {name}
        </h1>
        <div className="flex justify-between items-baseline pt-1">
          <p className="text-sm text-slate-500 font-extrabold">Model Year {model}</p>
          <div className="text-right">
            <span className="text-xl font-black text-slate-900">£{displayWeekly}</span>
            <span className="text-xs text-slate-400 font-bold ml-1">/week</span>
          </div>
        </div>
      </div>

      {/* CTA Buttons Side-By-Side (Apply and Save) */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Link to={`/apply?carId=${id}`} className="block w-full">
          <button className="w-full h-11 text-xs font-black uppercase tracking-wider bg-[#7CC242] hover:bg-[#6db334] text-white rounded-xl shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center active:scale-98">
            Apply Now
          </button>
        </Link>
        <button
          onClick={handleSaveToggle}
          className={`w-full h-11 text-xs font-black uppercase tracking-wider border rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
            isSaved 
              ? 'bg-rose-50 border-rose-200 text-rose-600' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* 2-Column Specs Grid */}
      <div className="mt-6 border-t border-slate-100 pt-5 text-left" id="vehicle-specs-grid">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-[#1F3F7A] mb-3">Vehicle details</h2>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Row 1 */}
          <div className="border-b border-slate-50 pb-2 flex flex-col justify-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fuel</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 uppercase truncate">{fuel || 'Petrol'}</span>
          </div>
          <div className="border-b border-slate-50 pb-2 flex flex-col justify-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Transmission</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 uppercase truncate">{transmission || 'Manual'}</span>
          </div>

          {/* Row 2 */}
          <div className="border-b border-slate-50 pb-2 flex flex-col justify-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Seats</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 truncate">{car.seats || '5 Seats'}</span>
          </div>
          <div className="border-b border-slate-50 pb-2 flex flex-col justify-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Doors</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 truncate">{car.doors || '5 Doors'}</span>
          </div>

          {/* Row 3 */}
          <div className="border-b border-slate-50 pb-2 flex flex-col justify-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Body Type</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 uppercase truncate">{car.category || car.bodyType || 'Saloon'}</span>
          </div>
          <div className="border-b border-slate-50 pb-2 flex flex-col justify-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
            <span className="text-sm font-black text-emerald-600 mt-0.5 uppercase truncate">PCO Compliant</span>
          </div>
        </div>
      </div>

      {/* Brief Description Card (Without multi-paragraph blocks) */}
      <div className="mt-6 border-t border-slate-100 pt-5 text-left" id="summary-section">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-[#1F3F7A] mb-2">Short Description</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          {description || `Premium spec ${name} ready for immediate dispatch and Rent-To-Buy enrollment. Hand-selected for reliability, fully sanitised, and optimized for low running costs.`}
        </p>
      </div>

      {/* Equipment Specs */}
      {displayFeatures.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-5 text-left" id="fitted-features">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#1F3F7A] mb-2.5">Fitted Equipment Highlights</h2>
          <div className="flex flex-wrap gap-1.5 align-middle">
            {displayFeatures.slice(0, 5).map((feat, index) => (
              <span key={index} className="inline-flex items-center space-x-1.5 bg-slate-50 text-slate-700 font-bold px-2 px-1.5 rounded border border-slate-100 text-[10px]">
                {getFeatureIcon(feat)}
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
