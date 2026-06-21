import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import { HeroSection } from '../sections/home/HeroSection';
import { VehicleCardsSection } from '../sections/home/VehicleCardsSection';
import { JourneyStepsSection } from '../sections/home/JourneyStepsSection';
import { TestimonialsSection } from '../sections/home/TestimonialsSection';

const BUDGET_STEPS = [30, 50, 70, 100];

export function Home() {
  useSEO({
    title: 'R2BuyCar | Seamless Rent-to-Buy Car Ownership UK',
    description: 'Get on the road with affordable rent-to-buy cars. Zero setup fees, instant underwriting, and no rigid credit barriers. Routine maintenance, servicing, and road tax are fully covered.',
    keywords: 'rent to buy cars, car subscription, budget car match Manchester, PCO car fleet London, lease to own, buycarz'
  });

  const [dbCars, setDbCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetIndex, setBudgetIndex] = useState(3); // default is £100 (maximum index, which is index 3)

  // Fetch premium cars from DB to integrate with database entries
  useEffect(() => {
    api.cars.list()
      .then((data) => {
        setDbCars(data || []);
      })
      .catch((err) => console.error('[Home Page Error] Failed to retrieve server-seeded fleet listings:', err))
      .finally(() => setLoading(false));
  }, []);

  const selectedBudget = BUDGET_STEPS[budgetIndex];
  const isMaxBudget = budgetIndex === BUDGET_STEPS.length - 1;

  // Filter logic: show cars from DB based on pricing
  const getFilteredCars = () => {
    return dbCars.filter(car => {
      const rate = car.weeklyRate || car.price || 50;
      if (isMaxBudget) {
        return true; // £100 shows all cars
      }
      return rate <= selectedBudget;
    });
  };

  const filteredCars = getFilteredCars();

  const handleUrlScroll = () => {
    const el = document.getElementById('perfect-matches-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-2 md:space-y-12 pb-16 bg-gray-50/30 w-full" id="home-page-view">
      {/* 1. Large Integrated Full Screen Hero + Affordability Meter Section */}
      <HeroSection 
        budgetIndex={budgetIndex}
        setBudgetIndex={setBudgetIndex}
        BUDGET_STEPS={BUDGET_STEPS}
        selectedBudget={selectedBudget}
        isMaxBudget={isMaxBudget}
        handleUrlScroll={handleUrlScroll}
      />

      {/* 2. MATCHING FLEET RESULTS */}
      <VehicleCardsSection 
        loading={loading}
        filteredCars={filteredCars}
      />

      {/* 3. Customer Journey Section */}
      <JourneyStepsSection />

      {/* Modern High-End Premium Testimonial Section */}
      <TestimonialsSection />
    </div>
  );
}
