import { useState, useEffect } from 'react';
import { X, Download, Printer, Share2, Mail } from 'lucide-react';

interface InvoiceViewerProps {
  invoiceId: string;
  mode: 'view' | 'download';
  onClose: () => void;
}

export default function InvoiceViewer({ invoiceId, mode, onClose }: InvoiceViewerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading invoice data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading invoice:', invoiceId);
  };

  const handlePrint = () => {
    // Implement print functionality
    console.log('Printing invoice:', invoiceId);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing invoice:', invoiceId);
  };

  const handleEmail = () => {
    // Implement email functionality
    console.log('Emailing invoice:', invoiceId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Invoice #{invoiceId}</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownload}
              className="text-gray-400 hover:text-gray-500"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={handlePrint}
              className="text-gray-400 hover:text-gray-500"
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-gray-500"
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleEmail}
              className="text-gray-400 hover:text-gray-500"
              title="Email"
            >
              <Mail className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Company Info */}
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                  <p className="text-gray-600">Your Company Name</p>
                  <p className="text-gray-600">123 Business Street</p>
                  <p className="text-gray-600">City, State 12345</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Invoice #{invoiceId}</p>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bill To:</h3>
                <p className="text-gray-600">Client Name</p>
                <p className="text-gray-600">Client Address</p>
                <p className="text-gray-600">City, State 12345</p>
              </div>

              {/* Invoice Items */}
              <div className="border-t pt-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-500">Description</th>
                      <th className="text-right text-sm font-medium text-gray-500">Quantity</th>
                      <th className="text-right text-sm font-medium text-gray-500">Rate</th>
                      <th className="text-right text-sm font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 text-sm text-gray-900">Service Item 1</td>
                      <td className="py-4 text-sm text-gray-900 text-right">1</td>
                      <td className="py-4 text-sm text-gray-900 text-right">$100.00</td>
                      <td className="py-4 text-sm text-gray-900 text-right">$100.00</td>
                    </tr>
                    {/* Add more items as needed */}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="py-4 text-right font-medium">Subtotal:</td>
                      <td className="py-4 text-right font-medium">$100.00</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-4 text-right font-medium">Tax (10%):</td>
                      <td className="py-4 text-right font-medium">$10.00</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-4 text-right font-bold">Total:</td>
                      <td className="py-4 text-right font-bold">$110.00</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Notes:</h3>
                <p className="text-gray-600">
                  Thank you for your business. Please make payment within 30 days.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}