import React from 'react';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Jameson Lee',
      role: 'PCO Partner, London',
      quote: "Rent2Buy completely changed my business! Standard UK dealerships rejected me due to minor credit history issues, but their underwriting check was stress-free. I paid my deposit, and within days I was driving my approved hybrid.",
      image: "https://admin.netlawman.com/uploads/article/original/driving-work-great-britain-uk.jpg",
    },
    {
      name: 'Madison',
      role: 'Private Lease Client',
      quote: "As an independent contractor, buying a car through conventional loans is a nightmare. This rent-to-buy lease has been absolutely seamless. Weekly payments are predictable and cover essential servicing and road maintenance too!",
      image: "https://www.leasys.com/international/uk/blog/271850/image-thumb__271850__default/new-driver%20rules.jpg",
    },
    {
      name: 'Heather',
      role: 'Courier Partner',
      quote: "Highly recommended for drivers wanting a real path to auto ownership. Excellent support desk, straightforward online dashboard, and pristine fleet quality. Driving towards full contract completion now with 100% confidence.",
      image: "https://i.guim.co.uk/img/media/ac9bb8cc6b8dad151a8d0a74ef2f272271013b7f/234_638_5244_3146/master/5244.jpg?width=1200&quality=85&auto=format&fit=max&s=3aeb009050b2b7ac85f1103af4025a79",
    }
  ];

  return (
    <section className="bg-white py-10 relative overflow-hidden text-slate-900 border-t border-gray-100" id="driver-testimonials-section">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative max-w-[1100px] mx-auto px-6 z-10 space-y-5">
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <h2 className="font-sans font-black text-xl tracking-tight text-[#0B1320] uppercase">
            Reviews
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
            Highly recommended for drivers wanting a path to ownership
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className="relative bg-white border border-gray-150 p-4 sm:p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-[#8ED34A] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-500 gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current stroke-none" />
                    ))}
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed font-sans font-medium italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-sans font-extrabold text-xs text-[#0B1320] transition-colors leading-none">
                    {t.name}
                  </h4>
                  <span className="text-[9px] text-slate-450 font-semibold block mt-1">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
