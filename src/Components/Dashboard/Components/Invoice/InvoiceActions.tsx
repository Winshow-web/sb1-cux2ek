import { useState } from 'react';
import { Check, X, Trash2, Mail, Share2 } from 'lucide-react';

interface InvoiceActionsProps {
  invoiceId: string;
  onClose: () => void;
  onUpdateStatus: (status: 'paid' | 'pending' | 'cancelled') => void;
}

export default function InvoiceActions({ invoiceId, onClose, onUpdateStatus }: InvoiceActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    // Implement delete functionality
    console.log('Deleting invoice:', invoiceId);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full">
        {!showDeleteConfirm ? (
          <>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => onUpdateStatus('paid')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Check className="h-4 w-4 mr-3 text-green-500" />
                  Mark as Paid
                </button>
                <button
                  onClick={() => onUpdateStatus('pending')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-4 w-4 mr-3 text-yellow-500" />
                  Mark as Pending
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Mail className="h-4 w-4 mr-3 text-gray-500" />
                  Send Reminder
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Share2 className="h-4 w-4 mr-3 text-gray-500" />
                  Share Invoice
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete Invoice
                </button>
              </div>
            </div>
            <div className="border-t px-4 py-3 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Invoice</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this invoice? This action cannot be undone.
              </p>
            </div>
            <div className="border-t px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}