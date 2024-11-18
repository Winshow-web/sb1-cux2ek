import { Star, Calendar, Award } from 'lucide-react';
import type { Driver } from '../types';

interface DriverCardProps {
  driver: Driver;
  onBook: (driverId: string) => void;
}

export default function DriverCard({ driver, onBook }: DriverCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48">
        <img
          src={driver.photo}
          alt={driver.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
          {driver.availability ? 'Available' : 'Busy'}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{driver.name}</h3>
        <div className="mt-2 flex items-center">
          <Star className="h-5 w-5 text-yellow-400" />
          <span className="ml-2 text-gray-600">{driver.rating.toFixed(1)} / 5.0</span>
        </div>
        <div className="mt-2 flex items-center">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-gray-600">{driver.experience} years experience</span>
        </div>
        <div className="mt-2 flex items-center">
          <Award className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-gray-600">{driver.licenseType}</span>
        </div>
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {driver.specializations.map((spec) => (
              <span
                key={spec}
                className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => onBook(driver.id)}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          disabled={!driver.availability}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}