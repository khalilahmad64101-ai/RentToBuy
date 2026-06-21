import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="bg-white py-16 sm:py-24" id="ready-get-started-cta-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="bg-[#111A2E] text-white rounded-3xl p-8 sm:p-16 relative overflow-hidden text-center space-y-8 shadow-xl">
          {/* Subtle decor grid matching Track Ride support style */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-black text-[#7CC242] uppercase tracking-widest bg-white/5 px-3.5 py-1.5 rounded-md border border-white/5 inline-block">
              Start Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-white uppercase leading-tight">
              Ready To Find Your Next Vehicle?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Use our affordability meter, browse available vehicles, and start your application today.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
            <Link to="/cars" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#7CC242] hover:bg-[#6bb033] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">
                Browse Vehicles
              </button>
            </Link>
            
            <Link to="/apply" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-98 transition-all duration-150">
                Start Application
                <ArrowRight className="w-4 h-4 text-[#7CC242]" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
