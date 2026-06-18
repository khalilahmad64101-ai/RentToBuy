import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';
import { Fuel, Orbit, ShieldCheck, CheckCircle2, ChevronLeft, CalendarClock, PenTool, CheckSquare, ChevronRight, Sparkles, Gauge, User, Info, FileText, Calendar } from 'lucide-react';
import { getFeatureIcon } from '../components/cars/CarCard';
import { useSEO } from '../hooks/useSEO';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

  useSEO({
    title: car ? `Rent-to-Buy ${car.name} ${car.model} | R2BuyCar` : 'Vehicle Specifications | R2BuyCar',
    description: car 
      ? `Rent-to-buy program details for the ${car.name} ${car.model}. Secure this vehicle for £${car.weeklyRate || car.price || 50}/week with comprehensive servicing, road tax, and maintenance covered.` 
      : 'Get on the road with clear rent-to-buy parameters, inclusive services, and low weekly contributions.',
    keywords: car ? `${car.name}, rent to buy ${car.name}, ${car.model} lease, ${car.fuel || 'hybrid'} car subscription` : 'rent-to-buy car model, fleet specifications',
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-10 pb-20 sm:pb-10 space-y-3 sm:space-y-8" id="vehicle-details-view">
      {/* Back button link */}
      <div>
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-950 focus:outline-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Active Stock
        </button>
      </div>

      {/* MOBILE PORTRAIT COMPACT LAYOUT (lg:hidden) */}
      <div className="block lg:hidden space-y-4 animate-fade-in" id="mobile-car-details">
        {/* 1. Optimized Mobile Image Gallery Slider */}
        <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden shadow-xs group">
          <img
            src={galleryImages[activeImgIndex] || baseImage}
            alt={`${name} ${model}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Top minimal status labels */}
          <div className="absolute top-2.5 left-2.5 flex gap-1 items-center">
            <span className="bg-emerald-600 text-white font-sans text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Tested & Sanitised
            </span>
            <span className="bg-[#1F3F7A]/90 text-white font-sans text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              ULEZ Free
            </span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
            {activeImgIndex + 1} of {galleryImages.length}
          </div>

          {/* Overlaid Navigation Arrows */}
          <button
            onClick={() => setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/45 text-white p-1 rounded-full focus:outline-none hover:bg-black/60 active:scale-90 transition-transform"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/45 text-white p-1 rounded-full focus:outline-none hover:bg-black/60 active:scale-90 transition-transform"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Micro DOT indicators */}
        <div className="flex justify-center gap-1.5 py-0.5">
          {galleryImages.slice(0, 8).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImgIndex(idx)}
              className={`h-1 rounded-full transition-all ${activeImgIndex === idx ? 'w-4 bg-[#7CC242]' : 'w-1 bg-slate-300'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* 3. Main header: Name & Weekly Price */}
        <div className="pt-1.5 border-b border-slate-100 pb-3">
          <div className="flex justify-between items-baseline gap-2">
            <div>
              <span className="text-[9px] text-[#7CC242] font-black uppercase tracking-wider block">Lease to Own Fleet</span>
              <h1 className="font-sans font-black text-lg text-[#1F3F7A] leading-snug uppercase tracking-tight">
                {name} <span className="text-slate-500 font-extrabold text-sm">{model}</span>
              </h1>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[18px] font-black text-slate-900 leading-none">£{displayWeekly}</span>
              <span className="text-[9px] font-bold text-slate-400 block mt-0.5">per week</span>
            </div>
          </div>
        </div>

        {/* 4. Key Specifications bar (aligned & elegant, no borders everywhere) */}
        <div className="grid grid-cols-4 gap-2 text-center py-2.5 border-b border-slate-100 text-[#1F3F7A]">
          <div>
            <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">Fuel Type</span>
            <strong className="text-slate-800 font-black text-[11px] block mt-0.5 truncate">{fuel || 'Petrol'}</strong>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">Gearbox</span>
            <strong className="text-slate-800 font-black text-[11px] block mt-0.5 truncate">{transmission || 'Manual'}</strong>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">Economy</span>
            <strong className="text-slate-800 font-black text-[11px] block mt-0.5 truncate">{displayEconomy}</strong>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">PCO Status</span>
            <strong className="text-emerald-600 font-black text-[11px] block mt-0.5 truncate">Compliant</strong>
          </div>
        </div>

        {/* 5. Complete Technical Specifications (aligned, clean, 2-column label/value layout) */}
        <div className="py-2.5 border-b border-slate-100 space-y-2">
          <h4 className="font-sans font-black text-[10px] text-[#1F3F7A] uppercase tracking-wider">Technical Specifications</h4>
          <div className="space-y-1.5 text-[11px] text-slate-700">
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Make</span>
              <span className="text-slate-800 font-extrabold text-right">{car.make || (name ? name.split(' ')[0] : 'Standard')}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Model</span>
              <span className="text-slate-800 font-extrabold text-right">{model || 'Comfort'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Year</span>
              <span className="text-slate-800 font-extrabold text-right">{car.year || '2022'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Colour</span>
              <span className="text-slate-800 font-extrabold text-right">{color || 'Silver/Grey'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Engine Size</span>
              <span className="text-slate-800 font-extrabold text-right">{engine || '1.0L Economy'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Mileage</span>
              <span className="text-slate-800 font-extrabold text-right">{car.mileage || '28,450 mi'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Body Type</span>
              <span className="text-slate-800 font-extrabold text-right">{car.category || car.bodyType || 'Hatchback'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Seats / Doors</span>
              <span className="text-slate-800 font-extrabold text-right">{car.seats || '5 Seats'} / {car.doors || '5 Doors'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">Condition</span>
              <span className="text-[#7CC242] font-extrabold text-right">{car.condition || 'Excellent'}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-slate-50">
              <span className="text-slate-400 font-bold uppercase text-[8.5px] tracking-wider shrink-0 mr-4">MOT Status</span>
              <span className="text-slate-800 font-extrabold text-right">{car.motStatus || 'Passed & Valid'}</span>
            </div>
          </div>
        </div>

        {/* 6. Short Description */}
        <div className="py-2.5 border-b border-slate-100 space-y-1">
          <h4 className="font-sans font-black text-[10px] text-[#1F3F7A] uppercase tracking-wider">Short Description</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {description || `Pristine condition ${name} ${model} ready for direct underwriting. Every component has been fully tested, sanitised, and ready with active London low emission zones clearances.`}
          </p>
        </div>

        {/* 7. Features & Options Highlights */}
        {displayFeatures.length > 0 && (
          <div className="py-2.5 space-y-2">
            <h4 className="font-sans font-black text-[10px] text-[#1F3F7A] uppercase tracking-wider">Vehicle Features & Options Fitted</h4>
            <div className="flex flex-wrap gap-1.5 align-middle">
              {displayFeatures.map((feat, index) => (
                <span key={index} className="inline-flex items-center space-x-1.5 bg-slate-50 text-slate-700 font-semibold px-2.5 py-1 rounded border border-slate-100 text-[10px]">
                  {getFeatureIcon(feat)}
                  <span>{feat}</span>
                </span>
              ))}
              <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-100 text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7CC242]" />
                <span>ULEZ Compliant</span>
              </span>
            </div>
          </div>
        )}

        {/* 8. Conversion focused primary Apply CTA Button */}
        <div className="pt-2">
          <Link to={`/apply?carId=${car.id}`} className="block w-full">
            <button className="w-full h-11 text-xs font-black uppercase tracking-wider bg-[#7CC242] hover:bg-[#6db334] text-white rounded-xl shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center active:scale-98">
              Apply to Lease This Vehicle
            </button>
          </Link>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 p-2.5 flex items-center justify-between gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider leading-none">Weekly rate</span>
          <span className="text-[#1F3F7A] font-black text-lg">£{displayWeekly}/wk</span>
        </div>
        <Link to={`/apply?carId=${car.id}`} className="flex-1 max-w-[200px]">
          <button className="w-full h-10 text-[11px] font-[900] uppercase tracking-wider bg-[#7CC242] hover:bg-[#6db334] text-white border-2 border-[#7CC242] hover:border-[#6db334] rounded-xl shadow-sm transition-all duration-150 text-center flex items-center justify-center active:scale-95 cursor-pointer">
            Apply Now
          </button>
        </Link>
      </div>

      {/* DESKTOP SECURING ORIGINAL DESIGN (hidden lg:grid) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
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
              <span className="text-xs text-brand-primary font-black uppercase tracking-wider">Lease to Own Agreement</span>
              <h1 className="font-sans font-bold text-2xl sm:text-3xl text-gray-950 tracking-tight mt-1">{name}</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">{model}</p>
            </div>

            {/* Weekly Price Panel */}
            <div className="bg-brand-secondary text-white rounded-xl p-5 shadow-xs flex justify-between items-center">
              <div>
                <span className="text-xs text-brand-primary uppercase block font-bold tracking-wide">Contributive Weekly Rates</span>
                <span className="text-3xl font-black font-sans">£{displayWeekly}</span>
                <span className="text-xs text-brand-primary font-bold">/week</span>
              </div>
              <div className="text-right text-xs bg-white/10 px-3 py-2 rounded border border-white/10">
                <span className="block text-brand-primary font-extrabold uppercase tracking-widest text-[9px] mb-0.5">Agreement Term</span>
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
                    <div key={index} className="flex items-center space-x-2.5 text-xs text-gray-750 font-medium">
                      {getFeatureIcon(feat)}
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
