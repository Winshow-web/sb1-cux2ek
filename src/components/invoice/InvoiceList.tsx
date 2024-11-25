import { useState } from 'react';
import { FileText, Download, ChevronDown, ChevronUp, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Booking } from '../../store';

interface InvoiceListProps {
  bookings: Booking[];
}

export default function InvoiceList({ bookings }: InvoiceListProps) {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  const toggleInvoice = (bookingId: string) => {
    setExpandedInvoice(expandedInvoice === bookingId ? null : bookingId);
  };

  // Mock invoice data based on bookings
  const getInvoiceAmount = (booking: Booking) => {
    const hours = Math.ceil(
      (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60)
    );
    const baseRate = 75; // $75 per hour
    return hours * baseRate;
  };

  const completedBookings = bookings.filter(
    (booking) => booking.status === 'completed'
  );

  if (completedBookings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center text-gray-500">
          No invoices available yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Invoices
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and download your trip invoices
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {completedBookings.map((booking) => {
            const isExpanded = expandedInvoice === booking.booing_id;
            const amount = getInvoiceAmount(booking);

            return (
              <li key={booking.booing_id}>
                <div className="px-4 py-4 sm:px-6">
                  <button
                    onClick={() => toggleInvoice(booking.booing_id)}
                    className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg p-2"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="ml-4 text-left">
                        <p className="text-sm font-medium text-gray-900">
                          Invoice #{booking.booing_id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(booking.startDate), 'PPP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-4">
                        ${amount.toFixed(2)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 ml-12 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Route</p>
                            <p className="mt-1 text-sm text-gray-900">{booking.route}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Duration</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {format(new Date(booking.startDate), 'PPp')} - 
                              {format(new Date(booking.endDate), 'PPp')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Amount</p>
                            <p className="mt-1 text-sm text-gray-900">${amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className="mt-1 text-sm font-medium text-green-600">Paid</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}