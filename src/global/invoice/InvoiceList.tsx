import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Invoice } from '@global/types.ts';
import InvoiceOverview from './InvoiceOverview';
import IssuedInvoiceList from './IssuedInvoiceList';
import CreateInvoiceForm from './CreateInvoiceForm';

interface InvoiceListProps {
  bookings: any[]; // Replace with proper Booking type
}

export default function InvoiceList({ bookings }: InvoiceListProps) {
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '#4987',
      client: {
        name: 'Jordan Stevenson',
        email: 'don85@johnson.com',
      },
      amount: 3428,
      date: '2024-11-13',
      status: 'pending',
      items: [],
    },
    {
      id: '#4988',
      client: {
        name: 'Stephanie Burns',
        email: 'brenda49@taylor.info',
      },
      amount: 5219,
      date: '2024-11-17',
      status: 'paid',
      items: [],
    },
  ]);

  const handleUpdateStatus = (id: string, status: 'paid' | 'pending' | 'cancelled') => {
    setInvoices(prevInvoices =>
      prevInvoices.map(invoice =>
        invoice.id === id ? { ...invoice, status } : invoice
      )
    );
  };

  const uniqueClients = new Set(invoices.map(i => i.client.name)).size;
  const totalPaid = invoices.reduce((sum, invoice) => 
    invoice.status === 'paid' ? sum + invoice.amount : sum, 0
  );
  const totalUnpaid = invoices.reduce((sum, invoice) => 
    invoice.status === 'pending' ? sum + invoice.amount : sum, 0
  );

  return (
    <div className="space-y-8">
      <InvoiceOverview
        totalClients={uniqueClients}
        totalInvoices={invoices.length}
        totalPaid={totalPaid}
        totalUnpaid={totalUnpaid}
      />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>

      <IssuedInvoiceList
        invoices={invoices}
        onUpdateStatus={handleUpdateStatus}
      />

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