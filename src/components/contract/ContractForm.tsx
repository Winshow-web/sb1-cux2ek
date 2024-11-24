import { useState } from 'react';
import { Calendar, DollarSign, FileText, X } from 'lucide-react';
import type { Contract, Booking, Driver } from '../../types';

interface ContractFormProps {
  booking: Booking;
  driver: Driver;
  onSubmit: (contractData: Omit<Contract, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export default function ContractForm({ booking, driver, onSubmit, onClose }: ContractFormProps) {
  const [compensation, setCompensation] = useState(0);
  const [terms, setTerms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bookingId: booking.id,
      driverId: driver.id,
      clientId: booking.clientId,
      terms,
      compensation,
      startDate: booking.startDate,
      endDate: booking.endDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create Contract</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver</label>
            <div className="mt-1 flex items-center">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 inline-block mr-1" />
                Start Date
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 inline-block mr-1" />
                End Date
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <DollarSign className="h-4 w-4 inline-block mr-1" />
              Compensation (USD)
            </label>
            <input
              type="number"
              value={compensation}
              onChange={(e) => setCompensation(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 inline-block mr-1" />
              Terms and Conditions
            </label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              placeholder="Enter the terms and conditions of the contract..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Create Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}