import React from 'react';
import { motion } from 'motion/react';

export function HeroSection({ onStartClick }) {
  return (
    <section 
      className="relative w-full min-h-[500px] lg:h-[680px] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden border-b-4 border-gray-400 select-none text-left animate-fade-in"
      style={{
        background: 'linear-gradient(to bottom, #B8DC82, #619921, #BFDF8C)'
      }}
      id="how-works-hero"
    >
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none z-0"></div>

      {/* Clean 2-column flex layout optimized specifically for How It Works */}
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        
        <div className="w-full lg:w-[50%] text-center lg:text-left space-y-6 z-10 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 bg-black/10 text-black text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-black/10">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
            How Rent-To-Buy Works
          </div>
          
          <h1 className="font-sans font-[900] text-3xl sm:text-5xl lg:text-6xl text-black tracking-[-0.05em] leading-[0.95] uppercase">
            Your Simple Path To <br />
            <span className="text-black">Vehicle Ownership</span>
          </h1>
          
          <p className="text-black/85 text-xs sm:text-sm md:text-base leading-relaxed font-bold">
            From selecting a vehicle to collecting the keys, our straightforward Rent-To-Buy process helps drivers get on the road quickly and confidently.
          </p>

          <div className="pt-2 flex justify-center lg:justify-start">
            <button 
              onClick={onStartClick}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white hover:bg-zinc-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 cursor-pointer font-sans shadow-md"
            >
              Start Your Journey
            </button>
          </div>
        </div>

        {/* Clean right column image layout customized specifically for How It Works */}
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.15 }}
          className="w-full lg:w-[50%] flex justify-center items-center select-none z-10 pointer-events-none mt-4 lg:mt-0"
        >
          <img
            src="https://r2-buy-car.vercel.app/hero-car1.png"
            alt="How Rent-To-Buy Works Car Asset"
            referrerPolicy="no-referrer"
            className="w-full max-h-[220px] sm:max-h-[280px] lg:max-h-[350px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] pointer-events-auto transform transition-transform duration-500 hover:scale-[1.03]"
          />
        </motion.div>

      </div>
    </section>
  );
}
