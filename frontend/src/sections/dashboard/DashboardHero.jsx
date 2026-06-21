import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Plus, ArrowLeft } from 'lucide-react';

export function DashboardHero({
  user,
  driverData,
  syncDriverData,
  setActiveTab,
  getStepDescription,
  clearAllMessages
}) {
  const { applications = [], agreements = [], payments = [] } = driverData;

  const submittedCount = applications.length;
  const approvedCount = applications.filter(a => a.step === 4 || a.status === 'Approved').length;
  const pendingCount = applications.filter(a => a.step === 2 || a.step === 1 || a.status === 'In Progress' || a.status === 'Under Review').length;
  const actionRequiredCount = applications.filter(a => a.step === 3 || a.status === 'Action Required').length;

  return (
    <div className="space-y-4">

      {/* 2. Compact Welcome Card (Height < 100px) */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-3 flex flex-row items-center justify-between gap-3 shadow-xs -mx-0">
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase tracking-widest text-[#7CC242] font-mono leading-none">Heathrow Hub</span>
          <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-none">Driver Hub Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              syncDriverData();
              clearAllMessages();
            }}
            className="flex items-center text-[10.5px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors px-2.5 py-1.5 rounded-lg cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            <span>Refresh</span>
          </button>
          <Link to="/apply">
            <button className="flex items-center text-[10.5px] font-extrabold bg-[#7CC242] hover:bg-[#6cb135] text-black transition-all px-3 py-1.5 rounded-lg cursor-pointer shadow-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Apply Car</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 3. Current Application Status & Progress Tracker */}
      {applications.length > 0 ? (
        <div className="bg-white border border-gray-150 rounded-xl p-3.5 shadow-3xs space-y-3 animate-fade-in">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="font-bold text-slate-800">Status: {applications[0].carName}</span>
            </div>
            <span className="font-mono text-indigo-650 font-black">
              {Math.min(100, Math.max(12, Math.round((applications[0].step / 8) * 100)))}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-650 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(12, Math.round((applications[0].step / 8) * 100)))}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold leading-none">
              <span>Docs</span>
              <span>Review</span>
              <span>Approved</span>
              <span>Ready</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs flex flex-row justify-between items-center gap-2">
            <p className="text-[11px] text-slate-600 leading-snug">
              <b>Current Stage:</b> {getStepDescription(applications[0].step, applications[0].status)}
            </p>

            {/* Immediate CTA Action Buttons (Apply / Pay / Upload Insurance) */}
            <div className="shrink-0 flex items-center gap-2">
              {applications[0].step === 4 && (
                <button
                  onClick={() => setActiveTab('payments')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg cursor-pointer shadow-3xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  💳 Pay Deposit (£250)
                </button>
              )}

              {applications[0].step === 5 && (
                <button
                  onClick={() => setActiveTab('insurance')}
                  className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg cursor-pointer shadow-3xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  🛡️ Upload Insurance
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* If no applications yet, show a nice quick action card to apply quickly */
        <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-4 text-center space-y-2.5 animate-fade-in">
          <div className="max-w-md mx-auto">
            <h3 className="font-extrabold text-sm text-indigo-950">Buy Quickly, Apply Quickly!</h3>
            <p className="text-xs text-indigo-850 mt-1">
              Get approved under 24 hours. Start verification by submitting your driver documents of taxi dispatch.
            </p>
          </div>
          <Link to="/apply" className="inline-block">
            <button className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer shadow-3xs transition">
              Apply Fast Now
            </button>
          </Link>
        </div>
      )}

      {/* 4. Mini Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Apps', val: submittedCount, color: 'text-indigo-600', bg: 'bg-indigo-50/40' },
          { label: 'Lease', val: agreements.length, color: 'text-emerald-600', bg: 'bg-emerald-50/40' },
          { label: 'Review', val: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50/40' },
          { label: 'Wait', val: actionRequiredCount, color: 'text-rose-600', bg: 'bg-rose-50/40' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-150 p-2.5 rounded-xl flex items-center gap-3 shadow-3xs">
            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center font-black text-xs ${card.color} shrink-0`}>
              {card.val}
            </div>
            <div className="leading-none">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#94a3b8]">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Active Vehicle Section */}
      <div className="bg-white border border-gray-150 p-3.5 rounded-xl shadow-3xs space-y-2">
        <div className="flex justify-between items-center pb-1.5 border-b border-gray-100">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">My Vehicle</h4>
          {agreements.length > 0 && (
            <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Active Lease</span>
          )}
        </div>

        {agreements.length === 0 ? (
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-500 font-medium">No vehicle assigned</span>
            <Link to="/apply">
              <button className="bg-indigo-650 hover:bg-indigo-700 transition text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-3xs cursor-pointer">
                Apply Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {agreements.map((agr) => (
              <div key={agr.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-8 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img 
                      src={agr.carImage || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"} 
                      alt={agr.carName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-900 truncate leading-tight">{agr.carName}</h5>
                    <span className="text-[9.5px] text-slate-450   text-slate-500 block">Term: {agr.durationMonths || 12} Mos • £{agr.weeklyRate}/wk</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="block font-mono font-bold text-indigo-650 leading-none mb-0.5">£{agr.weeklyRate || 45}/wk</span>
                  <span className="block text-[9.5px] text-emerald-600 font-bold leading-none">Cleared: £{agr.paidContributions || 45}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Recent Activity Section */}
      <div className="bg-white border border-gray-150 p-3.5 rounded-xl shadow-3xs space-y-2.5" id="recent-activity-card">
        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Recent Activity
          </h4>
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Latest Logs</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="text-emerald-600 text-xs font-bold shrink-0">✓</span>
            <span className="truncate flex-1 font-semibold text-slate-800 text-[11px]">Driver Record Created</span>
          </div>

          {applications.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="text-emerald-600 text-xs font-bold shrink-0">✓</span>
              <span className="truncate flex-1 font-semibold text-slate-800 text-[11px]">{applications[0].carName} Submitted</span>
            </div>
          )}

          {payments.length > 0 ? (
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="text-emerald-600 text-xs font-bold shrink-0">✓</span>
              <span className="truncate flex-1 font-semibold text-slate-800 text-[11px]">Payment Received: £{payments[0].amount}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-400 text-xs font-bold shrink-0">•</span>
              <span className="truncate flex-1 text-slate-400 text-[11px]">No payments issued yet</span>
            </div>
          )}
        </div>
      </div>

      {/* 7. Need Help Section */}
      <div className="bg-[#0c111d] border border-slate-800 text-white p-3.5 rounded-xl relative overflow-hidden flex items-center justify-between shadow-xs" id="advisory-hotline-card">
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="space-y-0.5 relative z-10">
          <span className="block text-[9.5px] uppercase tracking-wider font-extrabold text-[#7CC242] font-mono leading-none">Need Help?</span>
          <strong className="block text-xs font-mono tracking-tight text-white leading-tight">+44 7700 900222</strong>
        </div>
        <a href="tel:+447700900222" className="bg-[#7CC242] hover:bg-[#6cb135] text-black text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-3xs relative z-10">
          Call Now
        </a>
      </div>

    </div>
  );
}
