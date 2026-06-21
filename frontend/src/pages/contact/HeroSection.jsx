import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageSquare } from 'lucide-react';

export function HeroSection({ onSendMessageClick }) {
  return (
    <section 
      className="relative w-full min-h-[500px] lg:h-[680px] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden border-b-4 border-gray-400 select-none text-left animate-fade-in"
      style={{
        background: 'linear-gradient(to bottom, #B8DC82, #619921, #BFDF8C)'
      }}
      id="contact-hero"
    >
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none z-0"></div>

      {/* Clean 2-column flex layout optimized specifically for Contact */}
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        
        {/* Left text block: Title, subtitle & custom badges with high contrast */}
        <div className="w-full lg:w-[50%] text-center lg:text-left space-y-6 z-10 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 bg-black/10 text-black text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-black/10">
            ⭐ GET IN TOUCH
          </div>
          
          <h1 className="font-sans font-[900] text-3xl sm:text-[2.75rem] lg:text-6xl text-black leading-[0.95] tracking-[-0.05em] uppercase">
            Contact <br />
            <span className="text-black">R2Buy Solutions</span>
          </h1>
          
          <p className="text-black/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-bold">
            Have questions about our vehicles, applications, or rent-to-buy process? Our team is ready to assist you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
            <a
              href="phone:01613689635"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white hover:bg-zinc-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 cursor-pointer font-sans shadow-md"
            >
              <Phone className="w-4 h-4 text-white" />
              Call Us
            </a>
            <button
              onClick={onSendMessageClick}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1F3F7A] text-white hover:bg-[#152e5c] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-150 active:scale-95 cursor-pointer font-sans"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              Send Message
            </button>
          </div>
        </div>

        {/* Clean right column image layout customized specifically for Contact */}
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.15 }}
          className="w-full lg:w-[50%] flex justify-center items-center select-none z-10 pointer-events-none mt-4 lg:mt-0"
        >
          <img
            src="https://r2-buy-car.vercel.app/hero-car1.png"
            alt="Contact R2BuyCar Representative Fleet"
            referrerPolicy="no-referrer"
            className="w-full max-h-[220px] sm:max-h-[280px] lg:max-h-[350px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] pointer-events-auto transform transition-transform duration-500 hover:scale-[1.03]"
          />
        </motion.div>

      </div>
    </section>
  );
}
