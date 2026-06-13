import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Car, 
  Search, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  Key, 
  MapPin, 
  User, 
  ShieldCheck, 
  Calendar,
  CheckCircle, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  UserCheck, 
  CreditCard, 
  BadgePercent,
  TrendingUp,
  Gauge,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function HowItWorks() {
  useSEO({
    title: 'How It Works | No Credit Barrier Rent-to-Buy Steps | R2BuyCar',
    description: 'Understand the clear, step-by-step pathway from flexible car renting to full vehicle ownership. No strict bank score thresholds, no application feed burdens, plus complete road servicing covered.',
    keywords: 'how rent to buy works, hire purchase car, bad credit car lease UK, buycarz roadmap, R2BuyCar guide'
  });

  // Interactive timeline preview active step state (indexes 0 to 5)
  const [activeStep, setActiveStep] = useState(0);

  // SECTION 1 - The 6 Steps Dataset
  const processSteps = [
    {
      step: 'Step 1',
      title: 'Choose Your Budget',
      desc: 'Determine your realistic weekly contribution rate with our smart affordability features.',
      icon: DollarSign,
    },
    {
      step: 'Step 2',
      title: 'Browse Matching Vehicles',
      desc: 'Explore available fuel-efficient, high-spec hybrid and electric cars that fit your budget.',
      icon: Search,
    },
    {
      step: 'Step 3',
      title: 'Select Your Vehicle',
      desc: 'Pick your perfect vehicle and lock in pricing, features, and key specifications.',
      icon: Car,
    },
    {
      step: 'Step 4',
      title: 'Complete Your Application',
      desc: 'Submit your fast, secure digital application online to get fast response underwriting.',
      icon: FileText,
    },
    {
      step: 'Step 5',
      title: 'Upload Required Documents',
      desc: 'Securely upload clear digital copies of your DVLA driving license and basic identification documents.',
      icon: UploadCloud,
    },
    {
      step: 'Step 6',
      title: 'Get Approved & Collect Your Vehicle',
      desc: 'Sign your digital agreement, finalise your starter deposit, and collect your keys.',
      icon: Key,
    }
  ];

  // SECTION 2 - Required Documents Dataset
  const requiredDocs = [
    {
      title: 'Driving Licence Front',
      desc: 'A clear scan or color photo of the front of your valid photocard DVLA driving licence showing your name and photograph clearly.',
      icon: UserCheck
    },
    {
      title: 'Driving Licence Back',
      desc: 'A clear photo of the back of your DVLA driving licence card to check category approvals, restrictions, and expiry dates.',
      icon: FileText
    },
    {
      title: 'Selfie Verification Photo',
      desc: 'A quick digital selfie confirming your live face matches the valid photocard identification provided.',
      icon: User
    },
    {
      title: 'Proof of Address (if required)',
      desc: 'Utility bills (water, council tax, or electricity) or standard bank statements issued within the past 90 days.',
      icon: MapPin
    }
  ];

  // SECTION 3 - Why Choose Us Dataset
  const keyBenefits = [
    {
      title: 'No Large Upfront Cost',
      desc: 'Bypass hefty high-street hire purchase down payments. Pay a minimal initial deposit to secure your vehicle.',
      icon: DollarSign,
      color: 'bg-[#7CC242]/10 text-[#7CC242]'
    },
    {
      title: 'Flexible Weekly Payments',
      desc: 'Enjoy manageable, predictable weekly contributions directly debited and aligned with your driving schedule.',
      icon: Calendar,
      color: 'bg-indigo-50 text-[#1F3F7A]'
    },
    {
      title: 'Build Towards Ownership',
      desc: 'A structured, interest-free portion of every payment translates into real equity ownership over time.',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Suitable For Drivers With Limited Credit History',
      desc: 'We look at your current income stability, driving status, and identification — not past credit score metrics.',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-600'
    },
    {
      title: 'Road-Ready Vehicles',
      desc: 'Every vehicle is fully inspected, serviced, detailed, and thoroughly roadtested before handover.',
      icon: Gauge,
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Fast Application Process',
      desc: 'Our administrative pipeline ensures verification and underwriting review results within 48 hours.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-16 font-sans antialiased" id="how-it-works-page">
      
      {/* 1. HERO SECTION (SAME STYLE AS HOME HERO) */}
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
                onClick={() => {
                  const scrollDestination = document.getElementById('six-step-timeline-section');
                  if (scrollDestination) scrollDestination.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white hover:bg-zinc-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 cursor-pointer font-sans shadow-md"
              >
                Start Your Journey
              </button>
            </div>
          </div>

          {/* Clean right column image layout customized specifically for How It Works, in-bound and scaled nicely */}
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
              className="w-full max-h-[220px] sm:max-h-[280px] lg:max-h-[350px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] pointer-events-auto transform transition-transform duration-500 xl:scale-120"
            />
          </motion.div>

        </div>
      </section>

      {/* SECTION 1 – HOW THE PROCESS WORKS */}
      <section className="bg-white py-16 sm:py-24 border-b border-gray-150" id="six-step-timeline-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Simple 6-Step Process
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-400">
              Step-by-step from budget determination to vehicle collection keys handoff.
            </p>
          </div>

          {/* Interactive controls simulation to explore active steps */}
          <div className="bg-slate-50/70 max-w-4xl mx-auto p-4 rounded-2xl border border-slate-100 mb-12 flex flex-wrap items-center gap-2 justify-center">
            <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider mr-2">Highlight Step:</span>
            {processSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-[#1F3F7A] text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-[#1F3F7A] border border-gray-200'
                }`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>

          {/* Premium Timeline Design Flow */}
          <div className="relative max-w-6xl mx-auto mt-12 pb-8">
            
            {/* Horizontal timeline connect line for Desktop/Lg Screens */}
            <div className="absolute top-[35px] left-12 right-12 h-1 bg-slate-150 hidden lg:block z-0">
              <div 
                className="h-full bg-gradient-to-r from-[#7CC242] to-[#1F3F7A] transition-all duration-500"
                style={{ width: `${(activeStep / (processSteps.length - 1)) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
              {processSteps.map((st, idx) => {
                const StepIcon = st.icon;
                const isPassed = idx < activeStep;
                const isCurrent = idx === activeStep;
                const isUpcoming = idx > activeStep;

                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center group cursor-pointer transition-all duration-300"
                  >
                    {/* Circle Step Number Frame */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-[#7CC242] text-white shadow-lg shadow-[#7CC242]/30 scale-110 ring-4 ring-[#7CC242]/20' 
                        : isPassed 
                        ? 'bg-[#1F3F7A] text-white' 
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}>
                      <StepIcon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <div className="mt-5 text-center px-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 ${
                        isCurrent ? 'text-[#7CC242]' : 'text-slate-400'
                      }`}>
                        {st.step}
                      </span>
                      <h4 className="font-sans font-black text-xs text-[#1F3F7A] tracking-tight uppercase min-h-[36px] flex items-center justify-center">
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-2 max-w-[170px] mx-auto">
                        {st.desc}
                      </p>
                    </div>

                    {/* Mobile Down Arrow indicator */}
                    {idx < processSteps.length - 1 && (
                      <div className="my-4 block lg:hidden font-black text-[#7CC242] animate-bounce">
                        ⬇
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2 – REQUIRED DOCUMENTS */}
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-gray-150" id="required-documents-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Documents You'll Need
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-450">
              Prepare these standard items beforehand for an instant underwriting turn-around.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requiredDocs.map((doc, idx) => {
              const DocIcon = doc.icon;
              return (
                <div 
                  key={idx}
                  className="flex flex-col p-8 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-100 text-left"
                >
                  <div className="w-12 h-12 bg-[#7CC242]/10 text-[#7CC242] rounded-xl flex items-center justify-center mb-6 font-bold">
                    <DocIcon className="w-6 h-6 stroke-[2]" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-black text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight flex items-center gap-1.5">
                        <span className="text-[#7CC242] font-black font-mono">✓</span> {doc.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3 – WHY CHOOSE RENT-TO-BUY */}
      <section className="bg-white py-16 sm:py-24 border-b border-gray-150" id="why-choose-rtb-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Why Drivers Choose Rent-To-Buy
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-400">
              Unpack the key advantages of our streamlined path to ultimate vehicle ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyBenefits.map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 bg-slate-50 hover:bg-slate-50/30 rounded-2xl hover:shadow-md border border-slate-100 transition-all duration-300 flex gap-5 items-start text-left"
                >
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold font-sans ${benefit.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4 – READY TO GET STARTED */}
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

    </div>
  );
}
