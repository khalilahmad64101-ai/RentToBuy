import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Info } from 'lucide-react';

export function ActiveLeaseSection({
  applications,
  selectedApp,
  setSelectedApp,
  setDocAppId,
  setActiveTab,
  renderStatusBadge,
  getStepDescription,
  getImageUrl
}) {
  return (
    <div className="space-y-4">
      {/* Split details if selected application page is active */}
      {selectedApp ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-5 animate-fade-in relative text-left">
          
          {/* Back link */}
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#1F3F7A]">Application Underwriting Record Folder</span>
            <button 
              onClick={() => setSelectedApp(null)}
              className="text-xs font-black text-slate-500 hover:text-slate-900 transition flex items-center border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-black tracking-tight text-slate-900 font-sans">{selectedApp.carName}</h3>
            <span className="block text-[10px] text-slate-450 font-mono">Reference Folder ID: {selectedApp.id} • Posted on {selectedApp.dateApplied}</span>
          </div>

          {/* Status card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-sans">Lease Stage Assessment</span>
              {renderStatusBadge(selectedApp.status, selectedApp.step)}
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#7CC242] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${Math.round((selectedApp.step / 8) * 100)}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 leading-snug">
              <b>Current Stage:</b> {getStepDescription(selectedApp.step, selectedApp.status)}
            </p>
          </div>

          {/* Submitted Driver Credentials Files */}
          <div className="space-y-3 pt-2">
            <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-wider font-sans">Driver Credentials Files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Driving Licence (Front)', url: selectedApp.applyDetails?.drivingLicence },
                { label: 'Proof of Address', url: selectedApp.applyDetails?.addressProof },
                { label: 'Selfie Photo', url: selectedApp.applyDetails?.selfieWithId }
              ].map((doc, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between space-y-2">
                  <span className="block font-sans font-bold text-xs text-gray-800 truncate">{doc.label}</span>
                  <div className="w-full h-20 bg-slate-200 rounded-lg overflow-hidden relative group flex items-center justify-center">
                    {doc.url ? (
                      <>
                        <img src={getImageUrl(doc.url)} alt={doc.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={getImageUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="p-1 px-2 rounded bg-white text-slate-900 font-bold text-[9px] uppercase shadow-xs">
                            View Full
                          </a>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 text-[10px] font-mono">Not Uploaded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Annotation block */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-sans flex items-center">
              <Info className="w-3.5 h-3.5 text-indigo-650 mr-1.5" />
              Office Underwriter Note
            </h4>
            <p className="text-slate-650 leading-relaxed font-sans text-xs">
              "References matched successfully with the UK DVLA drivers database. Approved subject to lease downpayment security fee."
            </p>
          </div>

        </div>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="text-left py-1">
            <h3 className="font-sans font-black text-slate-900 text-sm uppercase tracking-wider">My Active Applications</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans font-bold uppercase tracking-wider">Follow standard status milestones</p>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white border border-slate-100 text-center py-12 px-4 rounded-xl space-y-4">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-gray-800">No underwriting applied folders found.</h4>
              <Link to="/apply">
                <button className="bg-[#7CC242] text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition">
                  Select a Car and Apply Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4" id="user-applications-list">
              {applications.map((app) => (
                <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#1F3F7A]">Application Status</span>
                    <span className="bg-amber-100 text-amber-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full uppercase">
                      {app.status || "Under Review"}
                    </span>
                  </div>

                  {/* Progress Bar (A beautiful visual indicator or stage description) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span>Progress</span>
                      <span>{Math.round((app.step / 8) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7CC242] rounded-full" style={{ width: `${Math.round((app.step / 8) * 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Car Selected & Submitted Date */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Car Selected</span>
                      <span className="text-sm font-black text-slate-800 uppercase block mt-0.5">{app.carName || "TESLA MODEL 3"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Submitted Date</span>
                      <span className="text-sm font-black text-slate-800 block mt-0.5">{app.dateApplied || "12 Jun 2026"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button 
                      onClick={() => {
                        setDocAppId(app.id);
                        setActiveTab('documents');
                      }}
                      className="w-full h-10 text-xs font-black uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center"
                    >
                      Upload Documents
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedApp(app);
                      }}
                      className="w-full h-10 text-xs font-black uppercase tracking-wider bg-[#7CC242] hover:bg-[#6db334] text-white rounded-xl shadow-2xs transition duration-150 cursor-pointer flex items-center justify-center"
                    >
                      Track Progress
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
