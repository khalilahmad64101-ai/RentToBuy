import React from 'react';
import { Link } from 'react-router-dom';

export function HeroSection({ 
  scrollToTarget,
  title = "CHOOSE YOUR PREFERABLE DRIVE TODAY",
  subtitle = "Find the perfect rent-to-buy vehicle that fits your lifestyle and budget. Pay predictable weekly contributions with no penalizing credit limits.",
  badge = "Premium Fleet Catalog"
}) {
  return (
    <div 
      className="relative w-full min-h-[500px] lg:h-[680px] bg-cover bg-center flex items-center pt-16 pb-32 md:pb-40 lg:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-2xl"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(8, 14, 28, 0.96) 0%, rgba(12, 22, 44, 0.72) 45%, rgba(15, 23, 42, 0.25) 100%), url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1600')`
      }}
      id="explore-hero-banner"
    >
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none z-0"></div>
      
      {/* Decorative graphic overlay */}
      <div className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-0"></div>

      {/* Two-Column Grid layout: Left-Text layout & Right-Car layout */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left text block: Title, subtitle & two buttons with logo colors (#7CC242, #1F3F7A) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-white/20">
            ⭐ {badge}
          </div>
          
          <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none uppercase">
            Let's find <br />
            <span className="text-[#7CC242]">{title}</span>
          </h1>
          
          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal">
            {subtitle}
          </p>
          
          {/* Button controllers */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                if (scrollToTarget) {
                  scrollToTarget('available-cars-counter-trigger');
                } else {
                  const el = document.getElementById('available-cars-counter-trigger');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#1F3F7A] hover:bg-gray-100 font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 cursor-pointer font-sans shadow-md"
            >
              View Available Cars
            </button>
            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7CC242] hover:bg-[#6bb033] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#7CC242]/20 transition-all duration-200 active:scale-95 cursor-pointer font-sans animate-pulse"
            >
              Start Application
            </Link>
          </div>
        </div>

        {/* Right Image element: stylish premium SUV */}
        <div className="lg:col-span-5 relative flex items-center justify-center select-none mt-8 lg:mt-0">
          <div className="w-full max-w-[450px] lg:max-w-full flex items-center justify-center relative">
          
          </div>
        </div>

      </div>

    </div>
  );
}
