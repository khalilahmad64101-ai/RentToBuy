import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the Rent-to-Buy setup work?',
      a: 'You make steady weekly rental contributions over a specified duration (typically 12 - 36 months). A portion of each payment serves as auto equity. Once your contract duration successfully finishes, you acquire full registered ownership of the vehicle!'
    },
    {
      q: 'Do you charge extra for routine vehicle servicing?',
      a: 'Not at all! Standard servicing routines, oil refreshes, tyre wear monitoring, MOT schedules, and major manufacturer repairs are fully organized and sponsored by our agency so you can focus on driving.'
    },
    {
      q: 'What driver criteria do you check in underwriting?',
      a: 'We require a valid UK photocard driving licence and two recent utility statements proving your Manchester or surrounding area address. We review bank earnings viability instead of punishing historical minor defaults.'
    }
  ];

  const handleToggle = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <section className="space-y-8 font-sans" id="explore-catalog-faqs">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <HelpCircle className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
          Quick queries answered about dynamic car licensing, custom deposits, and weekly dues.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-6 space-y-3">
        {faqs.map((faq, idx) => {
          const isOpened = activeFaq === idx;
          return (
            <div 
              key={idx} 
              className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-slate-300 transition-all cursor-pointer"
              onClick={() => handleToggle(idx)}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans font-black text-xs sm:text-sm text-slate-950">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-450 transition-transform ${isOpened ? 'rotate-180 text-indigo-600' : ''}`} />
              </div>
              
              <div className={`mt-3 text-xs text-slate-500 leading-relaxed font-sans overflow-hidden transition-all duration-300 ${
                isOpened ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {faq.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
