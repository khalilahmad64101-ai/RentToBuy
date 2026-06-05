import React from 'react';
import { ShieldCheck, Orbit, CreditCard, UserCheck } from 'lucide-react';

export function WhyChooseSection() {
  const perks = [
    {
      title: 'Quality Checked Vehicles',
      desc: 'Every catalog unit undergoes 100-point rigorous mechanical diagnostics before launch inclusion.',
      icon: ShieldCheck
    },
    {
      title: 'Flexible Rent-To-Buy Options',
      desc: 'Predictable terms structured entirely to build your direct visual equity contributions.',
      icon: Orbit
    },
    {
      title: 'Affordable Deposits',
      desc: 'Straightforward, transparent upfront payment tiers without unanticipated administrative surcharges.',
      icon: CreditCard
    },
    {
      title: 'Fast Approval Process',
      desc: 'Submit your license folders online today and obtain underwriting clearance within days.',
      icon: UserCheck
    }
  ];

  return (
    <section className="space-y-12 font-sans" id="why-choose-fleet-parameters">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Quality Assured</span>
        <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-none sm:text-4xl">
          Why Choose Our Vehicles?
        </h2>
        <p className="text-sm text-gray-500 font-sans leading-relaxed">
          We focus heavily on fleet pristine aesthetics and strict logistical standards so you enjoy stress-free motoring.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map((perk, index) => {
          const PerkIcon = perk.icon;
          return (
            <div key={index} className="p-6 bg-white border border-gray-150 rounded-2xl hover:border-indigo-400 group transition-all hover:shadow-lg flex flex-col space-y-4">
              <div className="p-3 bg-slate-50 text-slate-800 group-hover:bg-[#111A2E] group-hover:text-[#CDA275] rounded-xl self-start transition-all duration-300">
                <PerkIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1 bg-transparent">
                <h4 className="font-sans font-black text-sm text-slate-950">
                  {perk.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed font-light">
                  {perk.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
