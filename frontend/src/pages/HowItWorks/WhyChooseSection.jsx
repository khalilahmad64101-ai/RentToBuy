import React from 'react';

export function WhyChooseSection({ keyBenefits }) {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-gray-150" id="why-choose-rtb-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
            Why Drivers Choose Rent-To-Buy
          </h2>
          <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
            Unpack the key advantages of our streamlined path to ultimate vehicle ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {keyBenefits.map((benefit, idx) => {
            const IconComp = benefit.icon;
            return (
              <div 
                key={idx}
                className="p-8 bg-slate-50 hover:bg-slate-50/30 rounded-2xl hover:shadow-md border border-slate-100 transition-all duration-300 flex gap-5 items-start text-left"
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold font-sans ${benefit.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
