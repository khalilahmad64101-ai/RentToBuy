import React from 'react';
import { ChevronRight } from 'lucide-react';

export function WhyContactSection({ scrollToSection }) {
  return (
    <section className="bg-white py-16 border-b border-gray-100" id="why-contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-[10px] font-black text-[#7CC242] uppercase tracking-widest block font-mono">ARE TEAM ATTENTION</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none font-sans">
            Why Contact Us
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
            We guide you transparently through are complete fleet inventory and UK-wide underwriting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Vehicle Enquiries',
              desc: 'Get help finding the right vehicle for your needs. Choose from eco-friendly hybrids and premier comfort models.',
              colorClass: 'border-[#7CC242]'
            },
            {
              title: 'Application Support',
              desc: 'Need assistance with your application or documents? Are support agents verify uploaded files within hours.',
              colorClass: 'border-indigo-500'
            },
            {
              title: 'Customer Support',
              desc: 'Speak with our team for general enquiries, weekly payments configuration, or bespoke Northwest services guidance.',
              colorClass: 'border-slate-800'
            }
          ].map((card, idx) => (
            <div 
              key={idx} 
              className={`p-6 bg-slate-50 border-t-4 ${card.colorClass} border-x border-b border-gray-150 rounded-b-2xl rounded-t-lg transition-transform hover:-translate-y-1 duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-2 text-left">
                <h3 className="font-sans font-black text-sm text-slate-900">{card.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{card.desc}</p>
              </div>
              <div 
                className="pt-4 flex items-center text-indigo-600 text-xs font-semibold uppercase tracking-wider group cursor-pointer" 
                onClick={() => scrollToSection('contact-form-section')}
              >
                <span>Get support</span>
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
