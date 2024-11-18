import { useState } from 'react';
import type { Booking, Driver } from '../../types';
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock } from 'lucide-react';

interface ActiveContractsProps {
  bookings: Booking[];
  drivers: Driver[];
}

export default function ActiveContracts({ bookings, drivers }: ActiveContractsProps) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const toggleBooking = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Active Contracts</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your current active bookings and their details
        </p>
      </div>
      <div className="border-t border-gray-200">
        {bookings.length === 0 ? (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            No active contracts at the moment
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const driver = drivers.find(d => d.id === booking.driverId);
              const isExpanded = expandedBooking === booking.id;

              return (
                <li key={booking.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <button
                      onClick={() => toggleBooking(booking.id)}
                      className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg p-2"
                    >
                      <div className="flex items-center">
                        <img
                          src={driver?.photo}
                          alt={driver?.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-4 text-left">
                          <p className="text-sm font-medium text-indigo-600">{driver?.name}</p>
                          <p className="text-sm text-gray-500">{booking.route}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-4 ml-16 space-y-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                          <span>
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{booking.route}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-5 w-5 mr-2 text-gray-400" />
                          <span>Status: {booking.status}</span>
                        </div>
                        {booking.requirements && (
                          <div className="text-sm text-gray-500">
                            <p className="font-medium">Special Requirements:</p>
                            <p className="mt-1">{booking.requirements}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}