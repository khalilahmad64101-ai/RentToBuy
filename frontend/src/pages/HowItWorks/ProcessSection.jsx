import React from 'react';

export function ProcessSection({
  processSteps,
  activeStep,
  setActiveStep
}) {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-gray-150" id="six-step-timeline-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
            Simple 6-Step Process
          </h2>
          <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
            Step-by-step from budget determination to vehicle collection keys handoff.
          </p>
        </div>

        {/* Interactive controls simulation to explore active steps */}
        <div className="bg-slate-50/70 max-w-4xl mx-auto p-4 rounded-2xl border border-slate-100 mb-12 flex flex-wrap items-center gap-2 justify-center">
          <span className="text-[10px] font-black uppercase text-slate-405 tracking-wider mr-2">Highlight Step:</span>
          {processSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeStep === idx 
                  ? 'bg-[#1F3F7A] text-white shadow-xs' 
                  : 'bg-white hover:bg-slate-100 text-[#1F3F7A] border border-gray-200'
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>

        {/* Premium Timeline Design Flow */}
        <div className="relative max-w-6xl mx-auto mt-12 pb-8">
          
          {/* Horizontal timeline connect line for Desktop/Lg Screens */}
          <div className="absolute top-[35px] left-12 right-12 h-1 bg-slate-150 hidden lg:block z-0">
            <div 
              className="h-full bg-gradient-to-r from-[#7CC242] to-[#1F3F7A] transition-all duration-500"
              style={{ width: `${(activeStep / (processSteps.length - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {processSteps.map((st, idx) => {
              const StepIcon = st.icon;
              const isPassed = idx < activeStep;
              const isCurrent = idx === activeStep;
              const isUpcoming = idx > activeStep;

              return (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className="flex flex-col items-center group cursor-pointer transition-all duration-300"
                >
                  {/* Circle Step Number Frame */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-[#7CC242] text-white shadow-lg shadow-[#7CC242]/30 scale-110 ring-4 ring-[#7CC242]/20' 
                      : isPassed 
                      ? 'bg-[#1F3F7A] text-white' 
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                    <StepIcon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div className="mt-5 text-center px-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 ${
                      isCurrent ? 'text-[#7CC242]' : 'text-slate-400'
                    }`}>
                      {st.step}
                    </span>
                    <h4 className="font-sans font-black text-xs text-[#1F3F7A] tracking-tight uppercase min-h-[36px] flex items-center justify-center">
                      {st.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-2 max-w-[170px] mx-auto">
                      {st.desc}
                    </p>
                  </div>

                  {/* Mobile Down Arrow indicator */}
                  {idx < processSteps.length - 1 && (
                    <div className="my-4 block lg:hidden font-black text-[#7CC242] animate-bounce">
                      ⬇
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
