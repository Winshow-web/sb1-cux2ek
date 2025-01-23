import { Users, FileText, DollarSign, AlertCircle } from 'lucide-react';

interface InvoiceOverviewProps {
  totalClients: number;
  totalInvoices: number;
  totalPaid: number;
  totalUnpaid: number;
}

export default function InvoiceOverview({
  totalClients,
  totalInvoices,
  totalPaid,
  totalUnpaid,
}: InvoiceOverviewProps) {
  const stats = [
    {
      icon: Users,
      label: 'Drivers',
      value: totalClients,
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: FileText,
      label: 'Invoices',
      value: totalInvoices,
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: DollarSign,
      label: 'Paid',
      value: `$${totalPaid.toLocaleString()}`,
      textColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: AlertCircle,
      label: 'Unpaid',
      value: `$${totalUnpaid.toLocaleString()}`,
      textColor: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}