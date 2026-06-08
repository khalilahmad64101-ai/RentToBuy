import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function HeroSection({
  title = "Drive Your Own Car, Simple & Affordable",
  subtitle = "No credit checks, no hidden fees. We help people with low income, poor credit, or zero credit history start their path to vehicle ownership today.",
  badge = "R2BuyCar Partner Program",
  showCta = true,
  ctaText = "Start Application",
  ctaLink = "/apply"
}) {
  return (
    <section 
      className="relative bg-brand-secondary text-white overflow-hidden py-12 md:py-20 flex items-center min-h-[500px] md:min-h-[540px] border-b border-white/5 font-sans" 
      id="r2buycar-brand-hero"
    >
      {/* Visual Overlay elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary via-brand-secondary/90 to-transparent z-10"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 z-10"></div>
        {/* Radial green ambient glow behind text */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[400px] rounded-full bg-brand-primary/10 pointer-events-none blur-[140px] z-10 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column: Trust, Copy & CTA */}
          <div className="lg:col-span-7 text-left space-y-5">
            {/* Trust badge */}
            {badge && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5 text-brand-primary border border-brand-primary/30 bg-brand-primary/10 font-bold text-[11px] sm:text-xs tracking-wider px-3 py-1 rounded-full uppercase"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                <span>{badge}</span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase"
            >
              Drive Your Path <br className="hidden sm:inline" />
              To <span className="text-brand-primary">Car Ownership</span>
            </motion.h1>

            {/* Trust bullet features container */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300 font-medium"
            >
              <span className="flex items-center gap-1.5 bg-slate-900/30 px-2.5 py-1 rounded-md border border-white/5">
                <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                No Credit History Needed
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/30 px-2.5 py-1 rounded-md border border-white/5">
                <CheckCircle className="w-4 h-4 text-brand-primary shrink-0" />
                Flexible Weekly Payments
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/30 px-2.5 py-1 rounded-md border border-white/5">
                <CheckCircle className="w-4 h-4 text-brand-primary shrink-0" />
                Uber & Personal Drivers
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal"
            >
              {subtitle}
            </motion.p>

            {/* CTA buttons */}
            {showCta && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3.5 pt-2"
              >
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200 cursor-pointer"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
                >
                  <span>{ctaText}</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </Link>
                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Explore Cars
                </Link>
              </motion.div>
            )}
          </div>

          {/* Right Image Column: High Quality Car Rendering */}
          <div className="lg:col-span-5 h-[220px] sm:h-[280px] lg:h-full relative flex items-center justify-center select-none pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000"
                alt="R2BuyCar Modern Hybrid Hatchback Asset"
                referrerPolicy="no-referrer"
                className="max-h-[220px] sm:max-h-[280px] lg:max-h-[360px] object-contain drop-shadow-[0_20px_50px_rgba(124,194,66,0.3)] filter contrast-[1.05]"
              />
              {/* Dynamic decorative backdrop ellipse */}
              <div className="absolute -bottom-4 w-4/5 h-8 bg-black/40 blur-xl rounded-full"></div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
