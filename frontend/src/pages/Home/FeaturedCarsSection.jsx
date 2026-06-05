import React from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { CarCard } from '../../components/cars/CarCard';

export function FeaturedCarsSection({ featuredCars, loading }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="featured-fleet">
      <div className="text-center space-y-3 mb-10">
        <h2 className="font-sans font-bold text-3xl text-gray-950 tracking-tight">Our Highlighted Fleet Listings</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Ready-to-drive, fully maintained vehicles complete with inclusive maintenance, PCO readiness, and licensing.
        </p>
      </div>

      {loading ? (
        <Loader label="Reading recent stock data..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      <div className="text-center mt-8 font-sans">
        <Link to="/cars">
          <Button variant="secondary" size="md">
            Explore Entire Stock Catalog ({featuredCars.length}+ Vehicles)
          </Button>
        </Link>
      </div>
    </section>
  );
}
