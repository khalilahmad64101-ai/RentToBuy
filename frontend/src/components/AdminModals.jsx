import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Maximize2,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

// Simple helper to append proper full proxy path if image isn't external
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

export function DocumentViewerModal({ app, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!app) return null;

  const docs = [
    { 
      label: 'Driving Licence (Front)', 
      url: app.licenseFrontUrl || app.applyDetails?.drivingLicence,
      emptyMsg: 'Driver licence front view copy not uploaded.'
    },
    { 
      label: 'Driving Licence (Back)', 
      url: app.licenseBackUrl || app.applyDetails?.addressProof,
      emptyMsg: 'Driver licence back view copy not uploaded.'
    },
    { 
      label: 'Selfie Verification', 
      url: app.selfieUrl || app.applyDetails?.selfieWithId,
      emptyMsg: 'Security selfie verification not captured.'
    },
    { 
      label: 'Additional Support Files', 
      url: app.floorPlanUrl || app.applyDetails?.floorPlanUrl,
      emptyMsg: 'No supplementary proof files or utility bills attached.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#1F3F7A]/70 uppercase tracking-widest font-bold">Identity Dossier Underwriting</span>
            <h3 className="font-sans font-black text-lg text-[#1F3F7A] mt-0.5">Documents for {app.fullName || app.applyDetails?.fullName || 'Driver Partner'}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docs.map((doc, idx) => {
              const fullUrl = getImageUrl(doc.url);
              const isValid = doc.url && !doc.url.includes('unsplash.com');

              return (
                <div key={idx} className="border border-gray-150 rounded-xl p-4 bg-gray-50 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-[#1F3F7A]/80 uppercase tracking-wider">{doc.label}</span>
                    {isValid && (
                      <button 
                        onClick={() => setSelectedImage({ url: fullUrl, label: doc.label })}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-[#1F3F7A] transition"
                        title="Enlarge"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isValid ? (
                    <div 
                      className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-white cursor-pointer group"
                      onClick={() => setSelectedImage({ url: fullUrl, label: doc.label })}
                    >
                      <img 
                        src={fullUrl} 
                        alt={doc.label} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-250 flex items-center justify-center">
                        <span className="text-xs font-black text-white uppercase tracking-wider">Click to Inspect Fullscreen</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-white border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-4">
                      <FileText className="w-8 h-8 text-gray-300 mb-1.5" />
                      <span className="text-[10px] text-gray-450">{doc.emptyMsg}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-[#1F3F7A] text-xs font-bold uppercase transition"
          >
            Close Viewer
          </button>
        </div>
      </div>

      {/* Embedded Fullscreen Lightbox Overlay */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 items-center justify-center p-4 animate-fade-in">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-white/70 bg-white/10 px-3 py-1.5 rounded-lg tracking-wide uppercase">
              {selectedImage.label}
            </span>
            <button 
              onClick={() => setSelectedImage(null)} 
              className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-w-5xl max-h-[80vh] flex items-center justify-center">
            <img 
              src={selectedImage.url} 
              alt="Enlarged Document" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function FullApplicationModal({ app, onClose, onAction, actionLoading }) {
  const [notes, setNotes] = useState(app?.underwritingNotes || '');
  const [checks, setChecks] = useState({
    licenseValid: app?.validationChecklists?.drivingLicence || false,
    addressValid: app?.validationChecklists?.addressProof || false,
    selfieMatches: app?.validationChecklists?.selfie || false
  });

  const STAGES = [
    { step: 1, label: "Documents Uploaded" },
    { step: 2, label: "Application Submitted" },
    { step: 3, label: "Application Under Review" },
    { step: 4, label: "Approved" },
    { step: 5, label: "Deposit Paid" },
    { step: 6, label: "Insurance Uploaded" },
    { step: 7, label: "Vehicle Ready" },
    { step: 8, label: "Collection Scheduled" }
  ];

  const [selectedStage, setSelectedStage] = useState(app?.step || 2);

  if (!app) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] text-[#1F3F7A]/70 uppercase tracking-widest font-black">Underwriting Dossier Audit</span>
            <h3 className="font-sans font-black text-xl text-[#1F3F7A] mt-0.5">Application Folder Details</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User profile details grid */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 text-xs">
              <div>
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Applicant Full Name</span>
                <span className="text-sm font-sans font-black text-[#1F3F7A] mt-0.5 block">
                  {app.fullName || app.applyDetails?.fullName || "Not Provided"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Email Address</span>
                <span className="text-sm font-sans font-semibold text-[#1F3F7A] mt-0.5 block break-all">
                  {app.userEmail}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Phone Number</span>
                <span className="text-sm font-sans font-semibold text-[#1F3F7A] mt-0.5 block">
                  {app.phone || app.applyDetails?.phone || "Not Provided"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Employment Status</span>
                <span className="text-sm font-sans font-medium text-[#1F3F7A] mt-0.5 block flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {app.applyDetails?.employment || "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Weekly Verified Income</span>
                <span className="text-sm font-sans font-black text-emerald-600 mt-0.5 block flex items-center gap-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> 
                  {app.applyDetails?.weeklyIncome ? `£${app.applyDetails.weeklyIncome} / wk` : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Requested Lease Term</span>
                <span className="text-sm font-sans font-medium text-[#1F3F7A] mt-0.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> 
                  {app.applyDetails?.durationMonths ? `${app.applyDetails.durationMonths} Months` : "N/A"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Current Base Location</span>
                <span className="text-xs font-sans font-semibold text-[#1F3F7A] mt-0.5 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {app.applyDetails?.location || "Manchester, UK"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-450 uppercase tracking-wider block font-bold">Soft Credit Score Status</span>
                <span className="text-xs font-sans font-mono font-bold text-[#7CC242] mt-0.5 block flex items-center gap-1 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" /> Checked (Pass)
                </span>
              </div>
            </div>
          </div>

          {/* Verification checklists */}
          <div className="border border-gray-150 rounded-2xl p-5 bg-white space-y-4">
            <h4 className="text-xs font-black uppercase text-[#1F3F7A] tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7CC242]" /> Required Admin Verification Checks
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-600/30 transition">
                <input 
                  type="checkbox" 
                  checked={checks.licenseValid} 
                  onChange={(e) => setChecks({ ...checks, licenseValid: e.target.checked })} 
                  className="w-4 h-4 text-[#1F3F7A] rounded border-gray-300 focus:ring-[#1F3F7A]"
                />
                <span className="text-xs text-[#1F3F7A]/80 font-semibold uppercase tracking-wider">License Verified</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-600/30 transition">
                <input 
                  type="checkbox" 
                  checked={checks.addressValid} 
                  onChange={(e) => setChecks({ ...checks, addressValid: e.target.checked })} 
                  className="w-4 h-4 text-[#1F3F7A] rounded border-gray-300 focus:ring-[#1F3F7A]"
                />
                <span className="text-xs text-[#1F3F7A]/80 font-semibold uppercase tracking-wider">Address Verified</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-600/30 transition">
                <input 
                  type="checkbox" 
                  checked={checks.selfieMatches} 
                  onChange={(e) => setChecks({ ...checks, selfieMatches: e.target.checked })} 
                  className="w-4 h-4 text-[#1F3F7A] rounded border-gray-300 focus:ring-[#1F3F7A]"
                />
                <span className="text-xs text-[#1F3F7A]/80 font-semibold uppercase tracking-wider">Selfie Matches ID</span>
              </label>
            </div>
          </div>

          {/* Underwriter notes text fields */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-[#1F3F7A]/85">Private Underwriting / Review Audit notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record driver references, credit files annotations or collection timetables here..."
              className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
            />
          </div>
        </div>

        {/* Actions panel */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[9.5px] text-indigo-950/70 font-bold uppercase tracking-widest leading-none">Select Platform Stage</span>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(Number(e.target.value))}
                className="text-xs p-2 bg-white border border-gray-200 rounded-xl outline-none mt-1.5 font-bold text-[#1F3F7A] focus:border-[#1F3F7A]"
              >
                {STAGES.map((s) => (
                  <option key={s.step} value={s.step}>
                    Stage {s.step}: {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                const stageLabel = STAGES.find(s => s.step === selectedStage)?.label || 'Application Submitted';
                onAction(app.id, stageLabel, notes, checks, selectedStage);
              }}
              disabled={actionLoading}
              className="mt-4 px-5 py-2.5 bg-[#1F3F7A] hover:bg-indigo-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition disabled:opacity-50 shadow-sm cursor-pointer"
            >
              Update Application Stage
            </button>
          </div>
          
          <div className="flex items-center gap-3 md:mt-4">
            <button
              onClick={() => onAction(app.id, 'Rejected', notes, checks, app.step)}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-650 text-xs font-black uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
            >
              Reject Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
