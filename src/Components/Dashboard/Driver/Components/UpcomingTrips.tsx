import { Calendar, MapPin, CheckCircle } from 'lucide-react';
import type { Booking } from '../../global';

interface UpcomingTripsProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: Booking['status']) => void;
}

export default function UpcomingTrips({ bookings, onUpdateStatus }: UpcomingTripsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Trips</h3>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => onUpdateStatus(booking.id, 'completed')}
                  className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete Trip
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">{booking.route}</span>
                </div>
                {booking.requirements && (
                  <p className="text-sm text-gray-600 ml-7">{booking.requirements}</p>
                )}
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-gray-500 text-center py-4">No upcoming trips</p>
          )}
        </div>
      </div>
    </div>
  );
}