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
      className="w-full relative overflow-hidden pt-4 pb-4 sm:pt-8 sm:pb-12 border-b-4 border-gray-400 select-none text-left bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://rent2-buy-images.vercel.app/bg.png")'
      }}
      id="integrated-homepage-hero"
    >
      {/* Inline styles for custom slider thumb and custom elements matching the screenshot perfectly */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-slider-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 9999px;
          background: #333;
          outline: none;
          transition: background 0.15s ease-in-out;
        }
        .custom-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #7CC242;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .custom-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .custom-slider-input::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #7CC242;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .custom-slider-input::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
      `}} />

      <div className="w-full max-w-[80rem] mx-auto px-4 md:px-12 relative z-10 flex flex-col gap-3 sm:gap-6">
        
        {/* Row with text on left, car on right */}
        <div className="relative w-full flex flex-row items-center justify-between sm:mb-2 lg:block">
          
          {/* Left Side: Heading */}
          <div className="w-[52%] lg:w-auto text-left lg:max-w-[36rem]">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-sans -mt-10 sm:mt-0 lg:ms-16 xl:ms-28 xl:mt-10 font-[950] text-[20px] xs:text-[30px] sm:text-[42px] md:text-[5.5rem] xl:text-[5.2rem] text-black leading-[1.05] tracking-[-0.04em] lg:tracking-[-0.05em]"
            >
              Let's find <br /> your car!
            </motion.h1>
          </div>

          {/* Right Side: Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 120, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 45, damping: 11, delay: 0.15 }}
            className="w-[45%] lg:w-auto relative lg:absolute lg:right-[0%] lg:top-[-20px] max-w-[52rem] mx-auto lg:m-0 flex justify-center lg:justify-end xl:justify-center items-center select-none z-30 pointer-events-none mt-1 lg:mt-0 xl:mt-65"
          >
            {/* Multiple shadows to replicate the realistic floor drop shadow */}
            <div
              className="absolute bottom-[-5px] sm:bottom-[-12px] lg:bottom-[-16px] xl:bottom-[-80px] left-[50%] xl:left-[64%] -translate-x-1/2 z-0 pointer-events-none"
              style={{
                width: '80%',
                height: '20px',
                filter: 'blur(15px)',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
              }}
            />
            
            {/* Darker immediate contact shadow directly under car body */}
            <div
              className="absolute bottom-[-1px] sm:bottom-[-4px] lg:bottom-[-6px] left-[50%]  z-0 pointer-events-none"
              style={{
                width: '65%',
                height: '8px',
                filter: 'blur(4px)',
                background: 'rgba(0,0,0,0.65)'
              }}
            />

            <img
              src="https://rent2-buy-images.vercel.app/Citroen_C5_Aircross-01.png"
              alt="Hero Car"
              referrerPolicy="no-referrer"
              className="w-full max-h-[115px] xs:max-h-[130px] sm:max-h-[225px] md:max-h-[290px] lg:max-h-none scale-170 lg:scale-110 xl:scale-125 object-contain -translate-x-8 mt-14 xl:mt-[-120px] xl:ml-[120px] drop-shadow-[5px_15px_5px_rgba(0,0,0,0.4)] transform transition-transform duration-300 pointer-events-auto relative z-10"
            />

            
          </motion.div>

        </div>

        {/* Budget Meter Card */}
        <div className="relative w-full max-w-xl sm:max-w-4xl mx-auto z-20 mt-5 lg:mt-64 xl:mt-[17rem]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            id="budget-card"
            className="w-full bg-white rounded-2xl md:rounded-3xl px-5 pt-4 pb-4 sm:px-8 sm:pt-6 sm:pb-16 shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-gray-150/50 relative"
          >
            {/* Header Title inside card */}
            <h2 className="text-left font-sans font-extrabold text-[15px] sm:text-[22px] md:text-[26px] text-gray-800 tracking-tight leading-none mb-3 sm:mb-6 uppercase">
              Select your weekly budget
            </h2>

            {/* Interactive Custom Range Slider */}
            <div className="relative mt-2 sm:mt-6 mb-2  max-w-6xl mx-auto px-1 sm:px-4">
              <input
                type="range"
                min="0"
                max={BUDGET_STEPS.length - 1}
                value={budgetIndex}
                onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                className="custom-slider-input"
                style={{
                  background: `linear-gradient(to right, #7CC242 0%, #7CC242 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #e5e7eb ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #e5e7eb 100%)`,
                }}
              />

              {/* Slider Labels - properly positioned underneath */}
              <div className="relative w-full h-8 mt-2.5 select-none font-sans">
                {BUDGET_STEPS.map((step, idx) => {
                  const isCurrent = budgetIndex === idx;
                  const pct = idx / (BUDGET_STEPS.length - 1);
                  return (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2"
                      style={{
                        left: `calc(14px + (100% - 28px) * ${pct})`
                      }}
                    >
                      <button
                        onClick={() => setBudgetIndex(idx)}
                        className={`font-sans font-[800] transition-colors duration-150 cursor-pointer focus:outline-none text-[12px] sm:text-[15px] md:text-[17px] whitespace-nowrap text-center ${
                          isCurrent
                            ? 'text-[#7CC242] scale-105'
                            : 'text-[#9ca3af] hover:text-gray-800'
                        }`}
                        style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0 }}
                      >
                        £{step}{idx === BUDGET_STEPS.length - 1 ? '+' : ''}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Floating Pill Button - centered perfectly on bottom border of the card */}
            <div className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={handleUrlScroll}
                className="bg-black hover:bg-slate-900 border-2 border-white/95 text-white font-[900] hover:scale-[1.03] active:scale-95 py-2.5 px-8 sm:py-3.5 sm:px-12 rounded-full text-[13px] sm:text-[16px] tracking-wide whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.35)] flex items-center justify-center cursor-pointer font-sans"
              >
                Search for your car
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bullet-points checklist block below the budget card - clean and compact */}
        <div className="mt-5 sm:mt-10 mx-auto grid grid-cols-2 gap-x-1 sm:gap-x-80 gap-y-1 sm:gap-y-2 text-black font-sans font-bold text-[9px] sm:text-sm md:text-[15px] xl:text-xl select-none px-2 max-w-6xl justify-between text-center">
          {/* Left Column */}
          <div className="flex flex-col items-start gap-1 sm:gap-2">
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[#3AA51D] text-xs sm:text-sm font-black select-none">•</span>
              <span className="tracking-tight text-gray-900 font-[800]">Medium price points</span>
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[#3AA51D] text-xs sm:text-sm font-black select-none">•</span>
              <span className="tracking-tight text-gray-900 font-[800]">Option to upgrade</span>
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[#3AA51D] text-xs sm:text-sm font-black select-none">•</span>
              <span className="tracking-tight text-gray-900 font-[800]">Quick and simple</span>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col items-start gap-1 sm:gap-2">
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[#3AA51D] text-xs sm:text-sm font-black select-none">•</span>
              <span className="tracking-tight text-gray-900 font-[800]">No deposit</span>
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[#3AA51D] text-xs sm:text-sm font-black select-none">•</span>
              <span className="tracking-tight text-gray-900 font-[800]">No credit checks</span>
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[#3AA51D] text-xs sm:text-sm font-black select-none">•</span>
              <span className="tracking-tight text-gray-900 font-[800]">Vehicles have Tax + MOT</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
