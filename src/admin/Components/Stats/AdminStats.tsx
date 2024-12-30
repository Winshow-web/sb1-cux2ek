import { Users, UserCheck, Clock, Calendar, Truck } from 'lucide-react';
import type { AdminStats as AdminStatsType } from '@global/types.ts';

interface AdminStatsProps {
  stats: AdminStatsType;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Active Drivers',
      value: stats.activeDrivers,
      icon: Truck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white pt-5 px-4 pb-5 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <div className="flex items-center">
              <div className={`${stat.bgColor} rounded-md p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional analytics and charts can be added here */}
    </div>
  );
}