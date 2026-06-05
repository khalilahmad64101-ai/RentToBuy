import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { TrendingUp, RotateCcw, ThumbsUp, ChevronRight } from 'lucide-react';

export function PerksSection() {
  const customPerks = [
    {
      icon: TrendingUp,
      title: 'Ownership Contribution',
      desc: 'Every weekly payment is structured to build lease contributions towards owning the title of the car.'
    },
    {
      icon: RotateCcw,
      title: 'Zero Repair Stress Policies',
      desc: 'Servicing, major maintenance, MOT, and manufacturer warranty reviews are organized and managed by Rent2Buy Agents.'
    },
    {
      icon: ThumbsUp,
      title: 'Underwriting Harmony',
      desc: 'We review driving licencing, current wage profile, and verify secure, direct banking instead of penalizing historical defaults.'
    }
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none" id="perks-overview">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Block: Content & Modern Feature Cards */}
        <div className="lg:col-span-7 space-y-2">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-100/80">
              Premium Fleet Operations
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-gray-950 tracking-tight leading-none">
              Why Choose Rent2Buy Fleet?
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-sans max-w-2xl">
              Our brokerage is structured to provide flexible terms, absolute underwriting simplicity, and a genuine customer-centered transition into ownership. We carry fully ready stocks with all parameters included.
            </p>
          </div>
          
          {/* Elegant, interactive horizontal features */}
          <div className="space-y-4">
            {customPerks.map((perk, pIdx) => {
              const PerkIcon = perk.icon;
              return (
                <div 
                  key={pIdx}
                  className="group flex gap-4 p-5 bg-white border border-gray-150/80 hover:border-indigo-250 hover:shadow-md rounded-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                  
                  <div className="shrink-0 p-3 bg-slate-50 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl transition-all duration-300">
                    <PerkIcon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  
                  <div className="space-y-1 bg-transparent">
                    <h4 className="font-sans font-black text-sm text-gray-950 group-hover:text-indigo-650 transition-colors">
                      {perk.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      {perk.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Block: High-Contrast Immersive Callout Banner */}
        <div className="lg:col-span-5">
          <div className="relative bg-slate-950 text-white rounded-3xl p-4 sm:p-10 overflow-hidden shadow-xl border border-slate-850 group hover:shadow-2xl transition-all duration-300" id="perks-cta-banner">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-600/35 via-transparent to-transparent"></div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-550/10 rounded-full blur-2xl group-hover:bg-indigo-550/15 transition-colors duration-500"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 tracking-wider uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Immediate Stock Drive
                </div>
                <h3 className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-white leading-tight">
                  Ready to Underwrite Your License?
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
                Get an eligibility decision in minutes. Select a Hatchback, Sedan, or Eco vehicle from stock and complete the simple document review portal.
              </p>

              <div className="pt-2">
                <Link to="/apply" className="block w-full">
                  <Button variant="accent" size="lg" className="w-full font-bold group-hover:shadow-lg group-hover:shadow-indigo-500/10 flex items-center justify-center gap-2 hover:translate-x-0.5 transition-all">
                    Start License Application
                    <ChevronRight className="w-4 h-4 text-indigo-100 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono border-t border-white/5 pt-4">
                <span className="text-indigo-400 font-bold">✓</span> Direct Decision Brokerage
                <span className="text-slate-600">•</span>
                <span>100% Secure Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
