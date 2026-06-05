import React from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/ui/Loader';
import { SlidersHorizontal, ShieldCheck, Check } from 'lucide-react';

export function CarsGridSection({ filteredCars, loading, resetFilters }) {
  return (
    <section id="fleet-cars-grid-main" className="scroll-mt-6 font-sans">
      {loading ? (
        <div className="py-24">
          <Loader label="Synchronizing real-time vehicle databases and fleet records..." />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200" id="empty-fleet-trigger">
          <SlidersHorizontal className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h3 className="font-sans font-black text-lg text-gray-950">No Matching Vehicles Found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
            We periodically restock units. Try clearing your search keyword, adjusting price parameters, or selecting different fuel options.
          </p>
          <div className="pt-4">
            <button 
              onClick={resetFilters}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Reset Active Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => {
            const weeklyVal = car.weeklyRate || car.price || 60;
            const monthlyVal = weeklyVal * 4;
            const economyVal = car.economy || '64 MPG';
            
            const yearVal = car.calcYear;
            const milesVal = car.calcMileage;
            const featuresVal = car.features || ['ULEZ Compliant', 'Bluetooth Connectivity', 'Cruise Control', 'Parking Sensors'];

            return (
              <div 
                key={car.id} 
                className="bg-white rounded-3xl border border-gray-150/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group relative" 
                id={`carcard-explore-${car.id}`}
              >
                {/* Image frame */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden shrink-0">
                  <img 
                    src={car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'} 
                    alt={car.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform duration-500 group-hover:scale-103"
                  />
                  
                  {/* Active statuses badge */}
                  <span className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-xs ${
                    car.calcStatus === 'Available' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {car.calcStatus === 'Available' ? 'In Stock - Ready' : 'Under Review'}
                  </span>

                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#CDA275]" />
                    <span>Servicing Cover Checked</span>
                  </div>
                </div>

                {/* Content text layout code */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-sans font-black text-base text-gray-950 tracking-tight leading-tight group-hover:text-indigo-650 transition-colors">
                        {car.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-sans font-light">
                        {car.model || 'Standard Executive Trim'}
                      </p>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-4 gap-1.5 py-3 border-y border-gray-100 text-[10px] text-slate-500 font-mono">
                      <div className="flex flex-col items-center justify-center text-center p-1 bg-slate-50 rounded-lg">
                        <span className="font-bold text-slate-800">{yearVal}</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Year</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center p-1 bg-slate-50 rounded-lg">
                        <span className="font-bold text-slate-805 truncate max-w-full">{milesVal.split(' ')[0]}</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Miles</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center p-1 bg-slate-50 rounded-lg">
                        <span className="font-bold text-slate-800">{car.calcFuel}</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Fuel</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center p-1 bg-slate-50 rounded-lg">
                        <span className="font-bold text-slate-800 text-[9px] truncate">{car.calcTrans}</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Gear</span>
                      </div>
                    </div>

                    {/* Highlights list wrapper */}
                    <div className="space-y-1.5 pt-1">
                      {featuresVal.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[2.5]" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-gray-100 mt-auto">
                    {/* Pricing Box representation */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Predictable Amount</span>
                        <span className="text-lg font-black text-slate-900 leading-none">
                          £{monthlyVal} <span className="text-[10px] text-slate-400 font-normal">/ Month</span>
                        </span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Escrow Deposit</span>
                        <span className="text-xs font-black text-indigo-700 block mt-0.5">
                          £{car.calcDeposit} Fixed
                        </span>
                      </div>
                    </div>

                    {/* Interactive Buttons footer */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <Link to={`/cars/${car.id}`} className="block">
                        <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                          View Details
                        </button>
                      </Link>
                      <Link to={`/apply?carId=${car.id}`} className="block">
                        <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/5 active:scale-98 cursor-pointer">
                          Apply Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
