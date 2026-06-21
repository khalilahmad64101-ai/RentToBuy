import React from 'react';
import { Search, CalendarClock } from 'lucide-react';

export function TrackingHero({
  appNumber,
  setAppNumber,
  handleManualSearch,
  isSearching,
  searchError,
  activeStatusText,
  currentAppTrack
}) {
  return (
    <>
      {/* Manual lookup mini form if users want to search distinct folder */}
      <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/70">
        <form onSubmit={handleManualSearch} className="flex gap-2 items-center">
          <div className="flex-1">
            <input
              type="text"
              required
              value={appNumber}
              onChange={(e) => setAppNumber(e.target.value)}
              placeholder="Ref ID (e.g. RTB-7729)"
              className="w-full bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-[#1F3F7A] hover:bg-slate-800 text-white font-black text-[10px] uppercase px-4 h-8.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
          >
            {isSearching ? '...' : <><Search className="w-3 h-3" /> Track</>}
          </button>
        </form>
        {searchError && (
          <p className="text-[10px] text-red-650 font-bold mt-1.5 px-1">{searchError}</p>
        )}
      </div>

      {/* Current status display card */}
      <div className="mt-4 bg-[#1F3F7A] text-white p-4.5 rounded-2xl shadow-xs text-left relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-10">
          <CalendarClock className="w-16 h-16 text-white" />
        </div>
        <span className="text-[9px] font-black uppercase text-slate-350 tracking-widest leading-none">Status Dashboard</span>
        <h3 className="text-sm font-semibold text-slate-200 mt-1 leading-none">Current Status:</h3>
        <p className="text-lg font-black mt-1 uppercase tracking-wide text-[#7CC242]">
          {activeStatusText === 'Under Review' ? 'Application Under Review' : activeStatusText}
        </p>
        {currentAppTrack && (
          <span className="block text-[9.5px] font-bold text-slate-400 font-mono mt-1.5 leading-none">
            Vehicle: {currentAppTrack.vehicleName} • ID: {currentAppTrack.id}
          </span>
        )}
      </div>
    </>
  );
}
