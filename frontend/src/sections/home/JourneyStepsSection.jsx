import React from 'react';

export function JourneyStepsSection() {
  return (
    <section 
      className="w-full relative xl:py-16 my-0 overflow-hidden select-none animate-fade-in flex items-center bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: 'url("public/bg2.png")'
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

        {/* 5-Step Mobile Grid & Desktop Horizontal Layout */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap lg:flex-nowrap justify-center items-center gap-[12px] md:gap-[16px] xl:gap-[25px] w-full px-2 md:px-0">
          
          {/* Step 1 */}
          <div className="bg-white rounded-[22px] md:rounded-[30px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-full aspect-square max-w-[160px] md:w-[150px] md:h-[150px] p-3 md:p-[12px] mx-auto md:mx-0 hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 select-none cursor-default">
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
          <div className="bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-full aspect-square max-w-[160px] md:w-[150px] md:h-[150px] p-3 md:p-[12px] mx-auto md:mx-0 hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 select-none cursor-default">
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
          <div className="bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-full aspect-square max-w-[160px] md:w-[150px] md:h-[150px] p-3 md:p-[12px] mx-auto md:mx-0 hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 select-none cursor-default">
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
          <div className="bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-full aspect-square max-w-[160px] md:w-[150px] md:h-[150px] p-3 md:p-[12px] mx-auto md:mx-0 hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 select-none cursor-default">
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

          {/* Step 5 - Spans 2 columns on mobile to be centered beautifully */}
          <div className="col-span-2 md:col-span-1 bg-white rounded-[22px] border border-[#EAEAEA] shadow-[0_8px_18px_rgba(0,0,0,0.18)] flex items-center justify-center text-center w-full max-w-[160px] md:max-w-none aspect-[21/10] md:aspect-square md:w-[150px] md:h-[150px] p-3 md:p-[12px] mx-auto md:mx-0 hover:-translate-y-[5px] transition-all duration-300 ease-in-out shrink-0 select-none cursor-default">
            <span className="font-sans font-semibold text-[11px] md:text-[18px] text-[#222222] leading-[1.3] text-center">
              Collect and drive
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
