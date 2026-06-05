import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

import { HeroSection } from './Cars/HeroSection';
import { FiltersSection } from './Cars/FiltersSection';
import { CarsGridSection } from './Cars/CarsGridSection';
import { WhyChooseSection } from './Cars/WhyChooseSection';
import { FeaturesSection } from './Cars/FeaturesSection';
import { RoadmapSection } from './Cars/RoadmapSection';
import { FaqSection } from './Cars/FaqSection';
import { FinalCtaSection } from './Cars/FinalCtaSection';

export function Cars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

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

    setFilteredCars(result);
  }, [search, vehicleType, fuelType, transmission, priceRange, availability, cars]);

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
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 font-sans antialiased space-y-12" id="explore-cars-root">
      {/* 1. Hero banner section with available vehicles CTA list parameters */}
      <HeroSection 
        title="CHOOSE YOUR PREFERABLE DRIVE TODAY"
        subtitle="DISCOVER OUTSTANDING RENT VEHICLES FLEET"
        badge="Luxury fleet"
        scrollToTarget={scrollToTarget} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Available vehicles live counter tracking label */}
        <div id="available-cars-counter-trigger" className="pt-2 flex justify-between items-center border-b border-gray-150 pb-4">
          <div className="space-y-1">
            <h2 className="font-sans font-black text-lg text-slate-900 tracking-tight">Active Stock Fleet</h2>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
              {filteredCars.length} of {cars.length} Vehicles Match Your Profile Search
            </p>
          </div>
        </div>

        {/* 2. Advanced filters block selectors */}
        <FiltersSection
          search={search} setSearch={setSearch}
          vehicleType={vehicleType} setVehicleType={setVehicleType}
          fuelType={fuelType} setFuelType={setFuelType}
          transmission={transmission} setTransmission={setTransmission}
          priceRange={priceRange} setPriceRange={setPriceRange}
          availability={availability} setAvailability={setAvailability}
        />

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
