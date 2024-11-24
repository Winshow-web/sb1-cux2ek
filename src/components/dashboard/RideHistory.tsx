import { useState } from 'react';
import { Calendar, MapPin, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import type { Booking, Driver } from '../../store';

interface RideHistoryProps {
  bookings: Booking[];
  drivers: Driver[];
}

export default function RideHistory({ bookings, drivers }: RideHistoryProps) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const toggleBooking = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const completedBookings = bookings.filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Ride History</h3>
        <p className="mt-1 text-sm text-gray-500">
          View details of your past rides
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {completedBookings.map((booking) => {
          const driver = drivers.find(d => d.uuid === booking.driver_uuid);
          const isExpanded = expandedBooking === booking.booing_id;

          return (
            <div key={booking.booing_id} className="p-4">
              <button
                onClick={() => toggleBooking(booking.booing_id)}
                className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg p-2"
              >
                <div className="flex items-center">
                  <img
                    src={driver?.photo}
                    alt={driver?.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4 text-left">
                    <p className="text-sm font-medium text-gray-900">{driver?.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(booking.endDate), 'PPP')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{driver?.rating.toFixed(1)}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 ml-16 space-y-4 bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Route</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-900">{booking.route}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-900">
                          {format(new Date(booking.startDate), 'p')} - {format(new Date(booking.endDate), 'p')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking.requirements && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Special Requirements</p>
                      <p className="mt-1 text-sm text-gray-900">{booking.requirements}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Driver Details</p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">License Type</p>
                        <p className="text-sm text-gray-900">{driver?.licenseType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm text-gray-900">{driver?.experience} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {completedBookings.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No completed rides yet
          </div>
        )}
      </div>
    </div>
  );
}