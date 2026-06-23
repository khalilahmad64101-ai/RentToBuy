import React from 'react';

export function JourneyStepsSection() {
  const steps = [
    { num: "1", text: "Set your budget and browse the vehicles" },
    { num: "2", text: "Select your vehicle" },
    { num: "3", text: "Submit your documents" },
    { num: "4", text: "Await approval" },
    { num: "5", text: "Collect and drive" }
  ];

  return (
    <section className="py-16 sm:py-20 text-center w-full relative px-4 overflow-hidden" 
      style={{
          background: 'linear-gradient(to right, #78CE35 0%, #78CE35 100%)'
        }}
        id="customer-journey-section"
      >
        {/* Soft top white-shade gradient to blend with the previous section */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/50  to-transparent pointer-events-none z-10" />

        {/* Soft bottom white-shade gradient to blend with the reviews section */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none z-10" />

        <div className="max-w-6xl pb-7 sm:pb-0 -mt-5 sm:mt-0 mx-auto relative z-20">
          
          <div className="mb-6 text-center">
            <h2 className="font-sans font-[700] text-xl sm:text-3xl md:text-[2.25rem] text-white tracking-tight leading-tight">
              Your journey to ownership in 5 easy steps!
            </h2>
          </div>

          {/* Stepper Capsules Layout: Centered vertical layout for Mobile, and organized 2+3 layout for Desktop */}
          
          {/* Mobile and Tablet Layout (Vertical stack with gorgeous heavy black blur box backdrops) */}
          <div className="flex flex-col md:hidden items-stretch justify-center w-full max-w-[340px] mx-auto gap-[22px] px-3 py-6 select-none animate-fade-in">
            
            {/* Step 1 */}
            <div className="w-full relative">
              {/* Heavy Black Blur Box backdrop structure */}
              <div className="absolute inset-x-3 bottom-[-4px] top-3 bg-black/72 rounded-full blur-[9px] pointer-events-none z-0" />
              <div className="relative bg-white rounded-full py-1 px-2 border border-slate-100 flex items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <div className="bg-[#78CE35] text-white font-[950] text-[40px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                  1
                </div>
                <p className="font-sans text-center font-[800] text-[13.5px] sm:text-[14.5px] leading-snug text-slate-850 tracking-tight">
                  Set your budget and browse the vehicles
                </p>
                {/* Downward triangle pointing to the next step */}
                <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-[0_12px_10px_rgba(0,0,0,0.35)]">
                  <svg width="24" height="13" viewBox="0 0 24 13" fill="none">
                    <path d="M0 0 L12 12 L24 0 Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="w-full relative">
              {/* Heavy Black Blur Box backdrop structure */}
              <div className="absolute inset-x-3 bottom-[-4px] top-3 bg-black/72 rounded-full blur-[9px] pointer-events-none z-0" />
              <div className="relative bg-white rounded-full py-1 px-2 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <div className="bg-[#78CE35] text-white font-[950] text-[40px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                  2
                </div>
                <p className="font-sans font-[800] text-[13.5px] sm:text-[14.5px] leading-snug text-slate-850 tracking-tight text-center">
                  Select your vehicle
                </p>
                {/* Downward triangle pointing to the next step */}
                <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-[0_12px_10px_rgba(0,0,0,0.35)]">
                  <svg width="24" height="13" viewBox="0 0 24 13" fill="none">
                    <path d="M0 0 L12 12 L24 0 Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="w-full relative">
              {/* Heavy Black Blur Box backdrop structure */}
              <div className="absolute inset-x-3 bottom-[-4px] top-3 bg-black/72 rounded-full blur-[9px] pointer-events-none z-0" />
              <div className="relative bg-white rounded-full py-1 px-2 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <div className="bg-[#78CE35] text-white font-[950] text-[40px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                  3
                </div>
                <p className="font-sans font-[800] text-[13.5px] sm:text-[14.5px] leading-snug text-slate-850 tracking-tight text-center">
                  Submit your documents
                </p>
                {/* Downward triangle pointing to the next step */}
                <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-[0_12px_10px_rgba(0,0,0,0.35)]">
                  <svg width="24" height="13" viewBox="0 0 24 13" fill="none">
                    <path d="M0 0 L12 12 L24 0 Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="w-full relative">
              {/* Heavy Black Blur Box backdrop structure */}
              <div className="absolute inset-x-3 bottom-[-4px] top-3 bg-black/72 rounded-full blur-[9px] pointer-events-none z-0" />
              <div className="relative bg-white rounded-full py-1 px-2 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <div className="bg-[#78CE35] text-white font-[950] text-[40px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                  4
                </div>
                <p className="font-sans font-[800] text-[13.5px] sm:text-[14.5px] leading-snug text-slate-850 tracking-tight text-center">
                  Await approval
                </p>
                {/* Downward triangle pointing to the next step */}
                <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-[0_12px_10px_rgba(0,0,0,0.35)]">
                  <svg width="24" height="13" viewBox="0 0 24 13" fill="none">
                    <path d="M0 0 L12 12 L24 0 Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="w-full relative">
              {/* Heavy Black Blur Box backdrop structure */}
              <div className="absolute inset-x-3 bottom-[-4px] top-3 bg-black/72 rounded-full blur-[9px] pointer-events-none z-0" />
              <div className="relative bg-white rounded-full py-1 px-2 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <div className="bg-[#78CE35] text-white font-[950] text-[40px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                  5
                </div>
                <p className="font-sans font-[800] text-[13.5px] sm:text-[14.5px] leading-snug text-slate-850 tracking-tight text-center">
                  Collect and drive
                </p>
              </div>
            </div>

          </div>

          {/* Desktop Layout (Organized into 2 columns on first row, 3 columns on second row with beautiful heavy black blur backdrops) */}
          <div className="hidden md:flex flex-col items-center gap-12 select-none py-8 animate-fade-in">
            
            {/* Row 1 (Steps 1 and 2) */}
            <div className="flex items-center justify-center gap-14 w-full max-w-4xl">
              
              {/* Step 1 */}
              <div className="w-[360px] relative">
                {/* Heavy Black Blur Box backdrop structure */}
                <div className="absolute inset-x-4 bottom-[-4px] top-3 bg-black/75 rounded-full blur-[10px] pointer-events-none z-0" />
                <div className="relative bg-white rounded-full py-3 px-8 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  <div className="bg-[#78CE35] text-white font-[950] text-[20px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                    1
                  </div>
                  <p className="font-sans font-[800] text-[13.5px] lg:text-[14.5px] leading-snug text-slate-850 tracking-tight text-left">
                    Set your budget and browse the vehicles
                  </p>
                  
                  {/* Rightward triangle pointing to Step 2 */}
                  <div className="absolute right-[-11px] top-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-[8px_0_12px_rgba(0,0,0,0.35)]">
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
                      <path d="M0 0 L11 11 L0 22 Z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="w-[360px] relative">
                {/* Heavy Black Blur Box backdrop structure */}
                <div className="absolute inset-x-4 bottom-[-4px] top-3 bg-black/75 rounded-full blur-[10px] pointer-events-none z-0" />
                <div className="relative bg-white rounded-full py-3 px-8 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  <div className="bg-[#78CE35] text-white font-[950] text-[20px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                    2
                  </div>
                  <p className="font-sans font-[800] text-[13.5px] lg:text-[14.5px] leading-snug text-slate-850 tracking-tight text-left">
                    Select your vehicle
                  </p>
                </div>
              </div>

            </div>

            {/* Row 2 (Steps 3, 4, and 5) */}
            <div className="flex items-center justify-center gap-11 w-full max-w-6xl">
              
              {/* Step 3 */}
              <div className="w-[320px] relative">
                {/* Heavy Black Blur Box backdrop structure */}
                <div className="absolute inset-x-4 bottom-[-4px] top-3 bg-black/75 rounded-full blur-[10px] pointer-events-none z-0" />
                <div className="relative bg-white rounded-full py-3 px-6 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  <div className="bg-[#78CE35] text-white font-[950] text-[20px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                    3
                  </div>
                  <p className="font-sans font-[800] text-[13px] lg:text-[14.5px] leading-snug text-slate-850 tracking-tight text-left">
                    Submit your documents
                  </p>
                  
                  {/* Rightward triangle pointing to Step 4 */}
                  <div className="absolute right-[-11px] top-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-[8px_0_12px_rgba(0,0,0,0.35)]">
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
                      <path d="M0 0 L11 11 L0 22 Z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="w-[320px] relative">
                {/* Heavy Black Blur Box backdrop structure */}
                <div className="absolute inset-x-4 bottom-[-4px] top-3 bg-black/75 rounded-full blur-[10px] pointer-events-none z-0" />
                <div className="relative bg-white rounded-full py-3 px-6 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  <div className="bg-[#78CE35] text-white font-[950] text-[20px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                    4
                  </div>
                  <p className="font-sans font-[800] text-[13px] lg:text-[14.5px] leading-snug text-slate-850 tracking-tight text-left">
                    Await approval
                  </p>
                  
                  {/* Rightward triangle pointing to Step 5 */}
                  <div className="absolute right-[-11px] top-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-[8px_0_12px_rgba(0,0,0,0.35)]">
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
                      <path d="M0 0 L11 11 L0 22 Z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="w-[320px] relative">
                {/* Heavy Black Blur Box backdrop structure */}
                <div className="absolute inset-x-4 bottom-[-4px] top-3 bg-black/75 rounded-full blur-[10px] pointer-events-none z-0" />
                <div className="relative bg-white rounded-full py-3 px-6 border border-slate-100 flex items-center justify-start gap-4 transition-all duration-300 hover:scale-[1.025] z-10 shadow-[0_16px_36px_rgba(0,0,0,0.35),_inset_0_-4px_8px_rgba(0,0,0,0.18),_inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  <div className="bg-[#78CE35] text-white font-[950] text-[20px] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_3px_6px_rgba(0,0,0,0.2)] border-[1.5px] border-white">
                    5
                  </div>
                  <p className="font-sans font-[800] text-[13px] lg:text-[14.5px] leading-snug text-slate-850 tracking-tight text-left">
                    Collect and drive
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
  );
}
