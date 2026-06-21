import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CarCard } from '../../components/cars/CarCard';
import { Loader } from '../../components/ui/Loader';

export function VehicleCardsSection({ filteredCars, loading }) {
  return (
    <div className="w-full sm:w-11/12 mx-auto px-2 sm:px-6 lg:px-8 py-3 md:py-10 space-y-4 md:space-y-6" id="perfect-matches-grid">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-gray-100 pb-3 md:pb-4">
        <div className="text-left w-full sm:w-auto">
          <h3 className="font-extrabold text-sm sm:text-lg xl:text-4xl text-black tracking-tight">
            Cars currently avaiable
          </h3>
        </div>
      </div>

      {loading ? (
        <Loader label="Synchronizing database records..." />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 animate-fade-in"
          >
            {filteredCars.map((car) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={car.id}
                className="w-full max-w-[370px] mx-auto px-0.5 sm:px-0"
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {filteredCars.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto">
          <span className="text-3xl block mb-4">🚗</span>
          <h4 className="font-bold text-slate-700">No Direct Matches Fit Online</h4>
          <p className="text-xs text-slate-500 mt-1 px-4 leading-normal">
            Try dragging the slider to £50/week or £70/week to explore ultra-cheap hatchbacks, fully insured!
          </p>
        </div>
      )}
    </div>
  );
}
