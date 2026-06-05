import React, { useState } from 'react';
import { HeroSection } from '../components/layout/HeroSection';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Mail, Phone } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const entries = [
    {
      q: 'What does "Rent-to-Buy" actually mean?',
      a: 'Rent-to-Buy is an alternative path to car ownership. Instead of acquiring severe structural loans or paying massive cash downpayments, you lease a vehicle from our fleet on simple, predictable weekly dues. A portion of every weekly payment accumulates as positive contribution credit towards acquiring the physical title of the vehicle after your term (12 to 24 months) is completed.'
    },
    {
      q: 'Do you run exhaustive or hard credit history checks?',
      a: 'No. Our underwriters perform soft verify review checks. We focus heavily on verifying consistent weekly income profiles, current employment contracts, and valid UK driver licencing. We believe vehicle access should be barrier-free for self-employed professionals, contractors, and PCO drivers with historical default hurdles.'
    },
    {
      q: 'What happens if the vehicle requires a major mechanical repair?',
      a: 'You are completely covered! Your weekly rates include manufacturer powertrain warranties, routine servicing intervals, routine road taxes, and physical MOT verification handles. You simply coordinate with our maintenance dispatch desks, book into a local certified center, and we cover the bill.'
    },
    {
      q: 'Can I terminate my leased agreement early?',
      a: 'Absolutely. We offer flexible terms. You can request returning the vehicle or changing your vehicle models with a simple 30-day disclosure notice window. Accumulated positive contribution balance credits are catalogued on your profile.'
    },
    {
      q: 'How do I complete weekly contributions payments?',
      a: 'Weekly payments can be securely simulated and synced directly in your Driver Dashboard under the "Simulate Lease Sandbox" panel. We accept standard UK debit cards and direct debit mandates.'
    }
  ];

  return (
    <div className="space-y-0 pb-16" id="faq-accordions-view">
      <HeroSection
        title="FIND YOUR ANSWERS INSTANTLY TODAY"
        subtitle="QUICK SECURE SUPPORT KNOWLEDGE DESK"
        badge="FAQS & KNOWLEDGE DESK"
        showCta={false}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Accordions Container */}
      <div className="space-y-4">
        {entries.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white border rounded-xl overflow-hidden transition-all shadow-2xs border-gray-150"
              id={`faq-item-${index}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex justify-between items-center p-5 text-left font-sans font-semibold text-sm text-gray-900 focus:outline-none hover:bg-gray-50/50"
              >
                <span>{item.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-650 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              
              {isOpen && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-650 leading-relaxed font-sans">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact desk callout */}
      <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans font-medium text-indigo-700 mt-10" id="faq-cta">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <p>
            Still have individual questions or have commercial courier fleet needs? <br />
            Our brokerage underwriting processing desks are active 24/7.
          </p>
        </div>
        <div className="flex space-x-4 shrink-0 font-bold">
          <a href="tel:01613689635" className="flex items-center space-x-1 hover:text-indigo-900">
            <Phone className="w-4 h-4" />
            <span>0161 368 9635</span>
          </a>
          <a href="mailto:support@r2buy.com" className="flex items-center space-x-1 hover:text-indigo-900">
            <Mail className="w-4 h-4" />
            <span>support@r2buy.com</span>
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}
