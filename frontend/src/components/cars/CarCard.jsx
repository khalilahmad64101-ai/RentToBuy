import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Orbit, ShieldCheck, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export function CarCard({ car }) {
  const { id, name, model, price, weeklyRate, image, fuel, transmission, economy, features, specs } = car;
  
  const displayWeeklyPrice = weeklyRate || price || 50;
  const displayEconomy = economy || '55 mpg';
  const displayFeatures = features || specs || [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full" id={`car-${id}`}>
      {/* Vehicle image with dynamic overlay */}
      <div className="relative aspect-video bg-gray-50 overflow-hidden shrink-0">
        <img
          src={image}
          alt={`${name} ${model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-indigo-600 text-white font-sans text-xs font-semibold px-2.5 py-1 rounded-md shadow">
          In Stock - Ready
        </div>
        <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Routine Cover Included</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-sans font-bold text-lg text-gray-950 tracking-tight leading-tight">{name}</h3>
            <div className="text-right">
              <span className="text-xl font-bold font-sans text-indigo-600">£{displayWeeklyPrice}</span>
              <span className="text-[10px] text-gray-400 block -mt-1 font-medium">/ week</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-medium mb-4 line-clamp-1">{model}</p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 mb-4 text-[11px] text-gray-500 font-medium">
            <div className="flex items-center space-x-1 justify-center">
              <Fuel className="w-3.5 h-3.5 text-gray-400" />
              <span>{fuel || 'Petrol'}</span>
            </div>
            <div className="flex items-center space-x-1 justify-center border-x border-gray-100">
              <Orbit className="w-3.5 h-3.5 text-gray-400" />
              <span>{transmission || 'Manual'}</span>
            </div>
            <div className="flex items-center space-x-1 justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{displayEconomy}</span>
            </div>
          </div>

          {/* Key Features Bullet List */}
          <div className="space-y-1.5 mb-5 shrink-0">
            {displayFeatures.slice(0, 3).map((feat, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button triggers */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
          <Link to={`/cars/${id}`}>
            <Button variant="secondary" size="sm" className="w-full text-xs">
              View Fleet Specs
            </Button>
          </Link>
          <Link to={`/apply?carId=${id}`}>
            <Button variant="primary" size="sm" className="w-full text-xs font-semibold">
              Apply to Lease
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
