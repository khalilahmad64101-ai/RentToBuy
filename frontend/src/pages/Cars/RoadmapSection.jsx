import React from 'react';
import { ShieldCheck, UserCheck, CalendarCheck, FileCheck } from 'lucide-react';

export function RoadmapSection() {
  const processSteps = [
    {
      title: '1. Filter & Choose',
      desc: 'Browse our stock list of low emission hatchbacks, hybrids or family cars and select your model.',
      icon: ShieldCheck
    },
    {
      title: '2. Upload Core ID',
      desc: 'Provide your UK Driving Licence and two recent utility statements directly in our secure database portal.',
      icon: UserCheck
    },
    {
      title: '3. Pay Refundable Deposit',
      desc: 'Once approved, complete your refundable deposit (£150). Servicing and MOT are fully active immediately.',
      icon: CalendarCheck
    },
    {
      title: '4. Drive Toward Ownership',
      desc: 'Pick up your keys in Manchester. Your weekly payments build ongoing contributions to ownership.',
      icon: FileCheck
    }
  ];

  return (
    <section className="bg-slate-50 border border-slate-150 rounded-3xl p-4 sm:p-10 space-y-12 font-sans" id="how-it-works-catalog-preview">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Step-By-Step Roadmap</span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
          How It Works Preview
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
          From registration to the road - simple, stress-free stages towards full vehicle ownership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start relative">
        {processSteps.map((stp, idx) => {
          const StpIcon = stp.icon;
          return (
            <div key={idx} className="space-y-4 relative flex flex-col items-center sm:items-start text-center sm:text-left">
              {idx < 3 && (
                <div className="hidden lg:block absolute top-6 left-16 right-0 h-0.5 border-t-2 border-dashed border-slate-200"></div>
              )}
              
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm relative z-10">
                <StpIcon className="w-5 h-5 text-indigo-650" />
              </div>
              <div className="space-y-1 bg-transparent">
                <h4 className="font-sans font-black text-slate-950 text-sm">
                  {stp.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                  {stp.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
