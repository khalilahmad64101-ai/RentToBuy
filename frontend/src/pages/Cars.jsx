import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Car } from 'lucide-react';

import { HeroSection } from './Cars/HeroSection';
import { CarsGridSection } from './Cars/CarsGridSection';
import { FaqSection } from './Cars/FaqSection';
import { BudgetMeterSection } from './Cars/BudgetMeterSection';
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
        <BudgetMeterSection 
          BUDGET_STEPS={BUDGET_STEPS}
          budgetIndex={budgetIndex}
          setBudgetIndex={setBudgetIndex}
          handleUrlScroll={handleUrlScroll}
        />
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


        {/* 4. FAQ accordion list list template elements */}
        <FaqSection />
      </div>
    </div>
  );
}
