import { Calendar, DollarSign, FileText, CheckCircle, XCircle } from 'lucide-react';
import type { Contract, Driver } from '../../types';

interface ContractCardProps {
  contract: Contract;
  driver: Driver;
}

export default function ContractCard({ contract, driver }: ContractCardProps) {
  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={driver.photo}
              alt={driver.name}
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{driver.name}</p>
              <p className="text-sm text-gray-500">{driver.licenseType}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
            {contract.status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm text-gray-900">
                  {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Compensation</p>
                <p className="text-sm font-medium text-gray-900">
                  ${contract.compensation.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm font-medium text-gray-900">Terms</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{contract.terms}</p>
          </div>

          {contract.status === 'signed' && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-gray-600">Signed by both parties</p>
              </div>
              <p className="text-xs text-gray-500">
                Updated: {new Date(contract.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {contract.status === 'rejected' && (
            <div className="flex items-center pt-4 border-t border-gray-200">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-gray-600">Contract rejected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}