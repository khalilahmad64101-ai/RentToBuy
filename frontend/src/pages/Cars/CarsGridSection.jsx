import React from 'react';
import { Loader } from '../../components/ui/Loader';
import { SlidersHorizontal } from 'lucide-react';
import { CarCard } from '../../components/cars/CarCard';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </section>
  );
}
