import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { TestimonialsSection } from './Home/TestimonialsSection';
import { CarCard } from '../components/cars/CarCard';
import { Loader } from '../components/ui/Loader';
import { Car, Sliders, CheckSquare, FileText, Upload, Clock, CreditCard, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from '../hooks/useSEO';

const BUDGET_STEPS = [30, 50, 70, 100];

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
        className="w-full relative overflow-hidden pt-8 pb-4 sm:pt-12 md:pt-16 lg:pt-16 lg:pb-20 border-b-4 border-gray-400 select-none text-left"
        style={{
          background: 'linear-gradient(180deg, #8FD63D 0%, #A6D94F 35%, #BFEA69 70%, #CFF28D 100%)'
        }}
        id="integrated-homepage-hero"
      >

        {/* Dynamic layered gradients, smooth transitions, and multiple radial glow shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Soft horizontal glow in the middle */}
          <div 
            className="absolute top-1/3 left-0 right-0 h-[25%] opacity-70"
            style={{ 
              background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.45) 50%, transparent)',
              filter: 'blur(30px)' 
            }} 
          />

          {/* Radial Gradient Glow Circle 1 (Top Left) */}
          <div 
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-60"
            style={{ 
              background: 'radial-gradient(circle, #D9F7A1 0%, transparent 70%)',
              filter: 'blur(60px)' 
            }}
          />

          {/* Radial Gradient Glow Circle 2 (Middle Right) */}
          <div 
            className="absolute top-1/4 -right-10 w-[30rem] h-[30rem] rounded-full opacity-50"
            style={{ 
              background: 'radial-gradient(circle, #CFF28D 0%, transparent 70%)',
              filter: 'blur(80px)' 
            }}
          />

          {/* Radial Gradient Glow Circle 3 (Bottom Left) */}
          <div 
            className="absolute -bottom-20 -left-10 w-[24rem] h-[24rem] rounded-full opacity-75"
            style={{ 
              background: 'radial-gradient(circle, #BFEA69 0%, transparent 70%)',
              filter: 'blur(50px)' 
            }}
          />

          {/* Large blurred green glow behind the vehicle (layered right-aligned) */}
          <div 
            className="absolute top-10 right-[5%] lg:right-[10%] w-[45rem] h-[30rem] rounded-full opacity-80 mix-blend-screen hidden md:block"
            style={{ 
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, #D9F7A1 40%, #CFF28D 70%, transparent 100%)',
              filter: 'blur(70px)' 
            }}
          />

          {/* Layered waves styling for horizontal transition depths */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-40 opacity-50"
            style={{
              background: 'linear-gradient(170deg, transparent 40%, #D9F7A1 100%)',
              filter: 'blur(15px)'
            }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-24 opacity-75"
            style={{
              background: 'linear-gradient(185deg, transparent 30%, #CFF28D 100%)',
              filter: 'blur(5px)'
            }}
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none z-0"></div>

        <div className="w-full max-w-[80rem] mx-auto px-4 md:px-12 relative z-10">

          {/* ================= DESKTOP ONLY HERO LAYOUT ================= */}
          <div className="hidden lg:block relative w-full pb-10">
            <div className="w-full text-center lg:text-left lg:max-w-[36rem]">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="font-sans xl:ms-28 font-[700] text-[2.5rem] sm:text-[3.5rem] md:text-[6rem] xl:text-[5.2rem] text-black leading-[0.95] tracking-[-0.05em] "
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
              {/* Smooth glowing green background aura directly behind the car */}
              <div 
                className="absolute w-[85%] h-[80%] rounded-full opacity-70 z-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, #D9F7A1 40%, #CFF28D 75%, transparent 100%)',
                  filter: 'blur(50px)',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                }}
              />

              <img
                src="https://r2-buy-car.vercel.app/hero-car1.png"
                alt="Hero Car"
                referrerPolicy="no-referrer"
                className="w-full max-h-[225px] sm:max-h-[290px] lg:max-h-none scale-100 lg:scale-110 object-contain xl:mt-[-200px] xl:ml-[120px] drop-shadow-[0_25px_30px_rgba(0,0,0,0.35)] transform transition-transform duration-300 pointer-events-auto relative z-10"
              />
            </motion.div>

            {/* Budget Meter Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              id="budget-card"
              className="relative z-20 md:mt-16 lg:mt-96 xl:mt-[16rem] w-full xl:w-[90%] mx-auto bg-white rounded-2xl md:rounded-3xl p-3.5 sm:p-6 md:p-12 xl:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100/40"
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
                <div className="relative w-full h-12 mt-6 select-none font-sans">
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

              </div>

              {/* Bottom Button */}
              <button
                onClick={handleUrlScroll}
                className="lg:absolute lg:bottom-[-2.5rem] lg:left-1/2 lg:-translate-x-1/2 bg-gradient-to-b from-[#444] to-[#000] text-white font-[800] hover:scale-[1.03] transition-all duration-200 active:scale-95 py-3 px-8 md:py-4 md:px-12 rounded-full text-xs sm:text-base lg:text-[2rem] tracking-wider whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer border-2 border-white w-full lg:w-auto font-sans shrink-0 mt-3 lg:mt-0"
              >
                Search for your car
              </button>
            </motion.div>
          </div>

          {/* ================= MOBILE ONLY HERO LAYOUT ================= */}
         <div className="block lg:hidden flex flex-col gap-1 min-h-[360px] max-h-[550px] justify-between pb-2 select-none">
            {/* Row with text on left, car on right */}
            <div className="flex flex-row items-center justify-between gap-2 w-full mt-1">
              
              {/* Left Side: Heading & Description */}
              <div className="w-[52%] flex flex-col justify-center text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="font-sans font-[800] text-[24px] xs:text-[28px] ms-1 sm:text-[30px] text-black leading-[1.0] tracking-[-0.04em]"
                >
                  Let's find <br /> your car!
                </motion.h1>
              </div>

              {/* Right Side: Car Image */}
              <motion.div
                initial={{ opacity: 0, x: 15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-[45%] flex justify-end items-center relative select-none pointer-events-none"
              >
                {/* Smooth glowing green background aura directly behind the car */}
                <div 
                  className="absolute w-[90%] h-[90%] rounded-full opacity-60 z-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, #D9F7A1 40%, #CFF28D 75%, transparent 100%)',
                    filter: 'blur(20px)',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                  }}
                />

                <img
                  src="https://r2-buy-car.vercel.app/hero-car1.png"
                  alt="Hero Car"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[110px] sm:max-h-[135px] scale-140 sm:scale-100 mt-10 sm:mt-0 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)] relative z-10 -translate-x-[30px] translate-y-[20px] lg:translate-x-0 lg:translate-y-0"
                />
              </motion.div>
            </div>


            {/* Budget Meter Card for Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="w-full bg-white rounded-2xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-gray-100/40"
            >
              <h2 className="text-center font-sans font-extrabold text-[14px] sm:text-[16px] text-[#374151] tracking-tight leading-tight mb-2 uppercase flex justify-between items-center px-1">
                <span>Select weekly budget</span>
                <span className="text-[#1F3F7A] font-black text-xs sm:text-sm bg-[#7CC242]/15 px-2.5 py-0.5 rounded-lg">£{selectedBudget}{isMaxBudget ? '+' : ''}/wk</span>
              </h2>

              {/* Interactive Custom Range Slider for Mobile */}
              <div className="relative mt-2 mb-2 px-1">
                <input
                  type="range"
                  min="0"
                  max={BUDGET_STEPS.length - 1}
                  value={budgetIndex}
                  onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                  className="custom-slider-input w-full relative z-10 cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #76b82a 0%, #76b82a ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #333 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #333 100%)`,
                    height: '8px',
                    borderRadius: '9999px',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />

                {/* Mobile Ticks/Steps: Dedicated responsive mobile layout showing ALL values for extreme convenience */}
                <div className="grid grid-cols-4 w-full mt-2.5 select-none font-sans gap-1">
                  {BUDGET_STEPS.map((step, idx) => {
                    const isCurrent = budgetIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setBudgetIndex(idx)}
                        className={`font-sans font-black transition-all duration-150 cursor-pointer focus:outline-none text-[10px] sm:text-[11px] py-1.5 rounded-md border text-center whitespace-nowrap ${isCurrent
                          ? 'border-[#7CC242] bg-[#7CC242]/10 text-[#7CC242] scale-[1.02] shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-550'
                          }`}
                      >
                        £{step}{idx === BUDGET_STEPS.length - 1 ? '+' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Button for Mobile */}
              <button
                onClick={handleUrlScroll}
                className="bg-gradient-to-b from-[#444] to-[#000] text-white font-[800] hover:scale-[1.02] transition-all duration-200 active:scale-95 py-2 px-6 rounded-full text-[12px] sm:text-[13px] tracking-wide whitespace-nowrap shadow-[0_6px_16px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer border border-white w-full font-sans mt-2"
              >
                Search for your car
              </button>
            </motion.div>
          </div>

        </div>

      </section>
      
      {/* 2. MATCHING FLEET RESULTS */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-10 space-y-4 md:space-y-6" id="perfect-matches-grid">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-gray-100 pb-3 md:pb-4">
          <div className="text-left w-full sm:w-auto">
            <h3 className="font-extrabold  text-sm sm:text-lg xl:text-4xl text-black tracking-tight">
              Cars currently avaiable
            </h3>
            
          </div>
        </div>

        {/* Cars matching grid */}
        {loading ? (
          <Loader label="Synchronizing database records..." />
        ) : (
          <AnimatePresence mode="popLayout animate-fade-in">
            <motion.div
              layout
              className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {filteredCars.map((car) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={car.id}
                  className="max-w-[370px] mx-auto w-full"
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
      <section 
        className="w-full relative xl:py-10 my-0 overflow-hidden select-none animate-fade-in  flex items-center" 
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, transparent 60%), linear-gradient(180deg, #4CAF32 0%, #65C340 20%, #84D85A 45%, #A6E572 70%, #BFF08A 100%)'
        }}
        id="customer-journey-section"
      >
        <div className="w-full max-w-7xl mx-auto pt-[30px] pb-[40px] px-4 md:px-6 relative z-10 flex flex-col justify-center h-full">
          
          {/* Header block with 100% exact reference text hierarchy */}
          <div className="text-center mb-[30px]">
            <h2 className="font-sans font-bold text-[14px] md:text-[16px] xl:text-4xl text-[#123c03] tracking-normal mb-1">
              Your journey to ownership
            </h2>
            <p className="font-sans font-bold text-[24px] md:text-[28px] xl:text-5xl text-white leading-[1.2]">
              in 5 easy steps!
            </p>
          </div>

          {/* 5-Step Horizontal Cards Layout */}
          <div className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap lg:flex-nowrap justify-start md:justify-center items-center gap-[12px] md:gap-[16px] xl:gap-[25px] pb-4 md:pb-0 px-4 md:px-0 scrollbar-none snap-x w-full">
            
            {/* Step 1 */}
            <div className="bg-white rounded-[30px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-[95px] h-[85px] md:w-[150px] md:h-[150px] p-2.5 md:p-[12px] hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 snap-center select-none cursor-default">
              <span className="font-sans font-semibold text-[11px] md:text-[18px] text-[#222222] leading-[1.3] text-center">
                Set your budget and browse the vehicles
              </span>
            </div>

            {/* Accent Chevron between cards */}
            <div className="hidden md:flex items-center justify-center shrink-0 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-[95px] h-[85px] md:w-[150px] md:h-[150px] p-2.5 md:p-[12px] hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 snap-center select-none cursor-default">
              <span className="font-sans font-semibold text-[11px] md:text-[18px] text-[#222222] leading-[1.3] text-center">
                Select your vehicle
              </span>
            </div>

            {/* Accent Chevron between cards */}
            <div className="hidden md:flex items-center justify-center shrink-0 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-[95px] h-[85px] md:w-[150px] md:h-[150px] p-2.5 md:p-[12px] hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 snap-center select-none cursor-default">
              <span className="font-sans font-semibold text-[11px] md:text-[18px] text-[#222222] leading-[1.3] text-center">
                Submit your documents
              </span>
            </div>

            {/* Accent Chevron between cards */}
            <div className="hidden md:flex items-center justify-center shrink-0 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-[95px] h-[85px] md:w-[150px] md:h-[150px] p-2.5 md:p-[12px] hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 snap-center select-none cursor-default">
              <span className="font-sans font-semibold text-[11px] md:text-[18px] text-[#222222] leading-[1.3] text-center">
                Await approval
              </span>
            </div>

            {/* Accent Chevron between cards */}
            <div className="hidden md:flex items-center justify-center shrink-0 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-[95px] h-[85px] md:w-[150px] md:h-[150px] p-2.5 md:p-[12px] hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 snap-center select-none cursor-default">
              <span className="font-sans font-semibold text-[11px] md:text-[18px] text-[#222222] leading-[1.3] text-center">
                Collect and drive
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Modern High-End Premium Testimonial Section */}
      <TestimonialsSection />
    </div>
  );
}
