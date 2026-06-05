import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';

export function FinalCtaSection() {
  return (
    <section className="relative bg-slate-950 text-white rounded-3xl p-4 sm:p-12 overflow-hidden shadow-xl border border-slate-850 group hover:shadow-2xl transition-all duration-300" id="explore-final-cta">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#CDA275]/15 via-transparent to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider text-[#CDA275] animate-pulse">
          <Sparkles className="w-3 h-3 text-[#CDA275]" />
          Instant Eligibility Underwriting
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-white leading-tight">
          Ready to Rent & Buy of Your Choice?
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans font-light">
          Take the first step towards auto independence. Choose from our pristine, fully insured fleet of vehicles. Log in to upload your driving documents today.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/apply" className="block w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-indigo-650 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-650/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer">
              Apply online
              <ChevronRight className="w-4 h-4 text-indigo-100 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link to="/contact" className="block w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-98 cursor-pointer">
              Contact support
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
