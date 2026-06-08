import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { VehicleFeaturesSection } from './Home/VehicleFeaturesSection';
import { HowItWorksSection } from './Home/HowItWorksSection';
import { PerksSection } from './Home/PerksSection';
import { TestimonialsSection } from './Home/TestimonialsSection';
import { CarCard } from '../components/cars/CarCard';
import { Loader } from '../components/ui/Loader';
import { Car } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from '../hooks/useSEO';

const BUDGET_STEPS = [30, 40, 50, 60, 70, 80, 90, 100];

export function Home() {
  useSEO({
    title: 'R2BuyCar | Seamless Rent-to-Buy Car Ownership UK',
    description: 'Get on the road with affordable rent-to-buy cars. Zero setup fees, instant underwriting, and no rigid credit barriers. Routine maintenance, servicing, and road tax are fully covered.',
    keywords: 'rent to buy cars, car subscription, budget car match Manchester, PCO car fleet London, lease to own, buycarz'
  });

  const [dbCars, setDbCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetIndex, setBudgetIndex] = useState(7); // default is £100 (maximum index)
  
  // Fetch premium cars from DB to integrate with database entries
  useEffect(() => {
    api.cars.list()
      .then((data) => {
        setDbCars(data || []);
      })
      .catch((err) => console.error('[Home Page Error] Failed to retrieve server-seeded fleet listings:', err))
      .finally(() => setLoading(false));
  }, []);

  const selectedBudget = BUDGET_STEPS[budgetIndex];
  const isMaxBudget = budgetIndex === BUDGET_STEPS.length - 1;

  // Filter logic: show cars from DB based on pricing
  const getFilteredCars = () => {
    return dbCars.filter(car => {
      const rate = car.weeklyRate || car.price || 50;
      if (isMaxBudget) {
        return true; // £80 shows all cars
      }
      return rate <= selectedBudget;
    });
  };

  const filteredCars = getFilteredCars();

  const handleUrlScroll = () => {
    const el = document.getElementById('perfect-matches-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 pb-16 bg-gray-50/30 w-full" id="home-page-view">
      
      {/* 1. Large Integrated Full Screen Hero + Affordability Meter Section */}
      <section className="w-full text-left" id="integrated-homepage-hero">
        
        {/* Full-width premium background container with luxury dark overlay */}
        <div 
          className="relative w-full min-h-[600px] lg:h-[760px] bg-cover bg-center flex items-center pt-16 pb-32 md:pb-40 lg:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8, 14, 28, 0.96) 0%, rgba(12, 22, 44, 0.72) 45%, rgba(15, 23, 42, 0.25) 100%), url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1600')`
          }}
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none z-0"></div>
          
          {/* Decorative graphic overlay */}
          <div className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-0"></div>

          {/* Two-Column Grid layout: Left-Text layout & Right-Car layout */}
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left text block: Title, subtitle & two buttons with logo colors (#7CC242, #1F3F7A) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/10 text-white text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-white/20">
                ⭐ Premium Rent-to-Buy Fleet
              </div>
              
              <h1 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-none uppercase">
                Let's find <br />
                <span className="text-[#7CC242]">your car!</span>
              </h1>
              
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal">
                No credit checks, no hidden fees. We help people with low income, poor credit, or zero credit history start their path to vehicle ownership today.
              </p>
              
              {/* Two buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7CC242] hover:bg-[#6bb033] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#7CC242]/20 transition-all duration-200 active:scale-95 cursor-pointer font-sans"
                >
                  Start Application
                </Link>
                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 cursor-pointer font-sans"
                >
                  View Fleet
                </Link>
              </div>
            </div>

            {/* Right Image element: stylish premium SUV */}
            <div className="lg:col-span-5 relative flex items-center justify-center select-none mt-8 lg:mt-0">
            
            </div>

          </div>

        </div>

        {/* Budget Meter overlapping the bottom of the Hero Section precisely */}
        <div className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-28 w-full px-3 sm:px-6">
          <div className="w-full max-w-[1400px] mx-auto bg-white rounded-[2rem] pt-10 pb-16 px-6 sm:px-12 md:px-16 shadow-[0_24px_55px_rgba(0,0,0,0.18)] border border-gray-100/80 animate-fade-in relative" id="affordability-meter-section">
            
            {/* Absolute badge breaking through the top center */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1F3F7A] border-[4px] border-white flex items-center justify-center shadow-lg grow-0 shrink-0">
              <Car className="w-6 h-6 text-white" />
            </div>

            {/* Title styled with brand primary blue */}
            <h2 className="font-sans font-black text-xl sm:text-2xl text-[#1F3F7A] tracking-tight text-center leading-tight mb-8 uppercase">
              Select your weekly budget
            </h2>

            {/* Interactive Custom Range Slider */}
            <div className="relative mt-8 mb-6 max-w-5xl mx-auto px-4 sm:px-6">
              <input
                type="range"
                min="0"
                max={BUDGET_STEPS.length - 1}
                value={budgetIndex}
                onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                className="custom-slider-input w-full relative z-10"
                style={{
                  background: `linear-gradient(to right, #7CC242 0%, #7CC242 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #e2e8f0 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #e2e8f0 100%)`
                }}
              />

              {/* Desktop Ticks/Steps: Show all values, properly aligned and centered beneath */}
              <div className="hidden md:block relative w-full h-12 mt-6 select-none font-sans">
                {BUDGET_STEPS.map((step, idx) => {
                  const isCurrent = budgetIndex === idx;
                  const pct = idx / (BUDGET_STEPS.length - 1);
                  return (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2"
                      style={{
                        left: `calc(17px + (100% - 34px) * ${pct})`
                      }}
                    >
                      <button
                        onClick={() => setBudgetIndex(idx)}
                        className={`font-sans font-black transition-all duration-200 cursor-pointer focus:outline-none text-xs sm:text-sm md:text-base py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl border whitespace-nowrap min-w-[50px] sm:min-w-[55px] text-center ${
                          isCurrent 
                            ? 'border-[#7CC242] bg-[#7CC242]/10 text-[#7CC242] scale-110 shadow-sm' 
                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:text-[#7CC242] hover:border-[#7CC242]/30'
                        }`}
                      >
                        £{step}{idx === BUDGET_STEPS.length - 1 ? '+' : ''}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Ticks/Steps: Dedicated responsive mobile layout (Show 4 values, evenly spaced, centered, no overlap, touch-friendly) */}
              <div className="flex md:hidden justify-between items-center w-full mt-6 select-none font-sans gap-2">
                {[
                  { label: '40', index: 1 },
                  { label: '60', index: 3 },
                  { label: '80', index: 5 },
                  { label: '100+', index: 7 }
                ].map((item) => {
                  const isCurrent = budgetIndex === item.index || 
                    (item.index === 1 && budgetIndex === 0) || 
                    (item.index === 3 && budgetIndex === 2) || 
                    (item.index === 5 && budgetIndex === 4) || 
                    (item.index === 7 && budgetIndex === 6);
                  return (
                    <button
                      key={item.index}
                      onClick={() => setBudgetIndex(item.index)}
                      className={`flex-1 font-sans font-black transition-all duration-200 cursor-pointer focus:outline-none text-xs sm:text-sm py-2 px-1 rounded-xl border text-center whitespace-nowrap ${
                        isCurrent 
                          ? 'border-[#7CC242] bg-[#7CC242]/10 text-[#7CC242] scale-105 shadow-xs font-bold' 
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:text-[#7CC242] hover:border-[#7CC242]/30'
                      }`}
                    >
                      £{item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Overlapping Capsule Button */}
            <button
              onClick={handleUrlScroll}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-[#1F3F7A] to-[#173263] hover:from-[#7CC242] hover:to-[#6bb033] text-white font-black hover:scale-[1.03] transition-all duration-200 active:scale-95 py-3.5 sm:py-4 px-10 sm:px-14 rounded-full sm:text-base text-sm tracking-wide whitespace-nowrap shadow-[0_12px_30px_rgba(31,63,122,0.35)] flex items-center justify-center cursor-pointer border border-[#1f3f7a]/20 min-w-[245px] z-20 uppercase"
            >
              Search for your car
            </button>

          </div>
        </div>

      </section>

      {/* 2. MATCHING FLEET RESULTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6" id="perfect-matches-grid">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-100 pb-4">
          <div className="text-left w-full sm:w-auto">
            <h3 className="font-extrabold text-lg text-brand-secondary uppercase tracking-tight">
              Perfect Affordability Matches
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Select a car underneath to begin your quick online application instantly
            </p>
          </div>
          <span className="px-3.5 py-1.5 text-xs font-black bg-brand-secondary text-white rounded-full uppercase tracking-wider whitespace-nowrap self-start sm:self-auto">
            {filteredCars.length} Car{filteredCars.length === 1 ? '' : 's'} Matched
          </span>
        </div>

        {/* Cars matching grid */}
        {loading ? (
          <Loader label="Synchronizing database records..." />
        ) : (
          <AnimatePresence mode="popLayout animate-fade-in">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCars.map((car) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={car.id}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {filteredCars.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto">
            <span className="text-3xl block mb-4">🚗</span>
            <h4 className="font-bold text-slate-700">No Direct Matches Fit Online</h4>
            <p className="text-xs text-slate-500 mt-1 px-4 leading-normal">
              Try dragging the slider to £40/week or £50/week to explore ultra-cheap hatchbacks, fully insured!
            </p>
          </div>
        )}
      </div>

      {/* Integrated Vehicle Features Section */}
      <VehicleFeaturesSection />

      {/* Mechanics Explanation: How it works */}
      <HowItWorksSection />

      {/* Highlight Testimonials / Perks layout */}
      <PerksSection />

      {/* Modern High-End Premium Testimonial Section */}
      <TestimonialsSection />
    </div>
  );
}
