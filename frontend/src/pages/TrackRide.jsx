import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
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
  DollarSign
} from 'lucide-react';

export function TrackRide() {
  const { user, driverData } = useAuth();
  
  // Tracking state variables
  const [appNumber, setAppNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Active step state for the vertical timeline
  // Defaults to index 3 ("Approved") for a premium feel
  const [activeStep, setActiveStep] = useState(3); 
  
  // Custom interactive FAQ index
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Pre-configured simulated database for testing statuses instantly
  const simulatedApps = {
    'RTB-7729': {
      vehicle: 'Toyota Prius Hybrid',
      monthly: '£220',
      deposit: '£800',
      status: 'Approved',
      stepIndex: 3, 
      updates: [
        { text: 'Deposit pending settlement', date: 'Just now' },
        { text: 'Underwriting check approved by Agent', date: '2 hours ago' },
        { text: 'DVLA License check verification completed', date: '1 day ago' },
      ]
    },
    'RTB-8291': {
      vehicle: 'Toyota Aqua',
      monthly: '£250',
      deposit: '£1000',
      status: 'Under Review',
      stepIndex: 2, 
      updates: [
        { text: 'Insurance processing started', date: '5 hours ago' },
        { text: 'Verification started by Risk Team', date: '1 day ago' },
        { text: 'Documents received & processed', date: '2 days ago' },
      ]
    },
    'RTB-1004': {
      vehicle: 'Tesla Model 3',
      monthly: '£450',
      deposit: '£1500',
      status: 'Vehicle Ready',
      stepIndex: 5,
      updates: [
        { text: 'Pristine fleet unit allocated', date: 'Yesterday' },
        { text: 'Deposit verified in secure escrow', date: '3 days ago' },
        { text: 'Underwriting check approved in full', date: '4 days ago' },
      ]
    }
  };

  // Sync state if user logs in
  useEffect(() => {
    if (user?.email) {
      setEmailAddress(user.email);
      // Auto pre-populate a sample track if they have no backend records yet
      const defaultApp = driverData?.applications?.[0];
      if (defaultApp) {
        setSearchResult({
          vehicle: defaultApp.carName || 'Toyota Aqua',
          monthly: defaultApp.weeklyPrice ? `£${defaultApp.weeklyPrice * 4}` : '£250',
          deposit: defaultApp.depositAmount ? `£${defaultApp.depositAmount}` : '£1000',
          status: defaultApp.status || 'Under Review',
          stepIndex: defaultApp.status === 'Approved' ? 3 : 2,
          updates: [
            { text: 'Documents received safely', date: '1 day ago' },
            { text: 'Verification started', date: '2 days ago' },
            { text: 'Insurance processing', date: '2 days ago' }
          ]
        });
      }
    }
  }, [user, driverData]);

  // Handle manual tracking lookup
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!appNumber.trim()) {
      setSearchError('Please fill in your Application Number.');
      return;
    }
    if (!emailAddress.trim()) {
      setSearchError('Please fill in your associated Email Address.');
      return;
    }

    setSearchError('');
    setIsSearching(true);
    setSearchResult(null);

    // Dynamic loading delay to mimic advanced backend lookup
    setTimeout(() => {
      const normalizedID = appNumber.trim().toUpperCase();
      const match = simulatedApps[normalizedID] || simulatedApps['RTB-8291']; // Fallback to Aqua mock
      
      setSearchResult({
        id: normalizedID,
        vehicle: match.vehicle,
        monthly: match.monthly,
        deposit: match.deposit,
        status: match.status,
        stepIndex: match.stepIndex,
        updates: match.updates
      });

      setActiveStep(match.stepIndex);
      setIsSearching(false);
      
      // Auto scroll to tracking section below hero
      const elem = document.getElementById('tracking-timeline-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 900);
  };

  // Timeline Step Configurations
  const timelineSteps = [
    { label: 'Application Submitted', status: 'completed' },
    { label: 'Documents Uploaded', status: 'completed' },
    { label: 'Verification In Progress', status: 'completed' },
    { label: 'Approved', status: 'completed' },
    { label: 'Deposit Pending', status: 'pending' },
    { label: 'Vehicle Ready', status: 'upcoming' },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16 font-sans antialiased" id="track-ride-page-root">
      
      {/* 1. Hero Section */}
      <section className="relative bg-slate-950 text-white py-28 overflow-hidden" id="track-journey-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_75%,transparent_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/20">
            Real-time Status Portal
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            Track Your Ride Journey
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stay updated with your application and vehicle status. Get real-time updates of your onboarding steps in one unified location.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => {
                const searchForm = document.getElementById('track-by-id-form');
                if (searchForm) searchForm.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-98 cursor-pointer"
            >
              Track Now
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">

        {/* 2. Application Tracking Section */}
        <section 
          className="bg-white rounded-3xl border border-gray-150 p-4 sm:p-10 shadow-sm relative overflow-hidden"
          id="tracking-timeline-section"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Stages</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Application Routing Timeline
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-indigo-50/50 text-indigo-700 px-3.5 py-1.5 rounded-xl border border-indigo-100/50 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Currently View State: {timelineSteps[activeStep]?.label || 'Active Status'}
            </div>
          </div>

          {/* Interactive Timeline Controls for easy testing/review */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 flex flex-wrap items-center gap-3 justify-center">
            <span className="text-xs font-bold text-slate-500">Live Simulation Status Indicator:</span>
            {timelineSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-slate-950 text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-150'
                }`}
              >
                {idx + 1}. {s.label}
              </button>
            ))}
          </div>

          <div className="relative mt-8">
            {/* Timeline Progress Bar (Vertical on mobile, horizontal on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx < activeStep;
                const isCurrent = idx === activeStep;
                const isUpcoming = idx > activeStep;

                return (
                  <div 
                    key={idx} 
                    onClick={() => setActiveStep(idx)}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isCurrent 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10 scale-105' 
                        : isPassed 
                        ? 'bg-indigo-50/40 border-indigo-200 text-slate-800 hover:bg-indigo-50/70' 
                        : 'bg-white border-gray-200 text-slate-400 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-indigo-100' : 'text-slate-400'}`}>
                        Step 0{idx + 1}
                      </span>
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      ) : isCurrent ? (
                        <span className="flex h-5 w-5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-100/30 border-2 border-white items-center justify-center text-[9px] font-black text-white">●</span>
                        </span>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-200" />
                      )}
                    </div>
                    <h4 className="font-sans font-black text-xs sm:text-xs tracking-tight line-clamp-1">
                      {step.label}
                    </h4>
                    <p className={`text-[10px] mt-1.5 leading-relaxed font-sans ${isCurrent ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {isPassed 
                        ? 'Task fully verified and completed.' 
                        : isCurrent 
                        ? 'Active reviewer handling underwriting.' 
                        : 'Pending preliminary tasks completion.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Two-Column Midsection: Track by ID Form & How Tracking Works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* 3. Enter Reference / Application ID */}
          <div 
            className="bg-white rounded-3xl border border-gray-150 p-4 sm:p-8 shadow-sm flex flex-col justify-between"
            id="track-by-id-form"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Manual Lookup</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                  Enter Reference or Application ID
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  If you are checking status offline, enter your unique ID below. Try default code <span className="font-bold text-indigo-600">RTB-7729</span> or <span className="font-bold text-indigo-600">RTB-8291</span> for full simulated demo profiles.
                </p>
              </div>

              {searchError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  {searchError}
                </div>
              )}

              <form onSubmit={handleTrackSubmit} className="space-y-4 mt-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-1.5">
                    Application Number
                  </label>
                  <input 
                    type="text"
                    required
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                    placeholder="e.g. RTB-7729"
                    className="w-full bg-slate-50/50 px-4 py-3 rounded-xl border border-gray-150 text-xs font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="e.g. driver@rental.co.uk"
                    className="w-full bg-slate-50/50 px-4 py-3 rounded-xl border border-gray-150 text-xs font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider py-4.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Retrieving Status File...</span>
                      </>
                    ) : (
                      <>
                        <span>Track Status</span>
                        <Search className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {searchResult && (
              <div className="mt-6 p-4.5 bg-indigo-50 text-indigo-900 rounded-2xl border border-indigo-100/80 animate-fade-in flex flex-col gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded-md self-start">
                  Match Found: {searchResult.id || 'RTB-8291'}
                </span>
                <span className="font-extrabold text-sm block">
                  Status: {searchResult.status}
                </span>
                <p className="text-[11px] text-indigo-700 leading-tight">
                  Lease vehicle is currently marked as <span className="font-bold underline">{searchResult.vehicle}</span>. Review timeline and updates accordingly.
                </p>
              </div>
            )}
          </div>

          {/* 4. How Tracking Works */}
          <div className="bg-white rounded-3xl border border-gray-150 p-4 sm:p-8 shadow-sm flex flex-col justify-between" id="how-tracking-steps">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Simple Explanation</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                  How Tracking Works
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {[
                  { title: 'Submit Application', desc: 'Securely submit your application profile along with vehicle preferences.' },
                  { title: 'Upload Documents', desc: 'Provide proof of ID, DVLA licenses & clean private-hire status parameters.' },
                  { title: 'Get Approved', desc: 'Our underwriters check your direct wage profiles quickly and fairly.' },
                  { title: 'Complete Deposit & Collect', desc: 'Pay your direct deposit, finalize signatures, & collect ready units.' }
                ].map((step, sIdx) => (
                  <div key={sIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:border-indigo-100 transition-all">
                    <span className="text-[10px] font-mono text-indigo-600 font-extrabold block">Step 0{sIdx + 1}</span>
                    <h5 className="font-sans font-black text-xs text-[#111A2E] tracking-tight">{step.title}</h5>
                    <p className="text-[10px] font-sans text-slate-500 leading-relaxed font-light">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Two-Column Left/Right: Current Ride Information & Recent Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 5. Current Ride Information */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-150 p-4 sm:p-8 shadow-sm space-y-6" id="current-ride-section">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Allocated Assets</span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                Current Ride Information
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Review key stats, active deposit status, & leasing parameters of your requested vehicle below.
              </p>
            </div>

            {/* Premium Interactive Asset Panel */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-550/20 via-transparent to-transparent"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-indigo-500/20">
                    <Car className="w-3.5 h-3.5" />
                    Toyota Aqua
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Monthly Payment Scale</span>
                    <div className="flex items-baseline text-2xl font-black text-white">
                      £250<span className="text-xs text-slate-400 font-sans font-normal ml-1">/ Month Contribution</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Escrow Refundable Deposit</span>
                    <div className="flex items-baseline text-lg font-extrabold text-white">
                      £1,000<span className="text-xs text-slate-400 font-sans font-normal ml-1">Paid Base</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end justify-between gap-4 self-stretch sm:self-center">
                  <div className="bg-indigo-600 border border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-full min-w-[140px]">
                    <span className="text-[9px] text-indigo-200 font-mono tracking-widest uppercase">UNDER REVIEW</span>
                    <span className="text-lg font-black leading-none mt-1 text-white">82% Verified</span>
                  </div>
                  
                  {user && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Assigned to: {user.fullName || user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Notifications & Updates */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-150 p-4 sm:p-8 shadow-sm space-y-6 animate-fade-in" id="notifications-logs">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Activity Audit</span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                Notifications & Updates
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Review recent system updates completed by Underwriters.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Insurance processing', status: 'Pending review of clean coverage policy parameters.', date: 'Today at 10:24 AM', icon: Bell },
                { label: 'Verification started', status: 'Security risk check flagged green for manual check.', date: 'Yesterday at 3:15 PM', icon: Clock },
                { label: 'Documents received', status: 'Licensing PDFs & address statements validated.', date: '2 days ago at 11:32 AM', icon: FileCheck2 },
              ].map((notif, nIdx) => {
                const IconComp = notif.icon;
                return (
                  <div key={nIdx} className="flex gap-4 p-4.5 bg-slate-50/50 border border-gray-150/80 rounded-2xl relative overflow-hidden group hover:border-indigo-150 transition-all">
                    <div className="shrink-0 p-2.5 bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-650 rounded-xl transition-all duration-300">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-sans font-black text-xs text-slate-950 leading-none">{notif.label}</h5>
                        <span className="text-[9px] text-slate-400 font-mono">{notif.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans leading-relaxed">{notif.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 7. FAQ Section */}
        <section className="bg-white rounded-3xl border border-gray-150 p-4 sm:p-10 shadow-sm space-y-8" id="tracking-faqs">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Portal Queries</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Tracking & Underwriting FAQs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-sans">
              Frequently asked questions regarding processing latency, required verification paperwork, and deposit rules.
            </p>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-gray-100">
            {[
              {
                q: 'How long does approval take?',
                a: 'Most underwritings are completed and checked within 24 to 48 hours of initial verification. Providing clean, crisp documents and correct direct banking profiles accelerates this turnaround significantly.'
              },
              {
                q: 'What documents are required?',
                a: 'Please upload: 1) Both sides of your DVLA Photocard Driving License, 2) A recent utility statement or council tax documentation as Proof of Address, and 3) A summary or profile parameter representation printout.'
              },
              {
                q: 'When can I pay the deposit?',
                a: 'Deposits should be settled in full once your application status updates to APPROVED. Do not submit your deposit while validation checks are under active verification.'
              },
              {
                q: 'How do I update my documents?',
                a: 'If any paper requires correction, you can easily select or drag files to update them on your dashboard portal, or submit secure attachments of revised documents to our Agent support email.'
              }
            ].map((faq, fIdx) => (
              <div key={fIdx} className="py-4 font-sans">
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === fIdx ? null : fIdx)}
                  className="w-full flex items-center justify-between text-left py-2 group focus:outline-none cursor-pointer"
                >
                  <h4 className="font-extrabold text-sm text-slate-950 group-hover:text-indigo-600 transition-colors">
                    {faq.q}
                  </h4>
                  {openFaqIdx === fIdx ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-605" />
                  )}
                </button>
                {openFaqIdx === fIdx && (
                  <div className="p-3 bg-slate-50 rounded-xl mt-2 text-xs text-slate-600 leading-relaxed animate-fade-in font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 8. Contact Support Section */}
        <section className="bg-slate-950 text-white rounded-3xl p-4 sm:p-12 relative overflow-hidden shadow-xl border border-slate-850 text-center space-y-6" id="contact-support-cta">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]"></div>
          
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              Instant Touchpoint
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
              Need Help?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              If you have custom requests regarding status tracking, or run into verification issues, contact our support team immediately.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
            <a href="tel:+442079460192" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-550 border border-indigo-500/50 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all">
                <Phone className="w-4 h-4" />
                Call Us
              </button>
            </a>
            
            <a href="mailto:support@rent2go-buycarz.co.uk" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all">
                <Mail className="w-4 h-4 text-indigo-300" />
                Email Us
              </button>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
