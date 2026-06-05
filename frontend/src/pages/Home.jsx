import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HeroSection } from '../components/layout/HeroSection';
import { FeaturedCarsSection } from './Home/FeaturedCarsSection';
import { VehicleFeaturesSection } from './Home/VehicleFeaturesSection';
import { HowItWorksSection } from './Home/HowItWorksSection';
import { RequiredDocumentsSection } from './Home/RequiredDocumentsSection';
import { PerksSection } from './Home/PerksSection';
import { TestimonialsSection } from './Home/TestimonialsSection';

export function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cars.list()
      .then((data) => {
        setFeaturedCars(data.slice(0, 6));
      })
      .catch((err) => console.error('Error fetching featured cars:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-16" id="home-page-view">
      {/* High Fidelity Reusable Hero Section matching visual target 100% */}
      <HeroSection
        title="DRIVE YOUR LUXURY FUTURE TODAY"
        subtitle="EASY PREMIUM VEHICLE OWNERSHIP PATHWAY"
        badge="Future At Hand"
        showCta={true}
        ctaText="Explore Now"
        ctaLink="/cars"
      />

      {/* Featured Fleet Vehicles Catalog Section */}
      <FeaturedCarsSection featuredCars={featuredCars} loading={loading} />

      {/* Integrated Vehicle Features Section */}
      <VehicleFeaturesSection />

      {/* Mechanics Explanation: How it works */}
      <HowItWorksSection />

      {/* Documents Required Section */}
      <RequiredDocumentsSection />

      {/* Highlight Testimonials / Perks layout */}
      <PerksSection />

      {/* Modern High-End Premium Testimonial Section */}
      <TestimonialsSection />
    </div>
  );
}
