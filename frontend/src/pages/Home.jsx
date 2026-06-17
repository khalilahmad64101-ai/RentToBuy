import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { TestimonialsSection } from './Home/TestimonialsSection';
import { CarCard } from '../components/cars/CarCard';
import { Loader } from '../components/ui/Loader';
import { Car, Sliders, CheckSquare, FileText, Upload, Clock, CreditCard, Key } from 'lucide-react';
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
    <div className="space-y-2 md:space-y-12 pb-16 bg-gray-50/30 w-full" id="home-page-view">

      {/* 1. Large Integrated Full Screen Hero + Affordability Meter Section */}
      <section
        className="w-full relative overflow-hidden pt-16 md:pt-16 pb-4 md:pb-20 border-b-4 border-gray-400 select-none text-left"
        style={{
          background: 'linear-gradient(to bottom, #B8DC82, #619921, #BFDF8C)'
        }}
        id="integrated-homepage-hero"
      >

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none z-0"></div>

        <div className="w-full max-w-[80rem] mx-auto px-4 md:px-12 relative z-10">

          <div className="w-full text-center lg:text-left lg:max-w-[36rem]">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-sans font-[900] text-[2.5rem] sm:text-[3.5rem] md:text-[6rem] xl:text-[6.5rem] text-black leading-[0.95] tracking-[-0.05em] "
            >
              Let's find <br /> your car!
            </motion.h1>
          </div>

          {/* Hero Car Wrapper with spring side-scrolling animation from the right (enters at 220px to 0) */}
          <motion.div
            initial={{ opacity: 0, x: 220, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 45, damping: 11, delay: 0.15 }}
            className="relative lg:absolute lg:right-[0%] w-full max-w-[52rem] mx-auto lg:m-0 flex justify-center items-center select-none z-40 pointer-events-none mt-2 lg:mt-0"
          >
            <img
              src="https://r2-buy-car.vercel.app/hero-car1.png"
              alt="Hero Car"
              referrerPolicy="no-referrer"
              className="w-full max-h-[225px] sm:max-h-[290px] lg:max-h-none scale-100 lg:scale-140 object-contain xl:mt-[-70px] xl:ml-[-110px] drop-shadow-[0_25px_30px_rgba(0,0,0,0.35)] transform transition-transform duration-300 pointer-events-auto"
            />
          </motion.div>

          {/* Budget Meter Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            id="budget-card"
            className="relative z-20 mt-3 md:mt-16 lg:mt-96 xl:mt-[25rem] w-full xl:w-[90%] mx-auto bg-white rounded-2xl md:rounded-3xl p-3.5 sm:p-6 md:p-12 xl:p-14 shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100/40"
          >
            <h2 className="text-center md:text-left font-sans font-extrabold text-[1.25rem] sm:text-[1.75rem] md:text-[2.25rem] text-[#374151] tracking-tight leading-tight mb-3 md:mb-10 uppercase flex flex-col md:flex-row md:justify-between items-center gap-2">
              <span>Select your weekly budget</span>
              <span className="text-[#1F3F7A] font-black text-lg md:text-2xl bg-[#7CC242]/15 px-3.5 py-1 rounded-xl">£{selectedBudget}{isMaxBudget ? '+' : ''}/wk</span>
            </h2>

            {/* Interactive Custom Range Slider */}
            <div className="relative mt-2.5 md:mt-8 mb-2.5 md:mb-6 max-w-5xl mx-auto px-2 md:px-4">
              <input
                type="range"
                min="0"
                max={BUDGET_STEPS.length - 1}
                value={budgetIndex}
                onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                className="custom-slider-input w-full relative z-10 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #76b82a 0%, #76b82a ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #333 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #333 100%)`,
                  height: '10px',
                  borderRadius: '9999px',
                  outline: 'none',
                  WebkitAppearance: 'none'
                }}
              />

              {/* Slider Labels - properly positioned underneath */}
              {/* Desktop Ticks/Steps: Show all values, properly aligned and centered beneath */}
              <div className="hidden lg:block relative w-full h-12 mt-6 select-none font-sans">
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
                        className={`font-sans font-black transition-all duration-200 cursor-pointer focus:outline-none text-xs sm:text-sm md:text-base py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl border whitespace-nowrap min-w-[50px] sm:min-w-[55px] text-center ${isCurrent
                          ? 'border-[#76b82a] bg-[#76b82a]/10 text-[#76b82a] scale-110 shadow-sm font-black'
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:text-[#76b82a] hover:border-[#76b82a]/30'
                          }`}
                      >
                        £{step}{idx === BUDGET_STEPS.length - 1 ? '+' : ''}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Ticks/Steps: Dedicated responsive mobile layout showing ALL values for extreme convenience */}
              <div className="grid grid-cols-4 lg:hidden w-full mt-2.5 select-none font-sans gap-1.5 md:gap-2">
                {BUDGET_STEPS.map((step, idx) => {
                  const isCurrent = budgetIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setBudgetIndex(idx)}
                      className={`font-sans font-black transition-all duration-150 cursor-pointer focus:outline-none text-[11px] py-2 rounded-lg border text-center whitespace-nowrap ${isCurrent
                        ? 'border-[#7CC242] bg-[#7CC242]/10 text-[#7CC242] scale-[1.03] shadow-xs font-black'
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:text-[#7CC242]'
                        }`}
                    >
                      £{step}{idx === BUDGET_STEPS.length - 1 ? '+' : ''}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Bottom Button */}
            <button
              onClick={handleUrlScroll}
              className="lg:absolute lg:bottom-[-2.5rem] lg:left-1/2 lg:-translate-x-1/2 bg-gradient-to-b from-[#444] to-[#000] text-white font-[800] hover:scale-[1.03] transition-all duration-200 active:scale-95 py-3 px-8 md:py-4 md:px-12 rounded-full text-xs sm:text-base lg:text-[2.25rem] tracking-tight whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer border-2 border-white w-full lg:w-auto uppercase font-sans shrink-0 mt-3 lg:mt-0"
            >
              Search for your car
            </button>
          </motion.div>

        </div>

      </section>
      
      {/* 2. MATCHING FLEET RESULTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-10 space-y-4 md:space-y-6" id="perfect-matches-grid">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-gray-100 pb-3 md:pb-4">
          <div className="text-left w-full sm:w-auto">
            <h3 className="font-extrabold text-sm sm:text-lg text-brand-secondary uppercase tracking-tight">
              Perfect Affordability Matches
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
              Select a car underneath to begin your quick online application instantly
            </p>
          </div>
          <span className="px-3 py-1 text-[10px] sm:text-xs font-black bg-brand-secondary text-white rounded-full uppercase tracking-wider whitespace-nowrap self-start sm:self-auto">
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
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

      {/* 3. Customer Journey Section */}
      <section className="bg-white border-y border-gray-100 py-16 w-full animate-fade-in" id="customer-journey-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Your Journey to Vehicle Ownership
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-400">
              Follow these simple steps to find your vehicle and complete your application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">

            {/* Step 1 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 01
              </div>
              <div className="w-12 h-12 bg-[#7CC242]/10 rounded-2xl flex items-center justify-center text-[#7CC242] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Set Your Budget</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                Use the affordability meter to choose your weekly budget.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 02
              </div>
              <div className="w-12 h-12 bg-[#1F3F7A]/10 rounded-2xl flex items-center justify-center text-[#1F3F7A] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Browse Matching Vehicles</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                View vehicles that match your selected budget.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 03
              </div>
              <div className="w-12 h-12 bg-[#7CC242]/10 rounded-2xl flex items-center justify-center text-[#7CC242] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Choose Your Vehicle</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                Select the car that best suits your needs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 04
              </div>
              <div className="w-12 h-12 bg-[#1F3F7A]/10 rounded-2xl flex items-center justify-center text-[#1F3F7A] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Start Your Application</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                Complete the online application form.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 05
              </div>
              <div className="w-12 h-12 bg-[#7CC242]/10 rounded-2xl flex items-center justify-center text-[#7CC242] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Upload Required Documents</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                Submit your driving licence, selfie, and required verification documents.
              </p>
            </div>

            {/* Step 6 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 06
              </div>
              <div className="w-12 h-12 bg-[#1F3F7A]/10 rounded-2xl flex items-center justify-center text-[#1F3F7A] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Application Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                Our team reviews and verifies your application.
              </p>
            </div>

            {/* Step 7 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 07
              </div>
              <div className="w-12 h-12 bg-[#7CC242]/10 rounded-2xl flex items-center justify-center text-[#7CC242] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Approval & Payment</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                Once approved, complete the required payment.
              </p>
            </div>

            {/* Step 8 */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#7CC242]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-300 group-hover:text-[#7CC242]/40 transition-colors">
                STEP 08
              </div>
              <div className="w-12 h-12 bg-[#1F3F7A]/10 rounded-2xl flex items-center justify-center text-[#1F3F7A] mb-6 group-hover:scale-110 transition-transform animate-bounce-slow">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">Collect & Drive</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                Receive your vehicle and start your journey.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Modern High-End Premium Testimonial Section */}
      <TestimonialsSection />
    </div>
  );
}
