import React from 'react';
import { Car } from 'lucide-react';

export function BudgetMeterSection({
  BUDGET_STEPS,
  budgetIndex,
  setBudgetIndex,
  handleUrlScroll,
}) {
  return (
    <div className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-28 w-full px-3 sm:px-6">
      <div className="w-full max-w-[1400px] mx-auto bg-white rounded-[2rem] pt-10 pb-16 px-6 sm:px-12 md:px-16 shadow-[0_24px_55px_rgba(0,0,0,0.18)] border border-gray-150/80 animate-fade-in relative" id="affordability-meter-section">
        
        {/* Absolute badge breaking through the top center */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1F3F7A] border-[4px] border-white flex items-center justify-center shadow-lg grow-0 shrink-0">
          <Car className="w-6 h-6 text-white" />
        </div>

        {/* Title styled with brand primary blue */}
        <h2 className="font-sans font-black text-lg sm:text-2xl text-[#1F3F7A] tracking-tight text-center leading-tight mb-6 sm:mb-8 uppercase flex flex-col sm:flex-row sm:justify-between items-center gap-2 max-w-5xl mx-auto">
          <span>Select your weekly budget</span>
          <span className="text-[#1F3F7A] font-black text-lg sm:text-2xl bg-[#7CC242]/15 px-3.5 py-1 rounded-xl">£{BUDGET_STEPS[budgetIndex] || 100}{budgetIndex === BUDGET_STEPS.length - 1 ? '+' : ''}/wk</span>
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

          {/* Mobile Ticks/Steps: Dedicated responsive mobile layout showing ALL values for extreme convenience */}
          <div className="grid grid-cols-4 md:hidden w-full mt-4 select-none font-sans gap-1.5 sm:gap-2">
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

        {/* Bottom Overlapping Capsule Button */}
        <button
          onClick={handleUrlScroll}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-[#1F3F7A] to-[#173263] hover:from-[#7CC242] hover:to-[#6bb033] text-white font-black hover:scale-[1.03] transition-all duration-200 active:scale-95 py-3.5 sm:py-4 px-10 sm:px-14 rounded-full sm:text-base text-sm tracking-wide whitespace-nowrap shadow-[0_12px_30px_rgba(31,63,122,0.35)] flex items-center justify-center cursor-pointer border border-[#1f3f7a]/20 min-w-[245px] z-20 uppercase"
        >
          Search for your car
        </button>

      </div>
    </div>
  );
}
