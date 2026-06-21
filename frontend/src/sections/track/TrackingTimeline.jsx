import React from 'react';
import { Check } from 'lucide-react';

export function TrackingTimeline({
  timelineStages,
  activeStepNum
}) {
  return (
    <div className="mt-6 text-left">
      <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">Milestone Progress Steps</h3>
      
      <div className="space-y-2.5">
        {timelineStages.map((stage) => {
          // Evaluates if the stage has been reached or completed
          const isCompleted = stage.stepNum <= activeStepNum;
          const isCurrent = stage.stepNum === activeStepNum;

          return (
            <div 
              key={stage.stepNum}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isCurrent 
                  ? 'bg-emerald-50/50 border-emerald-100 ring-2 ring-emerald-50' 
                  : isCompleted 
                  ? 'bg-slate-50/40 border-slate-100' 
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isCompleted 
                    ? 'bg-[#7CC242] border-[#7CC242] text-white' 
                    : 'border-slate-300 text-slate-350'
                }`}>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  ) : (
                    <span className="text-[9px] font-black">{stage.stepNum}</span>
                  )}
                </div>
                <span className={`text-xs font-black ${
                  isCurrent 
                    ? 'text-emerald-700' 
                    : isCompleted 
                    ? 'text-slate-800' 
                    : 'text-slate-400'
                }`}>
                  {stage.label}
                </span>
              </div>

              <div>
                {isCurrent ? (
                  <span className="text-[8px] font-black bg-[#7CC242]/10 text-[#7CC242] border border-[#7CC242]/20 px-2 py-0.5 rounded uppercase font-mono tracking-wide">
                    Active
                  </span>
                ) : isCompleted ? (
                  <span className="text-[8px] font-bold bg-slate-150 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">
                    Done
                  </span>
                ) : (
                  <span className="text-[8px] font-bold bg-slate-50 text-slate-350 border border-slate-100 px-2 py-0.5 rounded uppercase font-mono">
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
