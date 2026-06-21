import React from 'react';
import { motion } from 'motion/react';

export function HeroSection({
  budgetIndex,
  setBudgetIndex,
  BUDGET_STEPS,
  selectedBudget,
  isMaxBudget,
  handleUrlScroll
}) {
  return (
    <section
      className="w-full relative overflow-hidden pt-8 pb-4 sm:pt-12 md:pt-16 lg:pt-16 lg:pb-20 border-b-4 border-gray-400 select-none text-left bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("public/bg.png")'
      }}
      id="integrated-homepage-hero"
    >
      <div className="w-full max-w-[80rem] mx-auto px-4 md:px-12 relative z-10">

        {/* ================= DESKTOP ONLY HERO LAYOUT ================= */}
        <div className="hidden lg:block relative w-full">
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

          {/* Hero Car Wrapper with spring side-scrolling animation from the right */}
          <motion.div
            initial={{ opacity: 0, x: 220, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 45, damping: 11, delay: 0.15 }}
            className="relative lg:absolute lg:right-[0%] w-full max-w-[52rem] mx-auto lg:m-0 flex justify-center items-center select-none z-40 pointer-events-none mt-2 lg:mt-0"
          >
            {/* Ground Green Shadow beneath the desktop car */}
            <div
              className="absolute bottom-[-5px] xl:bottom-[-202px] left-[50%] xl:left-[64%] -translate-x-1/2 w-[72%] h-[20px] md:h-[35px] rounded-[100%] z-0 bg-[#7CC242]/50 pointer-events-none blur-md"
              style={{
                mixBlendMode: 'multiply'
              }}
            />

            <img
              src="public/Citroen_C5_Aircross-01.png"
              alt="Hero Car"
              referrerPolicy="no-referrer"
              className="w-full max-h-[225px] sm:max-h-[290px] lg:max-h-none scale-100 lg:scale-110 xl:scale-125 object-contain xl:mt-[-120px] xl:ml-[120px] drop-shadow-[0_25px_30px_rgba(0,0,0,0.35)] transform transition-transform duration-300 pointer-events-auto relative z-10"
            />
          </motion.div>

          {/* Budget Meter Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            id="budget-card"
            className="relative z-20 mt-3 md:mt-16 lg:mt-96 xl:mt-[18rem] w-full xl:w-[90%] mx-auto bg-white rounded-2xl md:rounded-3xl p-3.5 sm:p-6 md:p-12 xl:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100/40"
          >
            <h2 className="text-center md:text-left font-sans font-extrabold text-[1.25rem] sm:text-[1.75rem] md:text-[2.25rem] text-[#374151] tracking-tight leading-tight mb-3 md:mb-10 uppercase flex flex-col md:flex-row md:justify-between items-center gap-2">
              <span>Select your weekly budget</span>
              <span className="text-[#1F3F7A] font-black text-lg md:text-2xl bg-[#7CC242]/15 px-3.5 py-1 rounded-xl font-bold">£{selectedBudget}{isMaxBudget ? '+' : ''}/wk</span>
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
                          ? 'border-[#76b82a] bg-[#76b82a]/10 text-[#76b82a] scale-110 shadow-sm font-black font-bold'
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

          {/* Bullet-points checklist block below the budget card on desktop limit */}
          <div className="mt-16 xl:mt-[5rem] mx-auto grid grid-cols-3 gap-16 text-black font-sans font-extrabold text-xs sm:text-sm lg:text-[1.125rem] select-none px-4">
            <div className="flex flex-col items-start gap-3 mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none font-black text-black select-none">•</span>
                <span className="tracking-tight">No deposit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none font-black text-black select-none">•</span>
                <span className="tracking-tight">No credit checks</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none font-black text-black select-none">•</span>
                <span className="tracking-tight">Vehicles have Tax + MOT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none font-black text-black select-none">•</span>
                <span className="tracking-tight">Multiple price points</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none font-black text-black select-none">•</span>
                <span className="tracking-tight">Option to upgrade</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none font-black text-black select-none">•</span>
                <span className="tracking-tight">Quick and simple</span>
              </div>
            </div>
          </div>
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
                className="font-sans font-[800] text-[24px] xs:text-[28px] sm:text-[30px] text-black leading-[1.0] tracking-[-0.04em]"
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
              {/* Ground Green Shadow beneath the mobile car */}
              <div
                className="absolute bottom-[5px] left-[32%] -translate-x-1/2 w-[70%] h-[12px] rounded-[100%] bg-[#7CC242]/50 pointer-events-none blur-sm z-0"
                style={{
                  mixBlendMode: 'multiply'
                }}
              />

              <img
                src="https://r2-buy-car.vercel.app/hero-car1.png"
                alt="Hero Car"
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[110px] sm:max-h-[135px] scale-140 sm:scale-100 mt-7 sm:mt-0 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)] relative z-10 -translate-x-[30px] translate-y-[20px] lg:translate-x-0 lg:translate-y-0"
              />
            </motion.div>
          </div>

          {/* Budget Meter Card for Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full bg-white rounded-2xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-gray-100/40 mt-1"
          >
            <h2 className="text-center font-sans font-extrabold text-[14px] sm:text-[16px] text-[#374151] tracking-tight leading-tight mb-2 uppercase flex justify-between items-center px-1 font-bold">
              <span>Select weekly budget</span>
              <span className="text-[#1F3F7A] font-black text-xs sm:text-sm bg-[#7CC242]/15 px-2.5 py-0.5 rounded-lg font-bold">£{selectedBudget}{isMaxBudget ? '+' : ''}/wk</span>
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

              {/* Mobile Ticks/Steps */}
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
  );
}
