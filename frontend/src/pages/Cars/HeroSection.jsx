import React from 'react';
import { Link } from 'react-router-dom';

export function HeroSection({ 
  scrollToTarget,
  title = "Explore Our Available Vehicles",
  subtitle = "Find the perfect rent-to-buy vehicle that fits your lifestyle and budget. Pay predictable weekly contributions with no penalizing credit limits.",
  badge = "Premium Fleet Brokerage"
}) {
  return (
    <section className="relative h-auto py-20 bg-slate-950 text-white flex items-center overflow-hidden" id="explore-hero-banner">
      {/* Background premium car image with dark graphic overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600" 
          alt="Luxurious sedan dark tail lights" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0e1726] via-[#0f172a]/90 to-slate-950/95"></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 bg-white/5 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border border-white/10">
          🔒 {badge}
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-6xl tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent uppercase">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => scrollToTarget('available-cars-counter-trigger')}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-98 cursor-pointer"
          >
            View Available Cars
          </button>
          <Link to="/apply" className="w-full sm:w-auto font-sans">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-98 cursor-pointer">
              Start Application
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
