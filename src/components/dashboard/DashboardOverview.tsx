import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardOverviewProps {
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
}

export default function DashboardOverview({
  activeBookings,
  completedBookings,
  pendingBookings,
}: DashboardOverviewProps) {
  const stats = [
    {
      name: 'Active Bookings',
      value: activeBookings,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Completed Trips',
      value: completedBookings,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Requests',
      value: pendingBookings,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Dashboard Overview</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}