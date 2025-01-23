import { useState } from 'react';
import type { Booking } from '@global/types.ts';
import CreateInvoiceForm from './CreateInvoiceForm';

interface InvoiceTableProps {
  bookings: Booking[];
}

export default function InvoiceTable({ bookings }: InvoiceTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  // ... rest of the existing code ...

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <button 
          onClick={() => setShowCreateInvoice(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <span className="mr-2">+</span>
          Create Invoice
        </button>
        {/* ... rest of the existing code ... */}
      </div>

      {/* ... rest of the existing table code ... */}

      {showCreateInvoice && (
        <CreateInvoiceForm
          onClose={() => setShowCreateInvoice(false)}
          onSubmit={(data) => {
            console.log('Invoice data:', data);
            setShowCreateInvoice(false);
          }}
        />
      )}
    </div>
  );
}