import { useState } from 'react';
import { Receipt, Plus, FileText, Calendar, DollarSign, Tag, X, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
}

export default function ExpenseClaims() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'status'>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    amount: 0,
    description: '',
  });

  const categories = [
    'Fuel',
    'Maintenance',
    'Parking',
    'Tolls',
    'Meals',
    'Accommodation',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: Math.random().toString(36).substring(7),
      ...newExpense,
      status: 'pending',
    };
    setExpenses([expense, ...expenses]);
    setShowForm(false);
    setNewExpense({
      date: format(new Date(), 'yyyy-MM-dd'),
      category: '',
      amount: 0,
      description: '',
    });
  };

  const getTotalPending = () => {
    return expenses
      .filter(e => e.status === 'pending')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalApproved = () => {
    return expenses
      .filter(e => e.status === 'approved')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Claims</p>
                <p className="text-2xl font-semibold text-gray-900">{expenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Amount</p>
                <p className="text-2xl font-semibold text-gray-900">${getTotalPending().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved Amount</p>
                <p className="text-2xl font-semibold text-gray-900">${getTotalApproved().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Expense Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Expense Claim
        </button>
      </div>

      {/* New Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Expense Claim</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 inline-block mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Tag className="h-4 w-4 inline-block mr-1" />
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <DollarSign className="h-4 w-4 inline-block mr-1" />
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4 inline-block mr-1" />
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Upload className="h-4 w-4 inline-block mr-1" />
                  Receipt
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Claims</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    expense.status === 'approved' ? 'bg-green-100' :
                    expense.status === 'rejected' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    <Receipt className={`h-5 w-5 ${
                      expense.status === 'approved' ? 'text-green-600' :
                      expense.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{expense.category}</p>
                    <p className="text-sm text-gray-500">{expense.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{format(new Date(expense.date), 'PP')}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                    expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </div>
              </div>
            </li>
          ))}
          {expenses.length === 0 && (
            <li className="p-4 text-center text-gray-500">
              No expense claims yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}