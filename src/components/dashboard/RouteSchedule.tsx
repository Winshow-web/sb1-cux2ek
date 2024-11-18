import { useState } from 'react';
import type { Booking, Driver } from '../../types';
import { Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface RouteScheduleProps {
  bookings: Booking[];
  drivers: Driver[];
}

interface GroupedBookings {
  [key: string]: Booking[];
}

export default function RouteSchedule({ bookings, drivers }: RouteScheduleProps) {
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  // Group bookings by route
  const groupedBookings = bookings.reduce<GroupedBookings>((acc, booking) => {
    if (!acc[booking.route]) {
      acc[booking.route] = [];
    }
    acc[booking.route].push(booking);
    return acc;
  }, {});

  const toggleRoute = (route: string) => {
    setExpandedRoute(expandedRoute === route ? null : route);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Route Schedule</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Overview of all routes and their schedules
        </p>
      </div>
      <div className="border-t border-gray-200">
        {Object.entries(groupedBookings).map(([route, routeBookings]) => {
          const isExpanded = expandedRoute === route;
          const activeBookings = routeBookings.filter(b => b.status === 'confirmed');
          
          return (
            <div key={route} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleRoute(route)}
                className="w-full px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{route}</p>
                    <p className="text-sm text-gray-500">
                      {activeBookings.length} active bookings
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-6">
                  <div className="mt-2 space-y-4">
                    {routeBookings.map((booking) => {
                      const driver = drivers.find(d => d.id === booking.driverId);
                      return (
                        <div
                          key={booking.id}
                          className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <img
                              src={driver?.photo}
                              alt={driver?.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {driver?.name}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {new Date(booking.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}