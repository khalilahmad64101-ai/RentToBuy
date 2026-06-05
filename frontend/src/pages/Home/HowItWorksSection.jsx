import React from 'react';
import { Key, UserCheck, Calendar } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: Key,
      title: '1. Select Your Vehicle',
      description: 'Explore our fleet of pristine city hatchbacks, family diesel models, and eco hybrids, ready and licensed.'
    },
    {
      icon: UserCheck,
      title: '2. Underwriting Check',
      description: 'Submit your driving licence and proof of address. No complex or penalizing credit scoring barriers!'
    },
    {
      icon: Calendar,
      title: '3. Weekly Drive & Buy',
      description: 'Drive away with servicing and insurance cover covered on simple weekly lease payments towards buying.'
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 overflow-hidden" id="mechanics-how">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-100/80">
            Direct Route to Ownership
          </div>
          <h2 className="font-sans font-black text-4xl text-gray-950 tracking-tight sm:text-5xl">
            How Rent-to-Buy Works
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We make vehicle ownership stress-free and immediate. Our three steps bypass major bank financing limits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-dashed bg-gray-200 -translate-y-12 z-0"></div>

          {steps.map((st, index) => {
            const IconComp = st.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white p-4 sm:p-8 rounded-2xl border border-gray-150/80 hover:border-indigo-200 flex flex-col items-start text-left space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-350 z-10" 
                id={`step-${index}`}
              >
                <span className="absolute top-4 right-6 text-7xl font-sans font-black text-slate-100 group-hover:text-indigo-550/70 select-none transition-colors duration-300 leading-none">
                  0{index + 1}
                </span>

                <div className="p-4 bg-slate-50 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all duration-300 shadow-sm shadow-slate-100 group-hover:shadow-lg group-hover:shadow-indigo-600/20">
                  <IconComp className="w-7 h-7 stroke-[1.5] transition-transform duration-300 group-hover:rotate-6" />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-indigo-600 block tracking-wider uppercase">Stage {index + 1}</span>
                  <h3 className="font-sans font-black text-lg text-gray-950 tracking-tight group-hover:text-indigo-650 transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    {st.description}
                  </p>
                </div>
                
                <div className="w-8 h-1 bg-gray-100 group-hover:w-full group-hover:bg-indigo-600 rounded-full transition-all duration-350"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
