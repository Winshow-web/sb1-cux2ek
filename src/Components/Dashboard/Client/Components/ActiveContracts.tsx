import { useState } from 'react';
import type { Booking, Driver } from '@global/types.ts';
import ActiveBookingsTable from './ActiveBookingsTable';

interface ActiveContractsProps {
  bookings: Booking[];
  drivers: Driver[];
  onCreateContract?: (bookingId: string) => void;
}

export default function ActiveContracts({ bookings, drivers, onCreateContract }: ActiveContractsProps) {
  const handleCreateContract = (bookingId: string) => {
    if (onCreateContract) {
      onCreateContract(bookingId);
    }
  };

  return (
    <div className="mt-8">
      <ActiveBookingsTable
        bookings={bookings}
        drivers={drivers}
        onCreateContract={handleCreateContract}
      />
    </div>
  );
}