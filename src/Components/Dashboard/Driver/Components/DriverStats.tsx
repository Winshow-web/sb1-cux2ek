import { TrendingUp, Clock, Star } from 'lucide-react';

interface DriverStatsProps {
  totalTrips: number;
  pendingRequests: number;
  rating: number;
}

export default function DriverStats({
  totalTrips,
  pendingRequests,
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 transition-transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${item.bgColor} rounded-xl`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-500">{item.name}</p>
              </div>
              <div
                className={`absolute inset-x-0 bottom-0 h-1 ${item.bgColor} rounded-b-xl`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}