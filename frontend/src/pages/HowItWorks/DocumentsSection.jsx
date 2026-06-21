import React from 'react';

export function DocumentsSection({ requiredDocs }) {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-gray-150" id="required-documents-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#1F3F7A] tracking-tight uppercase">
            Documents You'll Need
          </h2>
          <div className="h-1.5 w-24 bg-[#7CC242] mx-auto my-4 rounded-full"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
            Prepare these standard items beforehand for an instant underwriting turn-around.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {requiredDocs.map((doc, idx) => {
            const DocIcon = doc.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col p-8 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-100 text-left"
              >
                <div className="w-12 h-12 bg-[#7CC242]/10 text-[#7CC242] rounded-xl flex items-center justify-center mb-6 font-bold">
                  <DocIcon className="w-6 h-6 stroke-[2]" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase text-[#1F3F7A] mb-2 tracking-tight flex items-center gap-1.5">
                      <span className="text-[#7CC242] font-black font-mono">✓</span> {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {doc.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
