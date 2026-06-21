import React from 'react';
import { Upload, Bell, Download, Lock } from 'lucide-react';

export function SupportSection({
  activeTab,
  user,
  applications,
  notifications,
  
  // Payments props
  payMessage,
  payLoading,
  payAmount,
  setPayAmount,
  payMethod,
  setPayMethod,
  selectedAppForPayment,
  setSelectedAppForPayment,
  handleSimulatePayment,

  // Insurance props
  insuranceUploadSuccess,
  insuranceFile,
  setInsuranceFile,
  insuranceUploading,
  setInsuranceUploading,
  setInsuranceUploadSuccess,
  api,
  syncDriverData,

  // Profile props
  profileMessage,
  profileLoading,
  profileName,
  setProfileName,
  profilePhone,
  setProfilePhone,
  profileAddress,
  setProfileAddress,
  profilePassword,
  setProfilePassword,
  profileConfirmPassword,
  setProfileConfirmPassword,
  handleProfileSettingsSubmit
}) {
  return (
    <>
      {/* TAB 4: PAYMENTS LEDGER */}
      {activeTab === 'payments' && (
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 text-left">
            <div>
              <span className="block text-[10px] uppercase font-black tracking-widest text-[#1F3F7A]">Outstanding Deposit</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-2 font-mono">
                £250
              </div>
            </div>

            {payMessage && (
              <div className={`text-xs p-3 rounded-xl border font-semibold ${
                payMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-red-50 text-red-700 border-red-150'
              }`}>
                {payMessage.text}
              </div>
            )}

            {applications.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-550">
                Please apply for a lease stock vehicle to prepare booking downpayment payments.
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-4">
                
                {/* Auto selector helper for application link */}
                <div className="hidden">
                  <select
                    value={selectedAppForPayment}
                    onChange={(e) => setSelectedAppForPayment(e.target.value)}
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>{app.carName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Card Number</label>
                  <input
                    type="text"
                    className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-[#7CC242] focus:outline-none"
                    placeholder="1234 5678 9000 8888"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Expiry</label>
                    <input
                      type="text"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-[#7CC242] focus:outline-none"
                      placeholder="MM / YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">CVV</label>
                    <input
                      type="password"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-[#7CC242] focus:outline-none"
                      placeholder="•••"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={payLoading}
                  className="w-full h-11 bg-[#7CC242] hover:bg-[#6db334] text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center mt-3 shadow-xs"
                >
                  {payLoading ? 'Processing secure clearance...' : 'Pay Deposit'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* TAB 5: MOTOR INSURANCE SECTION */}
      {activeTab === 'insurance' && (
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 text-left">
            <div>
              <span className="block text-[10px] uppercase font-black tracking-widest text-[#1F3F7A]">Insurance Document</span>
              <h3 className="text-base font-black tracking-tight text-slate-900 font-sans mt-0.5">Upload Insurance</h3>
            </div>

            {insuranceUploadSuccess && (
              <div className="text-xs p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-150 font-semibold animate-fade-in">
                ✓ Insurance document uploaded successfully!
              </div>
            )}

            <div className="space-y-4">
              {/* Custom File Picker simulation */}
              <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition relative">
                <input
                  type="file"
                  id="insurance-file-input"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setInsuranceFile(e.target.files[0]);
                    } else {
                      setInsuranceFile({ name: 'insurance.pdf' }); // default simulation
                    }
                  }}
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="inline-flex items-center justify-center font-sans font-black text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-3xs cursor-pointer">
                  Choose File
                </span>
              </div>

              {/* Selected File */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Selected File:</span>
                <span className="text-xs font-mono font-bold text-slate-800 break-all leading-relaxed block">
                  {insuranceFile ? insuranceFile.name : 'insurance.pdf'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInsuranceUploading(true);
                  setTimeout(() => {
                    setInsuranceUploading(false);
                    setInsuranceUploadSuccess(true);
                    const targetApp = applications[0];
                    if (targetApp && targetApp.step === 5) {
                      api.applications.updateStep(targetApp.id, 6).then(() => syncDriverData());
                    }
                  }, 1500);
                }}
                disabled={insuranceUploading}
                className="w-full h-11 bg-[#7CC242] hover:bg-[#6db334] text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center shadow-xs"
              >
                {insuranceUploading ? 'Uploading Document...' : 'Upload'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5b: INBOX NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 text-left">
            <div>
              <span className="block text-[10px] uppercase font-black tracking-widest text-[#1F3F7A]">Message Center</span>
              <h3 className="text-base font-black tracking-tight text-slate-900 font-sans mt-0.5">Inbox</h3>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400">
                  <Bell className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-0.5 px-4">
                  <h4 className="font-bold text-xs text-slate-800">Your inbox is quiet</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    When London Heathrow underwriters clear your status, alerts will appear here in real-time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[...notifications]
                  .sort((a, b) => new Date(b.createdAt || b.dateSent || 0) - new Date(a.createdAt || a.dateSent || 0))
                  .map((notif, idx) => (
                    <div key={notif.id || idx} className="border border-slate-100 bg-slate-50/40 rounded-xl p-4 space-y-2 hover:bg-slate-50 transition animate-fade-in">
                      <div className="flex justify-between items-start gap-2">
                        <strong className="block text-xs text-slate-900 font-extrabold tracking-tight leading-snug">{notif.subject}</strong>
                        <span className="text-[9px] text-slate-450 font-mono font-bold shrink-0">
                          {notif.dateSent || (notif.createdAt && new Date(notif.createdAt).toLocaleDateString()) || 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{notif.content}</p>
                      
                      {notif.attachmentUrl && (
                        <div className="pt-1.5">
                          <a 
                            href={notif.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[10px] font-black uppercase tracking-wider text-[#1F3F7A] bg-[#1F3F7A]/5 border border-[#1F3F7A]/15 hover:bg-[#1F3F7A]/10 px-3 py-1.5 rounded-lg transition"
                          >
                            <Download className="w-3 h-3 mr-1.5" /> Attachment
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: PROFILE CONFIGURATION */}
      {activeTab === 'profile' && (
        <div className="space-y-4 max-w-sm mx-auto">
          
          {/* Main Profile Info Form */}
          <form onSubmit={handleProfileSettingsSubmit} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 text-left animate-fade-in">
            <div>
              <span className="block text-[10px] uppercase font-black tracking-widest text-[#1F3F7A]">Settings</span>
              <h3 className="text-base font-black tracking-tight text-slate-900 font-sans mt-0.5">Profile</h3>
            </div>

            {profileMessage && (
              <div className={`text-xs p-3 rounded-xl border font-semibold ${
                profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-red-50 text-red-700 border-red-150'
              }`}>
                {profileMessage.text}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:border-[#7CC242] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+44 7700 900077"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:border-[#7CC242] focus:outline-none"
                />
              </div>

              <div className="hidden">
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full h-11 bg-[#7CC242] hover:bg-[#6db334] text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center shadow-xs mt-1"
            >
              {profileLoading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </form>

          {/* Separate section for password as requested "Password alag section." */}
          <form onSubmit={handleProfileSettingsSubmit} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 text-left animate-fade-in">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Password settings
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">New Password</label>
                <input
                  type="password"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-[#7CC242] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={profileConfirmPassword}
                  onChange={(e) => setProfileConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-[#7CC242] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center shadow-3xs"
            >
              {profileLoading ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>

        </div>
      )}
    </>
  );
}
