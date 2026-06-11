import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { mapFriendlyFeedback } from '../utils/feedbackHelper.js';
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

        let customStepIndex = 2; // Under review as default fallback
        if (defaultApp.status === 'Approved') {
          customStepIndex = 3;
        } else if (defaultApp.status === 'Awaiting Payment') {
          customStepIndex = 3;
        } else if (defaultApp.step >= 4 || defaultApp.status === 'Paid' || defaultApp.status === 'Completed') {
          customStepIndex = 4;
        } else if (defaultApp.step === 2) {
          customStepIndex = 1;
        } else if (defaultApp.step === 1) {
          customStepIndex = 0;
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
      
      let customStepIndex = 2; // Under review by default
      if (data.status === 'Approved') {
        customStepIndex = 3;
      } else if (data.status === 'Awaiting Payment') {
        customStepIndex = 3;
      } else if (data.step >= 4 || data.status === 'Paid' || data.status === 'Completed') {
        customStepIndex = 4;
      } else if (data.step === 2) {
        customStepIndex = 1;
      } else if (data.step === 1) {
        customStepIndex = 0;
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

  // Timeline Step Configurations (Exactly the 7 steps requested)
  const timelineSteps = [
    { label: 'Application Submitted', desc: 'Use Budget Meter results & complete application form.', icon: FileText },
    { label: 'Documents Uploaded', desc: 'Securely submit license statement checklist.', icon: Upload },
    { label: 'Application Under Review', desc: 'Underwriting team checks files for regulatory validation.', icon: Clock },
    { label: 'Approved', desc: 'Application approved! Proceed to digital contract.', icon: CheckCircle2 },
    { label: 'Payment Completed', desc: 'Contribution or secure deposit receipt verified.', icon: DollarSign },
    { label: 'Vehicle Ready', desc: 'Fleet allocated & keys prepared for active dispatch.', icon: Car },
    { label: 'Collection Scheduled', desc: 'Schedule London key handoff & drive away!', icon: Key }
  ];

  return (
    <div className="bg-white min-h-screen pb-16 font-sans antialiased" id="track-ride-page-root">
      
      {/* 1. HERO SECTION REDESIGN */}
      <section 
        className="relative w-full h-[550px] bg-cover bg-center flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden shadow-sm animate-fade-in"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8, 14, 28, 0.98) 0%, rgba(12, 22, 44, 0.85) 45%, rgba(15, 23, 42, 0.45) 100%), url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1600')`
        }}
        id="track-journey-hero"
      >
        {/* Premium ambient grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none"></div>

        <div className="w-full max-w-7xl mx-auto z-10 text-left">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-[#7CC242] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#7CC242] animate-pulse"></span>
              Track Your Application
            </div>
            
            <h1 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight uppercase">
              Monitor Your Vehicle <br />
              <span className="text-[#7CC242]">Application Progress</span>
            </h1>
            
            <p className="text-slate-350 text-slate-350 text-sm sm:text-base leading-relaxed font-normal text-slate-200">
              Stay updated with every stage of your Rent-To-Buy application, from submission to approval and vehicle collection.
            </p>

            <div className="pt-2">
              <button 
                onClick={() => {
                  const searchForm = document.getElementById('tracking-timeline-section');
                  if (searchForm) searchForm.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7CC242] hover:bg-[#6bb033] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#7CC242]/20 transition-all duration-200 active:scale-95 cursor-pointer font-sans"
              >
                Track Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1 – APPLICATION JOURNEY */}
      <section className="bg-white py-16 sm:py-24 border-b border-gray-150" id="tracking-timeline-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Track Every Step
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-400">
              Your real-time progress update from initial sign-up to ignition.
            </p>
          </div>

          {/* User Sleek Search Row integrated natively without heavy box borders */}
          <div className="max-w-4xl mx-auto mb-16 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs" id="track-lookup-form-container">
            <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 text-left">
                <label className="block text-[10px] font-black uppercase text-[#1F3F7A] tracking-wider mb-2">
                  Application ID / Reference
                </label>
                <input 
                  type="text"
                  required
                  value={appNumber}
                  onChange={(e) => setAppNumber(e.target.value)}
                  placeholder="e.g. RTB-7729"
                  className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-[#1F3F7A] placeholder-slate-400 focus:ring-2 focus:ring-[#7CC242]/20 focus:border-[#7CC242] transition-all outline-none"
                />
              </div>
              <div className="md:col-span-5 text-left">
                <label className="block text-[10px] font-black uppercase text-[#1F3F7A] tracking-wider mb-2">
                  Associated Email Address
                </label>
                <input 
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="e.g. driver@rental.co.uk"
                  className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-[#1F3F7A] placeholder-slate-400 focus:ring-2 focus:ring-[#7CC242]/20 focus:border-[#7CC242] transition-all outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-[#1F3F7A] hover:bg-[#152e5c] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-[#1F3F7A]/10"
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
              <div className="mt-6 p-6 bg-white border border-gray-200 shadow-md rounded-2xl animate-fade-in text-left space-y-4" id="track-results-overlay">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Application Reference</span>
                    <h3 className="text-lg font-black text-[#1F3F7A] font-mono leading-none mt-1">{searchResult.id || 'N/A'}</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <Check className="w-3.5 h-3.5 mr-1" /> Dynamic DB Match
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Approved car make and model */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Vehicle Make & Model</span>
                    <strong className="block text-sm text-slate-800 leading-snug">{searchResult.vehicle || 'Matched Fleet Asset'}</strong>
                  </div>

                  {/* Current application status */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Application Status</span>
                    <div className="flex items-center gap-1.5 mt-1 font-extrabold text-sm text-[#1F3F7A] uppercase">
                      <span className={`w-2 h-2 rounded-full ${
                        searchResult.status === 'Approved' ? 'bg-[#7CC242]' : searchResult.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      {searchResult.status || 'Pending'}
                    </div>
                  </div>

                  {/* License validation status */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">License Verification</span>
                    <strong className="block text-sm text-emerald-600 font-bold uppercase">{searchResult.licenseStatus || 'Pending'}</strong>
                  </div>

                  {/* Submission date */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Submission Date</span>
                    <strong className="block text-sm text-slate-700 font-mono">{searchResult.dateApplied || 'N/A'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simulated Controls badges */}
          <div className="bg-slate-50/50 max-w-4xl mx-auto p-4 rounded-2xl border border-slate-100 mb-12 flex flex-wrap items-center gap-3 justify-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Preview Timeline Stages:</span>
            {timelineSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-[#1F3F7A] text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-[#1F3F7A] border border-gray-200'
                }`}
              >
                {idx + 1}. {s.label}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 relative z-10">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx < activeStep;
                const isCurrent = idx === activeStep;
                const isUpcoming = idx > activeStep;
                const StepIcon = step.icon;

                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
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

                    {/* Mobil Connection Arrow indicator */}
                    {idx < timelineSteps.length - 1 && (
                      <div className="my-3 block lg:hidden font-black text-[#7CC242]">
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

      {/* 3. SECTION 2 – STATUS EXPLANATION */}
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-gray-150" id="status-explanations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              What Each Status Means
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-450">
              Clear definitions to keep you informed of your underwriters' review status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Status 1 */}
            <div className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-4">
              <div className="shrink-0 w-11 h-11 bg-amber-55 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                ⌛
              </div>
              <div>
                <h3 className="font-black text-sm uppercase text-[#1F3F7A] mb-1 tracking-tight">Pending Review</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Your application is waiting to be reviewed. Our underwriters will verify your credentials shortly.
                </p>
              </div>
            </div>

            {/* Status 2 */}
            <div className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-4">
              <div className="shrink-0 w-11 h-11 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-bold">
                📁
              </div>
              <div>
                <h3 className="font-black text-sm uppercase text-[#1F3F7A] mb-1 tracking-tight">Documents Required</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Additional information is needed. Check your messages or email portal to re-upload license statements.
                </p>
              </div>
            </div>

            {/* Status 3 */}
            <div className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-4">
              <div className="shrink-0 w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-black text-sm uppercase text-[#1F3F7A] mb-1 tracking-tight">Approved</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Your application has been accepted. Your vehicle is matched and ready for deposit settlement phases.
                </p>
              </div>
            </div>

            {/* Status 4 */}
            <div className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-4">
              <div className="shrink-0 w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                £
              </div>
              <div>
                <h3 className="font-black text-sm uppercase text-[#1F3F7A] mb-1 tracking-tight">Payment Pending</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Complete payment to continue. Once verified, we will flag your vehicle for ready pickup stages.
                </p>
              </div>
            </div>

            {/* Status 5 */}
            <div className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-4">
              <div className="shrink-0 w-11 h-11 bg-[#7CC242]/10 text-[#7CC242] rounded-xl flex items-center justify-center font-bold">
                🚗
              </div>
              <div>
                <h3 className="font-black text-sm uppercase text-[#1F3F7A] mb-1 tracking-tight">Vehicle Ready</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Your vehicle is ready for collection. Fully prepped, polished, detailed, and waiting under our dispatch line.
                </p>
              </div>
            </div>

            {/* Status 6 */}
            <div className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group text-left border border-slate-100 flex gap-4">
              <div className="shrink-0 w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                ★
              </div>
              <div>
                <h3 className="font-black text-sm uppercase text-[#1F3F7A] mb-1 tracking-tight">Completed</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  The process has been successfully completed. Keys allocated and driver journey began, welcome to ownership!
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 3 – CUSTOMER SUPPORT */}
      <section className="bg-white py-16 sm:py-24" id="customer-support-help-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
              Need Help With Your Application?
            </h2>
            <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider text-slate-400">
              Get in touch with our operations support team now.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-6xl mx-auto text-left">
            
            {/* Contact Support */}
            <div className="space-y-3 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Contact Support</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Our operations team is available Monday to Friday from 9 AM to 5 PM. Dial +44 20 7946 0192 for direct updates.
              </p>
            </div>

            {/* Email Assistance */}
            <div className="space-y-3 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Email Assistance</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Submit updated licensing, change request details, or other queries with your reference index directly to support@r2buy.com.
              </p>
            </div>

            {/* Track Application Help */}
            <div className="space-y-3 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#7CC242]/10 text-[#7CC242] flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Track Application Help</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your reference ID was dispatched to your sign-up email inbox. If misplaced, request reference recovery from the login portal.
              </p>
            </div>

            {/* Frequently Asked Questions */}
            <div className="space-y-3 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-[#1F3F7A] tracking-tight">Frequently Asked Questions</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Access self-service guides concerning insurance coverage parameters, standard weekly rent calculations, and bad debit limits.
              </p>
            </div>

          </div>

          <div className="pt-4">
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#1F3F7A] hover:bg-[#152e5c] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              Contact Support
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
