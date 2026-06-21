import React from 'react';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const reviews = [
    {
      name: 'Simon Burns',
      quote: "The Jaguar F-Pace is amazing and I'm so thankful for Lee helping me out. Would highly recommend!"
    },
    {
      name: 'Simon Burns',
      quote: "The Jaguar F-Pace is amazing and I'm so thankful for Lee helping me out. Would highly recommend!"
    },
    {
      name: 'Simon Burns',
      quote: "The Jaguar F-Pace is amazing and I'm so thankful for Lee helping me out. Would highly recommend!"
    }
  ];

  return (
    <section className="bg-white py-12 relative overflow-hidden text-slate-900 border-t border-gray-100" id="driver-testimonials-section">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="relative max-w-[1100px] mx-auto px-6 z-10 space-y-8">
        <div className="text-center">
          <h2 className="font-sans font-[700] text-[22px] md:text-[28px] tracking-tight text-[#0B1320]">
            Customer reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-22">
          {reviews.map((r, index) => (
            <div 
              key={index} 
              className="bg-white p-6 sm:py-8 sm:px-6 min-h-[200px] rounded-2xl flex flex-col justify-start space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-sans font-extrabold text-[15px] sm:text-[16px] text-black">
                  {r.name}
                </span>
                <div className="flex text-[#7CC242] gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current stroke-none" />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed font-sans font-medium text-left">
                {r.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

