import { useState } from 'react';
import type { Booking, Driver } from '../../../../../global/types.ts';
import ScheduleTableView from '../components/ScheduleTableView';

interface RouteScheduleProps {
  bookings: Booking[];
  drivers: Driver[];
}

export default function RouteSchedule({ bookings, drivers }: RouteScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
      </div>
      
      <ScheduleTableView bookings={bookings} drivers={drivers} />
    </div>
  );
}