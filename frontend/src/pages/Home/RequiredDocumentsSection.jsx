import React from 'react';
import { Contact, MapPin, Camera, Briefcase } from 'lucide-react';

export function RequiredDocumentsSection() {
  const documentsList = [
    {
      title: 'Driving Licence',
      desc: 'Valid photo-card UK driving licence (both front and back). Includes active PCO license context if applicable.',
      icon: Contact
    },
    {
      title: 'Proof Of Address',
      desc: 'Two separate utility statements or bank papers issued within the last 3 months verifying address details.',
      icon: MapPin
    },
    {
      title: 'Photo ID',
      desc: 'Biometric selfie scan matched with your photocard for instant digital verification with zero delays.',
      icon: Camera
    },
    {
      title: 'Employment Information',
      desc: 'Consistent driver earning invoices, direct transaction histories, or proof of active gig partner profile.',
      icon: Briefcase
    }
  ];

  return (
    <section className="bg-white py-12 border-y border-gray-100 font-sans" id="home-required-documents">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono">Verification Checklist</span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-none sm:text-4xl">
            Required Documents
          </h2>
          <p className="text-sm text-gray-500 font-sans leading-relaxed font-light">
            We make the rent-to-buy boarding checklist simple. Prepare these items to get verified and approved within days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documentsList.map((doc, index) => {
            const DocIcon = doc.icon;
            return (
              <div 
                key={index} 
                className="p-6 bg-slate-50/60 rounded-2xl border border-gray-150/80 hover:border-indigo-400 group transition-all duration-300 hover:shadow-lg flex flex-col space-y-4"
              >
                <div className="p-3 bg-white text-slate-700 group-hover:bg-[#111A2E] group-hover:text-[#CDA275] rounded-xl self-start transition-all duration-300 shadow-xs">
                  <DocIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1 bg-transparent">
                  <h4 className="font-sans font-black text-slate-900 text-sm">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-505 font-sans leading-relaxed font-light">
                    {doc.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
