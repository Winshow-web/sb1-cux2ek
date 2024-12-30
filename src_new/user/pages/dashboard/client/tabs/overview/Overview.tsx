import React, {useState} from 'react';
import DashboardOverview from './components/DashboardOverview.tsx';
import ActiveContracts from './components/ActiveContracts.tsx';
import BookingsList from './components/BookingsList.tsx';
import {Booking, BookingStatus, Driver} from '@global/types.ts';

const Overview: React.FC = () => {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const activeBookings = bookings.filter(booking => booking.status === BookingStatus.Active);
    const completedBookings = bookings.filter(booking => booking.status === BookingStatus.Completed);
    const pendingBookings = bookings.filter(booking => booking.status === BookingStatus.Pending);
    const canceledBookings = bookings.filter(booking => booking.status === BookingStatus.Cancelled);

    return (
        <>
            <DashboardOverview
                activeBookings={activeBookings.length}
                completedBookings={completedBookings.length}
                pendingBookings={pendingBookings.length}
            />
            <ActiveContracts bookings={activeBookings} drivers={drivers} />

            {bookings.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Recent Bookings
                    </h2>
                    <BookingsList bookings={bookings.slice(0, 5)} drivers={drivers} />
                </section>
            )}
        </>
    );
};

export default Overview;
