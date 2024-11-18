import { TrendingUp, Clock, Calendar, Star } from 'lucide-react';

interface DriverStatsProps {
  totalTrips: number;
  pendingRequests: number;
  activeTrips: number;
  rating: number;
}

export default function DriverStats({
  totalTrips,
  pendingRequests,
  activeTrips,
  rating,
}: DriverStatsProps) {
  const stats = [
    {
      name: 'Total Trips',
      value: totalTrips,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Trips',
      value: activeTrips,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Requests',
      value: pendingRequests,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Rating',
      value: rating.toFixed(1),
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((item) => (
            <div key={item.name} className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <div className={`rounded-md p-2 ${item.bgColor}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{item.name}</p>
                  <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}