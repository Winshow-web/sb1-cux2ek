import React, { useState, useEffect } from 'react';
import {Booking, BookingStatus, Driver} from '@global/types.ts';

interface DriverBookingsProps {
    driver: Driver;
    baseUrl: string;
    getTokenFromCookies: () => string | null;
}

const DriverBookings: React.FC<DriverBookingsProps> = ({ driver, baseUrl, getTokenFromCookies }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    let driverUuid = driver.id;

    // Fetch bookings for the driver
    const fetchBookings = async () => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('user not authenticated. Please log in to continue.');
                return;
            }



            const response = await fetch(`${baseUrl}/bookings/driver/${driverUuid}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                const errorData = await response.json();
                console.error('Error fetching driver bookings:', errorData);
                alert('Failed to fetch driver bookings: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching driver bookings:', error);
            alert('An error occurred while fetching the bookings. Please try again later.');
        }
    };

    useEffect(() => {
        if (driverUuid) {
            fetchBookings();
        }
    }, [driverUuid, baseUrl, getTokenFromCookies]);

    // Function to handle booking status update
    const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('user not authenticated. Please log in to continue.');
                return;
            }

            const response = await fetch(`${baseUrl}/bookings/update/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                // Update the status of the booking locally
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking.booking_id === bookingId ? { ...booking, status } : booking
                    )
                );
                alert(`Booking ${status} successfully.`);
            } else {
                const errorData = await response.json();
                console.error('Error updating booking status:', errorData);
                alert('Failed to update booking status: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('An error occurred while updating the booking status. Please try again later.');
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900">Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings found.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.booking_id}
                            className="border p-4 rounded-lg shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-gray-800">{booking.route}</h3>
                                    <p className="text-gray-600">
                                        {new Date(booking.start_date).toLocaleString()} -{' '}
                                        {new Date(booking.end_date).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                                        booking.status === BookingStatus.Pending
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : booking.status === BookingStatus.Confirmed
                                                ? 'bg-blue-100 text-blue-800'
                                                : booking.status === BookingStatus.Completed
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>
                            {booking.requirements && (
                                <p className="mt-2 text-gray-500">Requirements: {booking.requirements}</p>
                            )}
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => updateBookingStatus(booking.booking_id, BookingStatus.Confirmed)}
                                    className="py-2 px-4 bg-blue-600 text-white rounded-md"
                                    disabled={booking.status !== BookingStatus.Pending}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => updateBookingStatus(booking.booking_id, BookingStatus.Completed)}
                                    className="py-2 px-4 bg-green-600 text-white rounded-md"
                                    disabled={booking.status !== BookingStatus.Confirmed}
                                >
                                    Complete
                                </button>
                                <button
                                    onClick={() => updateBookingStatus(booking.booking_id, BookingStatus.Cancelled)}
                                    className="py-2 px-4 bg-red-600 text-white rounded-md"
                                    disabled={booking.status === BookingStatus.Completed}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DriverBookings;
