import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Car } from 'lucide-react';

import { HeroSection } from './Cars/HeroSection';
import { CarsGridSection } from './Cars/CarsGridSection';
import { WhyChooseSection } from './Cars/WhyChooseSection';
import { FeaturesSection } from './Cars/FeaturesSection';
import { RoadmapSection } from './Cars/RoadmapSection';
import { FaqSection } from './Cars/FaqSection';
import { FinalCtaSection } from './Cars/FinalCtaSection';
import { useSEO } from '../hooks/useSEO';

const BUDGET_STEPS = [30, 40, 50, 60, 70, 80, 90, 100];

export function Cars() {
  useSEO({
    title: 'Fleet Browser | Rent-to-Buy Shared and Premium Car Catalog',
    description: 'Browse our high-efficiency hatchback, spacious SUV, and luxury saloon rent-to-buy lease cars. Match your budget with transparent weekly contribution pricing and instant online pre-approval.',
    keywords: 'Toyota Aqua lease, PCO hybrid car hire, Rent to buy EV, budget car match Manchester, London car hire purchase'
  });

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetIndex, setBudgetIndex] = useState(7); // default is £100 (maximum index)

  // Advanced core state filters
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [availability, setAvailability] = useState('All');

  useEffect(() => {
    api.cars.list()
      .then((data) => {
        // Enrich backend cars data with predictable UI parameters if they are missing
        const enriched = data.map((car, idx) => {
          const lowerName = car.name.toLowerCase();
          
          let detType = 'Saloon';
          if (lowerName.includes('prius') || lowerName.includes('aqua') || lowerName.includes('golf')) {
            detType = 'Hatchback';
          } else if (lowerName.includes('tesla') || lowerName.includes('mercedes')) {
            detType = 'Saloon';
          } else if (lowerName.includes('nissan') || lowerName.includes('sportage') || lowerName.includes('is300') || lowerName.includes('suv')) {
            detType = 'SUV';
          } else if (lowerName.includes('mx') || lowerName.includes('convertible')) {
            detType = 'Convertible';
          }

          let detFuel = car.fuel || 'Petrol';
          if (lowerName.includes('hybrid') || lowerName.includes('prius') || lowerName.includes('aqua')) {
            detFuel = 'Hybrid';
          } else if (lowerName.includes('tesla') || lowerName.includes('electric') || lowerName.includes('leaf')) {
            detFuel = 'Electric';
          } else if (lowerName.includes('tdi') || lowerName.includes('diesel')) {
            detFuel = 'Diesel';
          }

          let detYear = car.year || (2014 + (idx % 6));
          let detMileage = car.mileage || `${45000 + (idx * 5210)} Miles`;
          let detTrans = car.transmission || (idx % 2 === 0 ? 'Automatic' : 'Manual');
          let detDeposit = car.depositAmount || car.deposit || (500 + (idx * 150));
          let detStatus = car.status || (idx % 5 === 4 ? 'Under Review' : 'Available');

          return {
            ...car,
            calcType: detType,
            calcFuel: detFuel,
            calcYear: detYear,
            calcMileage: detMileage,
            calcTrans: detTrans,
            calcDeposit: detDeposit,
            calcStatus: detStatus
          };
        });
        
        setCars(enriched);
        setFilteredCars(enriched);
      })
      .catch((err) => console.error('Error fetching cars list:', err))
      .finally(() => setLoading(false));
  }, []);

  // Compute filters reactively
  useEffect(() => {
    let result = cars;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (car) =>
          car.name.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q)
      );
    }

    if (vehicleType !== 'All') {
      result = result.filter((car) => car.calcType.toLowerCase() === vehicleType.toLowerCase());
    }

    if (fuelType !== 'All') {
      result = result.filter((car) => car.calcFuel.toLowerCase() === fuelType.toLowerCase());
    }

    if (transmission !== 'All') {
      result = result.filter((car) => car.calcTrans.toLowerCase() === transmission.toLowerCase());
    }

    if (priceRange !== 'All') {
      result = result.filter((car) => {
        const rate = car.weeklyRate || car.price || 60;
        if (priceRange === 'under-220') return rate < 220;
        if (priceRange === '220-300') return rate >= 220 && rate <= 300;
        if (priceRange === 'over-300') return rate > 300;
        return true;
      });
    }

    if (availability !== 'All') {
      result = result.filter((car) => car.calcStatus.toLowerCase() === availability.toLowerCase());
    }

    const selectedBudget = BUDGET_STEPS[budgetIndex];
    const isMaxBudget = budgetIndex === BUDGET_STEPS.length - 1;
    if (!isMaxBudget) {
      result = result.filter((car) => {
        const rate = car.weeklyRate || car.price || 50;
        return rate <= selectedBudget;
      });
    }

    setFilteredCars(result);
  }, [search, vehicleType, fuelType, transmission, priceRange, availability, budgetIndex, cars]);

  // Smooth scroll handler
  const scrollToTarget = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearch('');
    setVehicleType('All');
    setFuelType('All');
    setTransmission('All');
    setPriceRange('All');
    setAvailability('All');
    setBudgetIndex(7);
  };

  const handleUrlScroll = () => {
    const el = document.getElementById('available-cars-counter-trigger');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 font-sans antialiased" id="explore-cars-root">
      
      {/* 1. Large Integrated Full Screen Hero + Affordability Meter Section */}
      <section className="w-full text-left animate-fade-in" id="integrated-homepage-hero">
        <HeroSection 
          title="PREFERABLE DRIVE TODAY"
          subtitle="DISCOVER OUTSTANDING RENT VEHICLES FLEET"
          badge="Luxury fleet"
          scrollToTarget={scrollToTarget} 
        />

        {/* Budget Meter overlapping the bottom of the Hero Section precisely */}
        <div className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-28 w-full px-3 sm:px-6">
          <div className="w-full max-w-[1400px] mx-auto bg-white rounded-[2rem] pt-10 pb-16 px-6 sm:px-12 md:px-16 shadow-[0_24px_55px_rgba(0,0,0,0.18)] border border-gray-150/80 animate-fade-in relative" id="affordability-meter-section">
            
            {/* Absolute badge breaking through the top center */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1F3F7A] border-[4px] border-white flex items-center justify-center shadow-lg grow-0 shrink-0">
              <Car className="w-6 h-6 text-white" />
            </div>

            {/* Title styled with brand primary blue */}
            <h2 className="font-sans font-black text-xl sm:text-2xl text-[#1F3F7A] tracking-tight text-center leading-tight mb-8 uppercase">
              Select your weekly budget
            </h2>

            {/* Interactive Custom Range Slider */}
            <div className="relative mt-8 mb-6 max-w-5xl mx-auto px-4 sm:px-6">
              <input
                type="range"
                min="0"
                max={BUDGET_STEPS.length - 1}
                value={budgetIndex}
                onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                className="custom-slider-input w-full relative z-10"
                style={{
                  background: `linear-gradient(to right, #7CC242 0%, #7CC242 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #e2e8f0 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #e2e8f0 100%)`
                }}
              />

              {/* Desktop Ticks/Steps: Show all values, properly aligned and centered beneath */}
              <div className="hidden md:block relative w-full h-12 mt-6 select-none font-sans">
                {BUDGET_STEPS.map((step, idx) => {
                  const isCurrent = budgetIndex === idx;
                  const pct = idx / (BUDGET_STEPS.length - 1);
                  return (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2"
                      style={{
                        left: `calc(17px + (100% - 34px) * ${pct})`
                      }}
                    >
                      <button
                        onClick={() => setBudgetIndex(idx)}
                        className={`font-sans font-black transition-all duration-200 cursor-pointer focus:outline-none text-xs sm:text-sm md:text-base py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl border whitespace-nowrap min-w-[50px] sm:min-w-[55px] text-center ${
                          isCurrent 
                            ? 'border-[#7CC242] bg-[#7CC242]/10 text-[#7CC242] scale-110 shadow-sm' 
                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:text-[#7CC242] hover:border-[#7CC242]/30'
                        }`}
                      >
                        £{step}{idx === BUDGET_STEPS.length - 1 ? '+' : ''}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Ticks/Steps: Dedicated responsive mobile layout (Show 4 values, evenly spaced, centered, no overlap, touch-friendly) */}
              <div className="flex md:hidden justify-between items-center w-full mt-6 select-none font-sans gap-2">
                {[
                  { label: '40', index: 1 },
                  { label: '60', index: 3 },
                  { label: '80', index: 5 },
                  { label: '100+', index: 7 }
                ].map((item) => {
                  const isCurrent = budgetIndex === item.index || 
                    (item.index === 1 && budgetIndex === 0) || 
                    (item.index === 3 && budgetIndex === 2) || 
                    (item.index === 5 && budgetIndex === 4) || 
                    (item.index === 7 && budgetIndex === 6);
                  return (
                    <button
                      key={item.index}
                      onClick={() => setBudgetIndex(item.index)}
                      className={`flex-1 font-sans font-black transition-all duration-200 cursor-pointer focus:outline-none text-xs sm:text-sm py-2 px-1 rounded-xl border text-center whitespace-nowrap ${
                        isCurrent 
                          ? 'border-[#7CC242] bg-[#7CC242]/10 text-[#7CC242] scale-105 shadow-xs font-bold' 
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:text-[#7CC242] hover:border-[#7CC242]/30'
                      }`}
                    >
                      £{item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Overlapping Capsule Button */}
            <button
              onClick={handleUrlScroll}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-[#1F3F7A] to-[#173263] hover:from-[#7CC242] hover:to-[#6bb033] text-white font-black hover:scale-[1.03] transition-all duration-200 active:scale-95 py-3.5 sm:py-4 px-10 sm:px-14 rounded-full sm:text-base text-sm tracking-wide whitespace-nowrap shadow-[0_12px_30px_rgba(31,63,122,0.35)] flex items-center justify-center cursor-pointer border border-[#1f3f7a]/20 min-w-[245px] z-20 uppercase"
            >
              Search for your car
            </button>

          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* Available vehicles live counter tracking label */}
        <div id="available-cars-counter-trigger" className="pt-2 flex justify-between items-center border-b border-gray-150 pb-4">
          <div className="space-y-1">
            <h2 className="font-sans font-black text-lg text-slate-900 tracking-tight">Active Stock Fleet</h2>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
              {filteredCars.length} of {cars.length} Vehicles Match Your Profile Search
            </p>
          </div>
        </div>

        {/* 3. Grid of available cars layout */}
        <CarsGridSection 
          filteredCars={filteredCars} 
          loading={loading} 
          resetFilters={resetFilters} 
        />

        {/* 4. Why Choose Our Vehicles cards */}
        <WhyChooseSection />

        {/* 5. Custom high-spec conveniences accessories details list */}
        <FeaturesSection />

        {/* 6. Simple roadmap road-preview segment timeline cards */}
        <RoadmapSection />

        {/* 7. FAQ accordion list list template elements */}
        <FaqSection />

        {/* 8. Rapid licensing review final CTA banner */}
        <FinalCtaSection />
      </div>
    </div>
  );
}
