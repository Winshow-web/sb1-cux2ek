import type { Booking, Driver } from '../global';

interface BookingsListProps {
  bookings: Booking[];
  drivers: Driver[];
}

export default function BookingsList({ bookings, drivers }: BookingsListProps) {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {bookings.map((booking) => {
          const driver = drivers.find(d => d.id === booking.driverId);
          return (
            <li key={booking.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">
                    Driver: {driver?.name}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">Route: {booking.route}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}