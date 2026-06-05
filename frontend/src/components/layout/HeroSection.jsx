import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function HeroSection({
  title = "DRIVE YOUR LUXURY FUTURE TODAY",
  subtitle = "EASY PREMIUM VEHICLE OWNERSHIP PATHWAY",
  badge = "Future At Hand",
  showCta = true,
  ctaText = "Explore Now",
  ctaLink = "/cars"
}) {
  return (
    <section 
      className="relative bg-[#080B12] text-white overflow-hidden py-24 sm:py-28 lg:py-32 border-b border-gray-950 font-sans" 
      id="premium-fluid-hero"
    >
      {/* 1. VIP LUXURY AUTOMOTIVE BACKGROUND IMAGE AND RADIANT OVERLAYS */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000"
          alt="Premium luxury custom rent-to-own vehicle"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-100 opacity-[0.22] md:opacity-25 select-none pointer-events-none"
        />
        {/* Deep, smooth radial vignette background filter layout for rich visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B12]/95 via-[#080B12]/80 to-[#080B12] z-10"></div>
        {/* Subtle high-tech grid layer overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b16_1px,transparent_1px),linear-gradient(to_bottom,#1e293b16_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 z-10"></div>
        {/* Dynamic golden radial bloom behind center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#CDA275]/5 pointer-events-none blur-[120px] z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-5 max-w-3xl mx-auto">
          {/* Top Badge matching contact/secondary style exactly */}
          {badge && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block text-[#CDA275] border border-[#CDA275]/20 bg-[#CDA275]/5 font-black text-[10.5px] tracking-[0.2em] px-4 py-1.5 rounded-md uppercase font-mono"
            >
              {badge}
            </motion.div>
          )}

          {/* Main Title Heading matching contact/about text layout & classes exactly */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none uppercase"
          >
            {title}
          </motion.h1>

          {/* Subheading matching contact style exactly */}
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Action Buttons matching contact page format with matching cta options */}
          {showCta && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#CDA275] hover:bg-[#b88f63] text-[#080B12] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 duration-200"
                id="explore-pill-cta"
              >
                <span>{ctaText}</span>
                <ChevronRight className="w-4 h-4 text-[#080B12]" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-black text-xs uppercase tracking-wider rounded-xl transition-transform hover:-translate-y-0.5 duration-200"
              >
                Learn More
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
