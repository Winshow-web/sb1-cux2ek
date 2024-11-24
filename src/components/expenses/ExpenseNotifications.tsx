import { useState } from 'react';
import { Receipt, Check, X, MessageCircle, DollarSign, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { Driver } from '../../store';

interface ExpenseReview {
  id: string;
  comment: string;
  status: 'approved' | 'rejected';
  reviewedAt: Date;
}

interface ExpenseNotification {
  id: string;
  driverUuid: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  review?: ExpenseReview;
}

interface ExpenseNotificationsProps {
  drivers: Driver[];
}

export default function ExpenseNotifications({ drivers }: ExpenseNotificationsProps) {
  const [notifications, setNotifications] = useState<ExpenseNotification[]>([
    {
      id: '1',
      driverUuid: '1',
      date: '2024-03-10',
      category: 'Fuel',
      amount: 85.50,
      description: 'Fuel refill for long-distance trip',
      status: 'pending',
      receiptUrl: 'https://example.com/receipt1.pdf',
    },
    {
      id: '2',
      driverUuid: '2',
      date: '2024-03-09',
      category: 'Maintenance',
      amount: 150.00,
      description: 'Emergency tire replacement',
      status: 'pending',
      receiptUrl: 'https://example.com/receipt2.pdf',
    },
  ]);

  const [selectedExpense, setSelectedExpense] = useState<ExpenseNotification | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleReview = (status: 'approved' | 'rejected') => {
    if (!selectedExpense) return;

    const review: ExpenseReview = {
      id: Math.random().toString(36).substring(7),
      comment: reviewComment,
      status,
      reviewedAt: new Date(),
    };

    setNotifications(notifications.map(notification =>
      notification.id === selectedExpense.id
        ? { ...notification, status, review }
        : notification
    ));

    setShowReviewModal(false);
    setSelectedExpense(null);
    setReviewComment('');
  };

  const getPendingAmount = () => {
    return notifications
      .filter(n => n.status === 'pending')
      .reduce((sum, n) => sum + n.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Receipt className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">
                {notifications.filter(n => n.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pending Amount</p>
              <p className="text-2xl font-semibold text-gray-900">€{getPendingAmount().toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved Claims</p>
              <p className="text-2xl font-semibold text-gray-900">
                {notifications.filter(n => n.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Expense Claims</h3>
          <p className="mt-1 text-sm text-gray-500">Review and approve expense claims from drivers</p>
        </div>
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => {
            const driver = drivers.find(d => d.uuid === notification.driverUuid);
            return (
              <li key={notification.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={driver?.photo}
                      alt={driver?.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{driver?.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(notification.date), 'PP')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">€{notification.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{notification.category}</p>
                    </div>
                    {notification.status === 'pending' ? (
                      <button
                        onClick={() => {
                          setSelectedExpense(notification);
                          setShowReviewModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Review
                      </button>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notification.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {notifications.length === 0 && (
            <li className="p-4 text-center text-gray-500">
              No expense claims to review
            </li>
          )}
        </ul>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedExpense && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Review Expense Claim</h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedExpense(null);
                  setReviewComment('');
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="mt-1 text-sm text-gray-900">€{selectedExpense.amount.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedExpense.description}</p>
                </div>
              </div>

              {selectedExpense.receiptUrl && (
                <div className="mt-4">
                  <a
                    href={selectedExpense.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Receipt
                  </a>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  <MessageCircle className="h-4 w-4 inline-block mr-1" />
                  Review Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Add a comment about this expense claim..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => handleReview('rejected')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleReview('approved')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}