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
    <section className="bg-white pt-16 relative overflow-hidden text-slate-900 border-t border-gray-100" id="driver-testimonials-section">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-550/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 z-10 space-y-6">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-750 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-100/80">
            Voice of Our Members
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-slate-950">
            Testimonials From Drivers
          </h2>
          <p className="text-sm text-slate-550 font-sans leading-relaxed">
            We make vehicle ownership stress-free. See how independent contractors, private hirers, and daily commutants found their true path to auto ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className="relative bg-white border border-gray-150 p-4 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 hover:border-indigo-400 hover:bg-slate-50/20 transition-all duration-300 hover:shadow-xl group"
            >
              <div className="absolute top-0 left-8 right-8 h-1 bg-indigo-650 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-500 gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current stroke-none" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-indigo-100 group-hover:text-indigo-200 transition-colors duration-300" />
                </div>

                <p className="text-slate-605 text-slate-600 text-xs sm:text-xs leading-relaxed font-sans italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-5">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-sans font-black text-sm text-slate-900 group-hover:text-indigo-650 transition-colors leading-none">
                    {t.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">
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
