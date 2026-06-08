import React from 'react';
import { Bluetooth, Gauge, Target, Fuel, Wind, Coins } from 'lucide-react';

export function FeaturesSection() {
  const customFeatures = [
    { title: 'Bluetooth Connectivity', icon: Bluetooth, desc: 'Seamless hands-free audio streaming' },
    { title: 'Cruise Control', icon: Gauge, desc: 'Stress-free highway commuting' },
    { title: 'Parking Sensors', icon: Target, desc: 'Effortless tight maneuvering guide' },
    { title: 'Fuel Efficient Vehicles', icon: Fuel, desc: 'Eco-hybrids and low running cost' },
    { title: 'Climate Control', icon: Wind, desc: 'Perfect digital temperature adjustment' },
    { title: 'Low Running Costs', icon: Coins, desc: 'Direct savings on long-term vehicle usage' }
  ];

  return (
    <section className="bg-slate-950 mx-auto px-4 sm:px-6 lg:px-4 py-16 font-sans rounded-3xl" id="home-vehicle-features">
      <div className="text-white p-2 sm:p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block font-mono">Premium Conveniences</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
            High-Spec Vehicle Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed font-light">
            Our Rent-To-Buy fleet comes preloaded with high-specification comfort options to secure your daily driving ease.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {customFeatures.map((feat, index) => {
            const IconComp = feat.icon;
            return (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center space-y-3 hover:border-brand-primary hover:bg-white/10 transition-all duration-300">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <IconComp className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="space-y-1 bg-transparent">
                  <span className="text-xs font-sans font-black leading-tight block text-white">{feat.title}</span>
                  <span className="text-[9px] text-slate-400 font-sans leading-normal block">{feat.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
