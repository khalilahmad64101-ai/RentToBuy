import React from 'react';
import { MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';

export function InfoSection() {
  return (
    <section className="bg-white py-16 border-b border-gray-100" id="contact-info-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Office Address, Contact Numbers, Email */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono mb-1">HQ Coordination</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Our Office</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Office Address Card */}
              <div className="bg-slate-50 border border-gray-150 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2.5 text-slate-800 mb-4 pb-3 border-b border-gray-200/60">
                  <MapPin className="w-5 h-5 text-[#7CC242]" />
                  <h3 className="font-extrabold text-sm text-slate-900 font-mono">Office Address</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed font-light">
                  <strong className="block text-slate-900 font-extrabold text-sm mb-1">R2Buy.com</strong>
                  <span>Piccadilly Business Centre</span>
                  <span className="block">Aldow Enterprise Park</span>
                  <span className="block">Manchester</span>
                  <span className="block">M12 6AE</span>
                  <span className="block font-semibold text-slate-800">United Kingdom</span>
                </div>
              </div>

              {/* Contact Numbers & Email Card */}
              <div className="bg-slate-50 border border-gray-150 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2.5 text-slate-800 mb-4 pb-3 border-b border-gray-200/60">
                    <Phone className="w-5 h-5 text-[#7CC242]" />
                    <h3 className="font-extrabold text-sm text-slate-900 font-mono">Contact Numbers</h3>
                  </div>
                  <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                      <span className="font-semibold text-slate-500">Landline:</span>
                      <a href="tel:01613689635" className="font-extrabold text-indigo-600 hover:underline">0161 368 9635</a>
                    </div>
                    <div className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                      <span className="font-semibold text-slate-500">Mobile:</span>
                      <a href="tel:07758313276" className="font-extrabold text-indigo-600 hover:underline">07758 313276</a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200/60">
                  <div className="flex items-center space-x-2.5 text-slate-850 mb-2">
                    <Mail className="w-4 h-4 text-[#7CC242]" />
                    <span className="font-extrabold text-xs text-slate-900 font-mono">Email Communications</span>
                  </div>
                  <div className="text-xs">
                    <a href="mailto:info@r2buy.com" className="font-black text-indigo-600 hover:underline">info@r2buy.com</a>
                    <span className="text-[9px] text-orange-600 block mt-1 font-mono italic">
                      (Placeholder — client se actual email confirm kar lena.)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Business Hours */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-8 shadow-xl border border-slate-850 relative overflow-hidden self-stretch flex flex-col justify-between">
            {/* Subtle backdrop mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_24px]"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-2 text-[#7CC242]">
                <Clock className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">Live Operations Timetable</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Business Hours</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Our professional Manchester dispatch desk is ready to organize your documents review and help coordinate vehicle pickups.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-xs text-slate-300 font-medium">Monday — Friday</span>
                  <span className="text-xs font-black text-white">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-xs text-slate-300 font-medium">Saturday</span>
                  <span className="text-xs font-black text-[#7CC242]">10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-450 font-medium">Sunday</span>
                  <span className="text-xs font-black text-red-400">Closed</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-white/5 text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nationwide UK service coordination support.</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
