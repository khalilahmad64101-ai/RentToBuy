import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ActivitySection({
  applications,
  docAppId,
  setDocAppId,
  licenseUrl,
  setLicenseUrl,
  selfieUrl,
  setSelfieUrl,
  addressUrl,
  setAddressUrl,
  docMessage,
  docLoading,
  handleDocumentUpdate
}) {
  return (
    <div className="space-y-6">
      
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="font-sans font-black text-slate-900 text-base leading-none">Underwriting Driving Identity & Credentials</h3>
          <p className="text-xs text-slate-500 mt-1 font-sans">Verify, replace or download your currently uploaded credentials. Underwriters require clear files to authorize Heathrow dispatch.</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">You must file an underwriting lease application before managing or re-uploading driver documents files.</p>
            <Link to="/apply">
              <Button variant="primary">Apply First</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Current Files list on left */}
            <div className="lg:col-span-7 space-y-5">
              <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans">Current Folder Uploads</h4>

              <div className="space-y-4">
                {[
                  { 
                    label: 'UK Driving Licence Copy', 
                    field: 'drivingLicence',
                    url: licenseUrl || "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=800",
                    desc: 'Full colored photograph displaying your standard driver license front face and signature.' 
                  },
                  { 
                    label: 'Proof of Address Document', 
                    field: 'addressProof',
                    url: addressUrl || "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800",
                    desc: 'Utility bills description, electricity invoices, bank statements or UK council tax bills dated past 3 months.' 
                  },
                  { 
                    label: 'Security Selfie Verification Check', 
                    field: 'selfieWithId',
                    url: selfieUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
                    desc: 'Liveness checking photograph displaying your face adjacent to your driver licence document.' 
                  }
                ].map((item, index) => (
                  <div key={index} className="border border-gray-150 rounded-2xl p-5 bg-slate-50/40 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between animate-fade-in">
                    <div className="space-y-2 max-w-sm">
                      <span className="block font-sans font-bold text-sm text-slate-900">{item.label}</span>
                      <p className="text-[11px] text-slate-450 leading-relaxed">{item.desc}</p>
                      <span className="inline-flex items-center font-bold text-[10px] text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded uppercase font-sans">
                        <Check className="w-3 h-3 mr-1" /> ACTIVE FILE PREVIEW
                      </span>
                    </div>
                    
                    <div className="shrink-0 space-y-2 w-full sm:w-auto text-center">
                      <div className="w-24 h-16 bg-slate-200 border border-slate-350 rounded-lg mx-auto overflow-hidden relative group">
                        <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-white p-1 rounded font-black text-[9px] uppercase text-slate-900">Preview</a>
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-indigo-650 hover:underline">View</a>
                        <span className="text-gray-300">•</span>
                        <a href={item.url} download className="text-[10px] font-bold text-gray-500 hover:underline">Download</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Re-upload document editor form right */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-150 rounded-2xl p-6.5 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans">Replace / Update File Links</h4>
                <p className="text-[11px] text-gray-500 mt-1">Submit clean visual replacements for underwriter reassessment desks.</p>
              </div>

              {docMessage && (
                <div className={`text-xs p-3 rounded-lg border font-medium ${
                  docMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {docMessage.text}
                </div>
              )}

              <form onSubmit={handleDocumentUpdate} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-450 uppercase font-bold tracking-wider mb-1">Select Application Link</label>
                  <select
                    value={docAppId}
                    onChange={(e) => setDocAppId(e.target.value)}
                    className="w-full text-xs font-semibold py-2 px-2.5 border border-gray-250 rounded-lg bg-white"
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>{app.carName} (ID: {app.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-455 uppercase font-bold tracking-wider mb-1">Driving Licence Photograph URL</label>
                  <input
                    type="url"
                    value={licenseUrl}
                    onChange={(e) => setLicenseUrl(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-600 font-mono"
                    placeholder="Licence visual URL coordinates..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-455 uppercase font-bold tracking-wider mb-1">Selfie Verification Photograph URL</label>
                  <input
                    type="url"
                    value={selfieUrl}
                    onChange={(e) => setSelfieUrl(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-600 font-mono"
                    placeholder="Selfie verification URL coordinates..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-455 uppercase font-bold tracking-wider mb-1">Mailing Address Proof Photograph URL</label>
                  <input
                    type="url"
                    value={addressUrl}
                    onChange={(e) => setAddressUrl(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-600 font-mono"
                    placeholder="Electricity bill / statement URL..."
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full text-xs font-bold"
                    disabled={docLoading}
                  >
                    {docLoading ? 'Updating credentials folder...' : 'Save & Overwrite Documents'}
                  </Button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
