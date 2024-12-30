import { useState } from 'react';
import { Calendar, Mail, MapPin, Clock, Check, X } from 'lucide-react';
import type { Booking, Driver } from '@global/types.ts';

interface ScheduleTableViewProps {
  bookings: Booking[];
  drivers: Driver[];
}

export default function ScheduleTableView({ bookings, drivers }: ScheduleTableViewProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesDate = selectedDate 
      ? new Date(booking.start_date).toDateString() === new Date(selectedDate).toDateString()
      : true;
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    return matchesDate && matchesStatus;
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => {
              const driver = drivers.find(d => d.id === booking.driverId);
              if (!driver) return null;

              return (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={driver.photo}
                        alt={driver.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.licenseType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <Mail className="h-4 w-4 inline mr-1 text-gray-400" />
                      {driver.email}
                    </div>
                    {driver.phone && (
                      <div className="text-sm text-gray-500 mt-1">
                        {driver.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <Calendar className="h-4 w-4 inline mr-1 text-gray-400" />
                      {new Date(booking.start_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 inline mr-1 text-gray-400" />
                      {new Date(booking.start_date).toLocaleTimeString()} - {new Date(booking.end_date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <MapPin className="h-4 w-4 inline mr-1 text-gray-400" />
                      {booking.route}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {driver.availability ? (
                      <span className="inline-flex items-center text-green-600">
                        <Check className="h-5 w-5 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600">
                        <X className="h-5 w-5 mr-1" />
                        Unavailable
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bookings found for the selected filters
        </div>
      )}
    </div>
  );
}