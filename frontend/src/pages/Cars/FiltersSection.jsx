import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export function FiltersSection({
  search, setSearch,
  vehicleType, setVehicleType,
  fuelType, setFuelType,
  transmission, setTransmission,
  priceRange, setPriceRange,
  availability, setAvailability
}) {
  return (
    <section className="hidden sm:block bg-white rounded-3xl border border-gray-150/80 p-4 sm:p-8 shadow-xs space-y-6" id="catalog-advanced-filters">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
        <span className="font-black text-xs text-slate-900 uppercase tracking-widest">Filter Fleet Parameters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-end font-sans">
        {/* Search Input */}
        <div className="lg:col-span-4 space-y-1.5">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Search Vehicle</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              type="text"
              placeholder="Search by vehicle name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-xs font-bold text-slate-850 border border-gray-150 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none"
            />
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Vehicle Type</label>
          <select 
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full bg-slate-50/50 border border-gray-150 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all outline-none"
          >
            <option value="All">All Types</option>
            <option value="Convertible">Convertible</option>
            <option value="Hatchback">Hatchback</option>
            <option value="SUV">SUV</option>
            <option value="Saloon">Saloon</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Fuel Type</label>
          <select 
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full bg-slate-50/50 border border-gray-150 rounded-xl px-3 py-3 text-xs font-bold text-slate-705 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all outline-none"
          >
            <option value="All">All Fuels</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Transmission */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Transmission</label>
          <select 
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="w-full bg-slate-50/50 border border-gray-150 rounded-xl px-3 py-3 text-xs font-bold text-slate-705 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all outline-none"
          >
            <option value="All">All Swaps</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>
    </section>
  );
}
