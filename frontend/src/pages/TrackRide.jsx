import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { mapFriendlyFeedback } from '../utils/feedbackHelper.js';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  ArrowRight, 
  FileCheck2, 
  HelpCircle, 
  Phone, 
  Mail, 
  Clock, 
  Bell, 
  ShieldAlert,
  Car,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  Upload,
  Calendar,
  Key,
  Check,
  ThumbsUp,
  ShieldCheck,
  ListTodo
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function TrackRide() {
  useSEO({
    title: 'Lease Tracker | Track Rent-to-Buy Step Progress | R2BuyCar',
    description: 'Track your rent-to-buy lease application status in real-time. Check references verification, underwriting checkpoints, and final pre-approval step lists.',
    keywords: 'track car agreement, lease progress checker, Rent-to-Buy verification logs, buycarz pipeline'
  });

  const { user, driverData } = useAuth();
  
  // Tracking state variables
  const [appNumber, setAppNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Active step index state for the redesigned 7-step timeline (0 to 6)
  const [activeStep, setActiveStep] = useState(3); // Defaults to index 3 ("Approved") for preview
  const [actionFeedback, setActionFeedback] = useState('');
  
  // Custom interactive FAQ index in support section
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Pre-configured simulated database for testing statuses instantly
  const simulatedApps = {
    'RTB-7729': {
      vehicle: 'Toyota Prius Hybrid',
      monthly: '£220',
      deposit: '£800',
      status: 'Approved',
      stepIndex: 3, 
    },
    'RTB-8291': {
      vehicle: 'Toyota Aqua',
      monthly: '£250',
      deposit: '£1000',
      status: 'Under Review',
      stepIndex: 2, 
    },
    'RTB-1004': {
      vehicle: 'Tesla Model 3',
      monthly: '£450',
      deposit: '£1500',
      status: 'Vehicle Ready',
      stepIndex: 5,
    }
  };

  // Sync state if user logs in
  useEffect(() => {
    if (user?.email) {
      setEmailAddress(user.email);
      const defaultApp = driverData?.applications?.[0];
      if (defaultApp) {
        setAppNumber(defaultApp.id);
        
        let licenseStatus = "Pending Verification";
        if (defaultApp.step >= 3 || defaultApp.status === "Approved" || defaultApp.status === "Awaiting Payment") {
          licenseStatus = "Approved / Validated";
        } else if (defaultApp.step === 2) {
          licenseStatus = "In Progress / Scanning";
        } else if (defaultApp.status === "Action Required") {
          licenseStatus = "Action Required / Re-upload Needed";
        } else if (defaultApp.status === "Rejected") {
          licenseStatus = "Declined";
        }

        let customStepIndex = Number(defaultApp.step) - 1;
        if (isNaN(customStepIndex) || customStepIndex < 0 || customStepIndex > 7) {
          customStepIndex = defaultApp.status === 'Approved' ? 3 : 2;
        }

        setSearchResult({
          id: defaultApp.id,
          vehicle: defaultApp.carName,
          status: defaultApp.status,
          licenseStatus: licenseStatus,
          dateApplied: defaultApp.dateApplied,
          stepIndex: customStepIndex,
        });
        setActiveStep(customStepIndex);
      }
    }
  }, [user, driverData]);

  // Real-time auto-updating tracking loop without page reload (realtime_guidelines compliant)
  useEffect(() => {
    if (!searchResult?.id || !emailAddress) return;
    if (['RTB-7729', 'RTB-8291', 'RTB-1004'].includes(searchResult.id)) return;

    const intervalId = setInterval(async () => {
      try {
        const data = await api.applications.track(searchResult.id.trim(), emailAddress.trim());
        let customStepIndex = Number(data.step) - 1;
        if (isNaN(customStepIndex) || customStepIndex < 0 || customStepIndex > 7) {
          customStepIndex = data.status === 'Approved' ? 3 : 2;
        }

        setSearchResult(prev => {
          if (!prev) return null;
          if (prev.status === data.status && prev.stepIndex === customStepIndex) {
            return prev;
          }
          return {
            ...prev,
            status: data.status,
            licenseStatus: data.licenseStatus || prev.licenseStatus,
            stepIndex: customStepIndex,
          };
        });
        setActiveStep(customStepIndex);
      } catch (err) {
        console.warn('Real-time tracking poll fallback info: ', err.message);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [searchResult?.id, emailAddress]);

  // Handle manual tracking lookup
  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!appNumber.trim()) {
      setSearchError('Please enter a valid Application ID.');
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setSearchError('Please enter a valid email address.');
      return;
    }

    setSearchError('');
    setIsSearching(true);
    setSearchResult(null);

    try {
      const data = await api.applications.track(appNumber.trim(), emailAddress.trim());
      
      let customStepIndex = Number(data.step) - 1;
      if (isNaN(customStepIndex) || customStepIndex < 0 || customStepIndex > 7) {
        customStepIndex = data.status === 'Approved' ? 3 : 2;
      }

      setSearchResult({
        id: data.id,
        vehicle: data.carName,
        status: data.status,
        licenseStatus: data.licenseStatus,
        dateApplied: data.dateApplied,
        stepIndex: customStepIndex,
      });

      setActiveStep(customStepIndex);
      setIsSearching(false);

      // Auto scroll to connection journey
      setTimeout(() => {
        const elem = document.getElementById('tracking-timeline-section');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err) {
      console.error('[Track Submit Error]:', err);
      setSearchError(mapFriendlyFeedback(err));
      setIsSearching(false);
    }
  };

  // Timeline Step Configurations (The 8 professional workflow stages)
  const timelineSteps = [
    { label: 'Documents Uploaded', desc: 'Securely compile & upload employer files & ID.', icon: Upload },
    { label: 'Application Submitted', desc: 'Dossier successfully received for active underwriting queue.', icon: FileText },
    { label: 'Application Under Review', desc: 'Compliance audit & Soft Credit checking ongoing.', icon: Clock },
    { label: 'Approved', desc: 'Approval authorized! Lease logistics compiled.', icon: CheckCircle2 },
    { label: 'Deposit Paid', desc: 'Refundable booking deposit downpayment cleared.', icon: DollarSign },
    { label: 'Insurance Uploaded', desc: 'Automated motor cover certificate linked & logged.', icon: ShieldCheck },
    { label: 'Vehicle Ready', desc: 'Vehicle inspections completed & fleet prepped.', icon: Car },
    { label: 'Collection Scheduled', desc: 'Active handover scheduled and key delivery finalized.', icon: Key }
  ];

  return (
    <div className="bg-white min-h-screen pb-16 font-sans antialiased" id="track-ride-page-root">
      
      {/* 1. HERO SECTION REDESIGN */}
      <section 
        className="relative w-full py-8 pt-20 sm:py-16 lg:py-0 min-h-[380px] lg:min-h-[500px] lg:h-[680px] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden border-b-4 border-gray-400 select-none text-left animate-fade-in"
        style={{
          background: 'linear-gradient(to bottom, #B8DC82, #619921, #BFDF8C)'
        }}
        id="track-journey-hero"
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none z-0"></div>

        {/* Clean 2-column flex layout optimized specifically for Track Ride */}
        <div className="w-full max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
          
          <div className="w-full lg:w-[50%] text-center lg:text-left space-y-4 lg:space-y-6 z-10 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 bg-black/10 text-black text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-black/10">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black animate-pulse"></span>
              Track Your Application
            </div>
            
            <h1 className="font-sans font-[900] text-2xl sm:text-5xl lg:text-6xl text-black tracking-[-0.05em] leading-[0.95] uppercase">
              Monitor Your Vehicle <br />
              <span className="text-black">Application Progress</span>
            </h1>
            
            <p className="text-black/85 text-[11px] sm:text-sm md:text-base leading-relaxed max-w-xl font-bold">
              Stay updated with every stage of your Rent-To-Buy application, from submission to approval and vehicle collection.
            </p>

            <div className="pt-1 sm:pt-2 flex justify-center lg:justify-start">
              <button 
                onClick={() => {
                  const searchForm = document.getElementById('tracking-timeline-section');
                  if (searchForm) searchForm.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 bg-black text-white hover:bg-zinc-900 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 cursor-pointer font-sans shadow-md"
              >
                Track Now
              </button>
            </div>
          </div>

          {/* Clean right column image layout customized specifically for Track Ride, in-bound and scaled nicely */}
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.15 }}
            className="w-full lg:w-[50%] flex justify-center items-center select-none z-10 pointer-events-none mt-2 lg:mt-0"
          >
            <img
              src="https://r2-buy-car.vercel.app/hero-car1.png"
              alt="Track Ride Program Fleet"
              referrerPolicy="no-referrer"
              className="w-full max-h-[140px] sm:max-h-[220px] lg:max-h-[350px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] pointer-events-auto transform transition-transform duration-500 hover:scale-[1.03]"
            />
          </motion.div>

        </div>
      </section>

      {/* 2. SECTION 1 – APPLICATION JOURNEY */}
      <section className="bg-white py-8 sm:py-24 border-b border-gray-150" id="tracking-timeline-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
            <h2 className="font-sans font-black text-xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Track Every Step
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-3 sm:my-4 rounded-full"></div>
            <p className="text-[11px] sm:text-sm text-slate-550 font-bold uppercase tracking-wider text-slate-400">
              Your real-time progress update from initial sign-up to ignition.
            </p>
          </div>

          {/* User Sleek Search Row integrated natively without heavy box borders */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-16 bg-slate-50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-xs" id="track-lookup-form-container">
            <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
              <div className="md:col-span-5 text-left">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase text-[#1F3F7A] tracking-wider mb-1.5 sm:mb-2">
                  Application ID / Reference
                </label>
                <input 
                  type="text"
                  required
                  value={appNumber}
                  onChange={(e) => setAppNumber(e.target.value)}
                  placeholder="e.g. RTB-7729"
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1F3F7A] placeholder-slate-400 focus:ring-2 focus:ring-[#7CC242]/20 focus:border-[#7CC242] transition-all outline-none"
                />
              </div>
              <div className="md:col-span-5 text-left">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase text-[#1F3F7A] tracking-wider mb-1.5 sm:mb-2">
                  Associated Email Address
                </label>
                <input 
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="e.g. driver@rental.co.uk"
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1F3F7A] placeholder-slate-400 focus:ring-2 focus:ring-[#7CC242]/20 focus:border-[#7CC242] transition-all outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-[#1F3F7A] hover:bg-[#152e5c] text-white font-extrabold text-[#11px] uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-[#1F3F7A]/10"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Search</span>
                      <Search className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
            {searchError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {searchError}
              </div>
            )}
            {searchResult && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white border border-gray-200 shadow-md rounded-2xl animate-fade-in text-left space-y-4" id="track-results-overlay">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Application Reference</span>
                    <h3 className="text-base sm:text-lg font-black text-[#1F3F7A] font-mono leading-none mt-1">{searchResult.id || 'N/A'}</h3>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <Check className="w-3 h-3 mr-1" /> Dynamic DB Match
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Approved car make and model */}
                  <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl space-y-0.5">
                    <span className="block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Vehicle Make & Model</span>
                    <strong className="block text-xs sm:text-sm text-slate-800 leading-snug">{searchResult.vehicle || 'Matched Fleet Asset'}</strong>
                  </div>

                  {/* Current application status */}
                  <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl space-y-0.5">
                    <span className="block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Application Status</span>
                    <div className="flex items-center gap-1.5 mt-0.5 font-extrabold text-xs sm:text-sm text-[#1F3F7A] uppercase">
                      <span className={`w-2 h-2 rounded-full ${
                        searchResult.status === 'Approved' ? 'bg-[#7CC242]' : searchResult.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      {searchResult.status || 'Pending'}
                    </div>
                  </div>

                  {/* License validation status */}
                  <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl space-y-0.5">
                    <span className="block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">License Verification</span>
                    <strong className="block text-xs sm:text-sm text-emerald-600 font-bold uppercase">{searchResult.licenseStatus || 'Pending'}</strong>
                  </div>

                  {/* Submission date */}
                  <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl space-y-0.5">
                    <span className="block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Submission Date</span>
                    <strong className="block text-xs sm:text-sm text-slate-700 font-mono">{searchResult.dateApplied || 'N/A'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simulated Controls badges */}
          <div className="bg-slate-50/50 max-w-4xl mx-auto p-3 sm:p-4 rounded-2xl border border-slate-100 mb-6 sm:mb-12 flex flex-wrap items-center gap-1.5 sm:gap-3 justify-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider w-full sm:w-auto text-center mb-1 sm:mb-0">Preview Stages:</span>
            {timelineSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveStep(idx);
                  setActionFeedback('');
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-[#1F3F7A] text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-[#1F3F7A] border border-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Premium Stepper Grid */}
          <div className="relative max-w-5xl mx-auto">
            {/* Visual connecting line */}
            <div className="absolute top-[35px] left-8 right-8 h-1 bg-slate-150 hidden lg:block z-0">
              <div 
                className="h-full bg-gradient-to-r from-[#7CC242] to-[#1F3F7A] transition-all duration-500"
                style={{ width: `${(activeStep / (timelineSteps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* 1. Mobile & Connected Vertical Timeline */}
            <div className="block lg:hidden max-w-md mx-auto relative border-l-2 border-slate-200 pl-4 ml-4 text-left space-y-3 mb-6">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx < activeStep;
                const isCurrent = idx === activeStep;
                const isUpcoming = idx > activeStep;
                const StepIcon = step.icon;

                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      setActiveStep(idx);
                      setActionFeedback('');
                    }}
                    className="relative cursor-pointer flex items-center gap-3 select-none"
                  >
                    {/* Stepper Bullet Node on left border position */}
                    <div className={`absolute -left-[25px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      isCurrent 
                        ? 'bg-[#7CC242] ring-4 ring-[#7CC242]/20 scale-105' 
                        : isPassed 
                        ? 'bg-[#1F3F7A] text-white' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isPassed ? (
                        <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />
                      ) : (
                        <span className="text-[7.5px] font-black">{idx + 1}</span>
                      )}
                    </div>

                    <div className={`flex-1 flex justify-between items-center px-3 py-2 rounded-xl border transition-all ${
                      isCurrent 
                        ? 'bg-emerald-50/40 border-emerald-100 shadow-2xs' 
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}>
                      <div className="min-w-0 pr-2">
                        <span className={`text-[8px] font-black uppercase tracking-wider block ${
                          isCurrent ? 'text-[#7CC242]' : isPassed ? 'text-[#1F3F7A]' : 'text-slate-400'
                        }`}>
                          Stage 0{idx + 1}
                        </span>
                        <h4 className="font-sans font-black text-xs text-[#1F3F7A] uppercase leading-tight truncate">
                          {step.label}
                        </h4>
                      </div>
                      
                      {/* Badge status */}
                      <div className="shrink-0">
                        {isCurrent ? (
                          <span className="text-[8px] font-black uppercase bg-[#7CC242]/10 text-[#7CC242] px-2 py-0.5 rounded border border-[#7CC242]/20">
                            Active
                          </span>
                        ) : isPassed ? (
                          <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                            Done
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold uppercase bg-slate-50 text-slate-350 px-2 py-0.5 rounded border border-slate-100">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Original Desktop Stepper Grid (Preserving exact layout and styling) */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-6 relative z-10">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx < activeStep;
                const isCurrent = idx === activeStep;
                const isUpcoming = idx > activeStep;
                const StepIcon = step.icon;

                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      setActiveStep(idx);
                      setActionFeedback('');
                    }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    {/* Badge Icon */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-[#7CC242] text-white shadow-lg shadow-[#7CC242]/30 scale-110 ring-4 ring-[#7CC242]/20' 
                        : isPassed 
                        ? 'bg-[#1F3F7A] text-white' 
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>

                    <div className="mt-4 text-center">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider block mb-1 ${
                        isCurrent ? 'text-[#7CC242]' : isPassed ? 'text-[#1F3F7A]' : 'text-slate-450'
                      }`}>
                        Stage 0{idx + 1}
                      </span>
                      <h4 className="font-sans font-black text-xs text-[#1F3F7A] tracking-tight uppercase max-w-[120px] mx-auto min-h-[32px] flex items-center justify-center">
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-tight mt-1 max-w-[110px] mx-auto opacity-75">
                        {isPassed ? 'Completed' : isCurrent ? 'Active review' : 'Upcoming Stage'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Compact Action & Notifications Panels for active states */}
            <div className="max-w-xl mx-auto mt-6 animate-fade-in text-left px-1">
              {actionFeedback && (
                <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-xs font-bold flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#7CC242]"></span>
                  {actionFeedback}
                </div>
              )}

              {activeStep === 3 && ( // Approved
                <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-700 font-extrabold text-[9px] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Required Action – Step 4
                    </div>
                    <h5 className="font-sans font-black text-xs text-[#1F3F7A] uppercase leading-tight">Pay Refundable Reservation Deposit</h5>
                    <p className="text-[10px] text-slate-500 font-medium">Please authorize deposit to lock active fleet inventory under your profile.</p>
                  </div>
                  <button 
                    onClick={() => setActionFeedback('Simulation: Stripe checkout authorization verified. Deposit paid successfully!')}
                    className="w-full sm:w-auto px-4 py-2 bg-[#7CC242] hover:bg-[#6db334] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none active:scale-97 text-center"
                  >
                    Pay Deposit (£500)
                  </button>
                </div>
              )}

              {activeStep === 4 && ( // Deposit Paid
                <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      Required Action – Step 5
                    </div>
                    <h5 className="font-sans font-black text-xs text-[#1F3F7A] uppercase leading-tight">Upload Private Hire / Motor Insurance certificate</h5>
                    <p className="text-[10px] text-slate-500 font-medium">Link your motor insurance scan to activate standard lease-to-buy logistics.</p>
                  </div>
                  <button 
                    onClick={() => setActionFeedback('Simulation: Insurance document validation completed. Document logged in underwriters pipeline.')}
                    className="w-full sm:w-auto px-4 py-2 bg-[#1F3F7A] hover:bg-[#152e5c] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none active:scale-97 text-center"
                  >
                    Upload Cover Scan
                  </button>
                </div>
              )}

              {activeStep === 6 && ( // Vehicle Ready
                <div className="bg-[#7CC242]/10 p-3.5 rounded-xl border border-[#7CC242]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-slate-600 font-extrabold text-[9px] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7CC242] animate-pulse"></span>
                      Fleet Logistics Ready – Step 7
                    </div>
                    <h5 className="font-sans font-black text-xs text-[#1F3F7A] uppercase leading-tight">Book Handover & Collections Schedule</h5>
                    <p className="text-[10px] text-slate-500 font-medium">Your vehicle has been detailed and tested. Secure your time slot now!</p>
                  </div>
                  <button 
                    onClick={() => setActionFeedback('Simulation: Handover collection slot locked. Confirmation sent to your mailbox.')}
                    className="w-full sm:w-auto px-4 py-2 bg-[#1F3F7A] hover:bg-[#152e5c] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none active:scale-97 text-center"
                  >
                    Schedule Pickup
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION 2 – STATUS EXPLANATION */}
      <section className="bg-slate-50 py-8 sm:py-24 border-b border-gray-150" id="status-explanations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
            <h2 className="font-sans font-black text-xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              What Each Status Means
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-3 sm:my-4 rounded-full"></div>
            <p className="text-[11px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-450 animate-fade-in">
              Clear definitions to keep you informed of your underwriters' review status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            
            {/* Status 1 */}
            <div className="p-4 sm:p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                ⌛
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm uppercase text-[#1F3F7A] mb-0.5 sm:mb-1 tracking-tight">Pending Review</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  Your application is waiting to be reviewed. Our underwriters will verify your credentials shortly.
                </p>
              </div>
            </div>

            {/* Status 2 */}
            <div className="p-4 sm:p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-bold">
                📁
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm uppercase text-[#1F3F7A] mb-0.5 sm:mb-1 tracking-tight">Documents Required</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  Additional information is needed. Check your messages or email portal to re-upload license statements.
                </p>
              </div>
            </div>

            {/* Status 3 */}
            <div className="p-4 sm:p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm uppercase text-[#1F3F7A] mb-0.5 sm:mb-1 tracking-tight">Approved</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  Your application has been accepted. Your vehicle is matched and ready for deposit settlement phases.
                </p>
              </div>
            </div>

            {/* Status 4 */}
            <div className="p-4 sm:p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                £
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm uppercase text-[#1F3F7A] mb-0.5 sm:mb-1 tracking-tight">Payment Pending</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  Complete payment to continue. Once verified, we will flag your vehicle for ready pickup stages.
                </p>
              </div>
            </div>

            {/* Status 5 */}
            <div className="p-4 sm:p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-[#7CC242]/10 text-[#7CC242] rounded-xl flex items-center justify-center font-bold">
                🚗
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm uppercase text-[#1F3F7A] mb-0.5 sm:mb-1 tracking-tight">Vehicle Ready</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  Your vehicle is ready for collection. Fully prepped, polished, detailed, and waiting under our dispatch line.
                </p>
              </div>
            </div>

            {/* Status 6 */}
            <div className="p-4 sm:p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                ★
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm uppercase text-[#1F3F7A] mb-0.5 sm:mb-1 tracking-tight">Completed</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  The process has been successfully completed. Keys allocated and driver journey began, welcome to ownership!
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 3 – CUSTOMER SUPPORT */}
      <section className="bg-white py-8 sm:py-24" id="customer-support-help-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
            <h2 className="font-sans font-black text-xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Need Help With Your Application?
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-3 sm:my-4 rounded-full"></div>
            <p className="text-[11px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-400">
              Get in touch with our operations support team now.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-6 sm:mb-12 max-w-6xl mx-auto text-left">
            
            {/* Contact Support */}
            <div className="space-y-2 p-3 sm:p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Phone className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Contact Support</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                Our operations team is available Monday to Friday from 9 AM to 5 PM. Dial +44 20 7946 0192 for direct updates.
              </p>
            </div>

            {/* Email Assistance */}
            <div className="space-y-2 p-3 sm:p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Mail className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Email Assistance</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                Submit updated licensing, change request details, or other queries with your reference index directly to support@r2buy.com.
              </p>
            </div>

            {/* Track Application Help */}
            <div className="space-y-2 p-3 sm:p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#7CC242]/10 text-[#7CC242] flex items-center justify-center font-bold">
                <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Track Application Help</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                Your reference ID was dispatched to your sign-up email inbox. If misplaced, request reference recovery from the login portal.
              </p>
            </div>

            {/* Frequently Asked Questions */}
            <div className="space-y-2 p-3 sm:p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Frequently Asked Questions</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                Access self-service guides concerning insurance coverage parameters, standard weekly rent calculations, and bad debit limits.
              </p>
            </div>

          </div>

          <div className="pt-2 sm:pt-4">
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1F3F7A] hover:bg-[#152e5c] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Contact Support
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
