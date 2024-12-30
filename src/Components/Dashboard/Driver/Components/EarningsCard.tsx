import { Euro, TrendingUp, Calendar } from 'lucide-react';
import type { Booking } from '../../store';

interface EarningsCardProps {
  bookings: Booking[];
}

export default function EarningsCard({ bookings }: EarningsCardProps) {
  const calculateEarnings = (bookings: Booking[]) => {
    return bookings.reduce((total, booking) => {
      const hours = Math.ceil(
        (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60)
      );
      const baseRate = 65; // €65 per hour
      return total + (hours * baseRate);
    }, 0);
  };

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = calculateEarnings(completedBookings);
  
  // Calculate earnings for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthBookings = completedBookings.filter(booking => {
    const bookingDate = new Date(booking.endDate);
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
  });
  const monthlyEarnings = calculateEarnings(currentMonthBookings);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Euro className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Total Earnings</span>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">€{totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{completedBookings.length} completed trips</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">This Month</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">€{monthlyEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{currentMonthBookings.length} completed trips</p>
          </div>
        </div>
      </div>
    </div>
  );
}