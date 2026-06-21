import React from 'react';

export function MapSection() {
  return (
    <section className="bg-slate-50 py-16" id="location-map">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono">VISIT US</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
            Visit Our Office
          </h2>
          <p className="text-xs text-gray-500 font-light">
            We are situated at Piccadilly Business Centre, Aldow Enterprise Park, Manchester, M12 6AE.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-150">
          {/* Embedded interactive Google Map focused precisely on Aldow Enterprise Park Manchester */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.8870197771727!2d-2.2132338!3d53.4704981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bb19460dfbf31%3A0xe5c165fdecda3c8d!2sPiccadilly%20Business%20Centre!5e0!3m2!1sen!2suk!4v1717142400000!5m2!1sen!2suk" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="R2Buy Piccadilly Business Centre Manchester Map Location"
            className="w-full h-[400px] sm:h-[450px]"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
