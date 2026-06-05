import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';
import { Fuel, Orbit, ShieldCheck, CheckCircle2, ChevronLeft, CalendarClock, PenTool, CheckSquare } from 'lucide-react';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    api.cars.list()
      .then((data) => {
        const match = data.find((c) => c.id === id);
        setCar(match || null);
      })
      .catch((err) => console.error('Error finding vehicle details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loader label="Reading technical files for stock item..." />;
  }

  if (!car) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4" id="car-not-found">
        <h2 className="font-sans font-bold text-2xl text-gray-950">Listed Stock Item Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">
          The requested vehicle specifications may have been updated, leased, or scheduled for replacement.
        </p>
        <Link to="/cars" className="inline-block mt-6">
          <Button variant="secondary">Go back to Active Fleet</Button>
        </Link>
      </div>
    );
  }

  const { name, model, price, weeklyRate, image, fuel, transmission, economy, mpg, features, specs, color, engine, description } = car;

  const displayWeekly = weeklyRate || price || 50;
  const displayEconomy = economy || mpg || '55 mpg';
  const displayFeatures = features || specs || [];

  const baseImage = image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800';
  const fallbackImages = [
    baseImage,
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1562591176-80db474a919f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800'
  ];
  const galleryImages = Array.isArray(car.images) && car.images.length > 0 ? car.images : fallbackImages;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="vehicle-details-view">
      {/* Back button link */}
      <div>
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-950 focus:outline-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Active Stock
        </button>
      </div>

      {/* Grid Layout Detail Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Car image and highlight banner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
            <img
              src={galleryImages[activeImgIndex] || baseImage}
              alt={`${name} ${model}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute top-4 left-4 bg-emerald-600 text-white font-sans text-xs font-semibold px-3 py-1 rounded shadow-sm">
              Tested & Sanitized - Work Ready
            </div>
            <div className="absolute bottom-4 right-4 bg-black/75 text-white font-mono text-[11px] px-2.5 py-1 rounded shadow-sm">
              Image {activeImgIndex + 1} of {galleryImages.length}
            </div>
          </div>

          {/* Interactive Thumbnails for the 10 images */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Visual Multi-View Angles (10 Angles Showcased)</span>
            <div className="grid grid-cols-5 gap-2.5">
              {galleryImages.slice(0, 10).map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImgIndex(index)}
                  className={`aspect-video rounded-lg overflow-hidden border bg-gray-50 focus:outline-none transition-all duration-200 relative ${
                    activeImgIndex === index
                      ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-xs'
                      : 'border-gray-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Preview angle ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-black/[0.04] transition-colors ${activeImgIndex === index ? 'bg-transparent' : 'hover:bg-transparent'}`}></div>
                  <span className="absolute bottom-0.5 right-0.5 font-mono text-[8.5px] px-1 bg-black/70 text-white rounded">
                    0{index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-sans font-bold text-lg text-gray-950">Vehicle Highlights</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              {description || `Pristine condition ${name} ${model} ready for direct underwriting. Every component has been fully tested, sanitised, and ready with active London low emission zones clearances.`}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-medium mb-1">Cylinder Engine Specs</span>
                <strong className="text-gray-900 font-sans">{engine || '1.0L Dynamic Fuel-Saving'}</strong>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-medium mb-1">Color Variant</span>
                <strong className="text-gray-900 font-sans">{color || 'Midnight Quartz'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Program and pricing plans */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-6" id="program-pricing">
            <div className="pb-4 border-b border-gray-100">
              <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Lease to Own Agreement</span>
              <h1 className="font-sans font-bold text-2xl sm:text-3xl text-gray-950 tracking-tight mt-1">{name}</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">{model}</p>
            </div>

            {/* Weekly Price Panel */}
            <div className="bg-indigo-600 text-white rounded-xl p-5 shadow-xs flex justify-between items-center">
              <div>
                <span className="text-xs text-indigo-200 uppercase block font-medium">Contributive Weekly Rates</span>
                <span className="text-3xl font-bold font-sans">£{displayWeekly}</span>
                <span className="text-xs text-indigo-200">/week</span>
              </div>
              <div className="text-right text-xs bg-white/10 px-3 py-2 rounded border border-white/10">
                <span className="block text-indigo-200 font-medium">Agreement Term</span>
                <strong>12 - 24 Months</strong>
              </div>
            </div>

            {/* Inclusions and Core Perks */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-sm text-gray-950">Weekly Rate Inclusions</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Routine Servicing and MOT renewals</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Manufacturer Powertrain Warranty Coverage</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Routine Road Tax management handles</span>
                </div>
              </div>
            </div>

            {/* Technical Parameters */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <Fuel className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Fuel: <strong>{fuel || 'Petrol'}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Orbit className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Box: <strong>{transmission || 'Manual'}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>MPG: <strong>{displayEconomy}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Status: <strong>PCO Ready</strong></span>
              </div>
            </div>

            {/* Listed Features bullets */}
            {displayFeatures.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-sm text-gray-950">Standard Features Fitted</h4>
                <div className="grid grid-cols-2 gap-2">
                  {displayFeatures.map((feat, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Eligibility Application CTA */}
            <div className="pt-4">
              <Link to={`/apply?carId=${car.id}`} className="block">
                <Button variant="primary" size="lg" className="w-full font-bold">
                  Proceed to Documents Eligibility Uploads
                </Button>
              </Link>
              <span className="text-[10px] text-gray-400 block text-center mt-2">
                Submission parameters will not create a hard credit footprint during Soft Review.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
