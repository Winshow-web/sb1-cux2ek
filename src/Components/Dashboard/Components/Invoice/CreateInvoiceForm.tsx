import { useState } from 'react';
import { X, Plus, Send } from 'lucide-react';

interface CreateInvoiceFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreateInvoiceForm({ onClose, onSubmit }: CreateInvoiceFormProps) {
  const [formData, setFormData] = useState({
    invoiceNumber: '4987',
    dateIssued: '',
    dateDue: '',
    billTo: '',
    items: [{ description: '', hours: '', price: '' }],
    paymentTerms: true,
    clientNotes: false,
    paymentStub: false,
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213874685',
    swiftCode: 'BR91905',
    note: '',
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', hours: '', price: '' }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      const amount = Number(item.hours) * Number(item.price) || 0;
      return sum + amount;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = 28;
    const tax = subtotal * 0.21;
    return subtotal - discount + tax;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl my-8">
        <div className="p-6 flex justify-between items-start border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">MATERIO</h2>
            <p className="mt-1 text-sm text-gray-600">
              Office 149, 450 South Brand Brooklyn<br />
              San Diego County, CA 91905, USA<br />
              +1 (123) 456 7891, +44 (876) 543 2198
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice #</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date Issued</label>
              <input
                type="date"
                value={formData.dateIssued}
                onChange={(e) => setFormData({ ...formData, dateIssued: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice To:</label>
              <select
                value={formData.billTo}
                onChange={(e) => setFormData({ ...formData, billTo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Driver</option>
                <option value="client1">Driver 1</option>
                <option value="client2">driver 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date Due</label>
              <input
                type="date"
                value={formData.dateDue}
                onChange={(e) => setFormData({ ...formData, dateDue: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.hours}
                        onChange={(e) => updateItem(index, 'hours', e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      ${Number(item.hours) * Number(item.price) || 0}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addItem}
              className="mt-4 flex items-center text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IBAN</label>
                  <input
                    type="text"
                    value={formData.iban}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SWIFT Code</label>
                  <input
                    type="text"
                    value={formData.swiftCode}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">${calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm font-medium">$28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax (21%):</span>
                  <span className="text-sm font-medium">${(calculateSubtotal() * 0.21).toFixed(2)}</span>
                </div>
                <div className="pt-4 flex justify-between border-t">
                  <span className="text-base font-medium text-gray-900">Total:</span>
                  <span className="text-base font-medium text-gray-900">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Payment Terms</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.clientNotes}
                    onChange={(e) => setFormData({ ...formData, clientNotes: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Client Notes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paymentStub}
                    onChange={(e) => setFormData({ ...formData, paymentStub: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Payment Stub</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              placeholder="Thanks for your business"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
}