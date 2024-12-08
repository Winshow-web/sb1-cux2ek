import { useState } from 'react';
import type { Driver, Booking } from '../../../../types';
import DriverStats from './DriverStats';
import EarningsCard from './EarningsCard';
import UpcomingTrips from './UpcomingTrips';
import AvailableJobs from './AvailableJobs';
import ExpenseClaims from '../../Components/ExpenseClaims';
import RideHistory from './RideHistory';
import ProfileCard from "../../Components/ProfileCard";

interface DriverDashboardContentProps {
  driver: Driver;
  bookings: Booking[];
  onUpdateAvailability: (available: boolean) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onUpdateDriver?: (updatedDriver: Driver) => void;
}

export default function DriverDashboardContent({
  driver,
  bookings,
  onUpdateAvailability,
  onUpdateBookingStatus,
  onUpdateDriver,
}: DriverDashboardContentProps) {
  const [activeSection, setActiveSection] = useState<'schedule' | 'jobs' | 'expenses' | 'history'>('schedule');

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Profile and Stats */}
      <div className="lg:col-span-1 space-y-8">
        <ProfileCard
          driver={driver}
          onViewSection={setActiveSection}
          activeSection={activeSection}
          onUpdateDriver={onUpdateDriver}
        />
        <DriverStats
          totalTrips={completedBookings.length}
          pendingRequests={pendingBookings.length}
          rating={driver.rating}
        />
        <EarningsCard bookings={bookings} />
      </div>

      {/* Right Column - Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {activeSection === 'schedule' && (
          <UpcomingTrips
            bookings={confirmedBookings}
            onUpdateStatus={onUpdateBookingStatus}
          />
        )}
        {activeSection === 'jobs' && (
          <AvailableJobs
            driver={driver}
            onUpdateAvailability={onUpdateAvailability}
          />
        )}
        {activeSection === 'expenses' && (
          <ExpenseClaims />
        )}
        {activeSection === 'history' && (
          <RideHistory bookings={bookings} drivers={[driver]} />
        )}
      </div>
    </div>
  );
}