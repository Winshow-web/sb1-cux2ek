import { useState } from 'react';
import { Calendar, CheckCircle, Clock, ChevronRight, X } from 'lucide-react';

interface DashboardOverviewProps {
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
  onViewAll?: (section: 'active' | 'completed' | 'pending') => void;
}

export default function DashboardOverview({
  activeBookings,
  completedBookings,
  pendingBookings,
  onViewAll,
}: DashboardOverviewProps) {
  const [selectedCard, setSelectedCard] = useState<'active' | 'completed' | 'pending' | null>(null);

  const stats = [
    {
      id: 'active',
      name: 'Active Bookings',
      value: activeBookings,
      Icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Currently ongoing bookings',
      details: [
        { label: 'Today', value: activeBookings > 0 ? Math.floor(activeBookings * 0.4) : 0 },
        { label: 'This Week', value: activeBookings > 0 ? Math.floor(activeBookings * 0.7) : 0 },
        { label: 'This Month', value: activeBookings }
      ]
    },
    {
      id: 'completed',
      name: 'Completed Trips',
      value: completedBookings,
      Icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Successfully completed trips',
      details: [
        { label: 'Today', value: completedBookings > 0 ? Math.floor(completedBookings * 0.2) : 0 },
        { label: 'This Week', value: completedBookings > 0 ? Math.floor(completedBookings * 0.5) : 0 },
        { label: 'This Month', value: completedBookings }
      ]
    },
    {
      id: 'pending',
      name: 'Pending Requests',
      value: pendingBookings,
      Icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Awaiting confirmation',
      details: [
        { label: 'Urgent', value: pendingBookings > 0 ? Math.floor(pendingBookings * 0.3) : 0 },
        { label: 'Today', value: pendingBookings > 0 ? Math.floor(pendingBookings * 0.6) : 0 },
        { label: 'This Week', value: pendingBookings }
      ]
    }
  ];

  const selectedStat = selectedCard ? stats.find(s => s.id === selectedCard) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedCard(item.id as typeof selectedCard)}
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${item.bgColor}`}>
                <item.Icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {item.value}
              </p>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewAll?.(item.id as 'active' | 'completed' | 'pending');
                    }}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center"
                  >
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </dd>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-16">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedCard && selectedStat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${selectedStat.bgColor}`}>
                  <selectedStat.Icon className={`h-6 w-6 ${selectedStat.color}`} />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {selectedStat.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedStat.details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {detail.label}
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  onViewAll?.(selectedCard);
                  setSelectedCard(null);
                }}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View All Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}