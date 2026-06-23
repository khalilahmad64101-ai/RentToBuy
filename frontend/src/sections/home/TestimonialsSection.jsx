import React from 'react';

export function TestimonialsSection() {
  const reviews = [
    {
      name: 'Simon Burns',
      quote: "The Jaguar F-Pace is amazing and I'm so thankful for Lee helping me out. Would highly recommend!"
    },
    {
      name: 'Mike Chan',
      quote: "Great product, easy service, highly recommend!"
    },
    {
      name: 'Sue Murray',
      quote: "Too easy... So happy with my car."
    }
  ];

  // 4. CUSTOMER REVIEWS SECTION - Clean light/white container exactly like the attachment
  return (
    <section className="w-full relative -mt-16 sm:mt-0 bg-transparent z-20 px-4" id="customer-benefits-section">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-5">
          <h2 className="font-sans font-[900] text-xl sm:text-[2.25rem] text-[#132c18] tracking-tight relative inline-block">
            Customer reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 max-w-5xl mx-auto">
          {reviews.map((r, index) => (
            <div 
              key={index}
              className="bg-white text-slate-900 rounded-[1rem] py-6 px-4 text-left shadow-[0_6px_22px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col justify-start transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3.5 gap-2">
                <span className="font-[900] text-slate-800 text-lg sm:text-xl tracking-tight truncate">{r.name}</span>
                <div className="flex gap-0.5 text-[#3AA51D] text-[15px] select-none shrink-0 font-bold">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p className="text-[13px] sm:text-[15px] text-slate-600 font-bold leading-relaxed">
                {r.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

