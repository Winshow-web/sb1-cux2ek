import React, { useEffect, useState } from "react";
import { getTokenFromCookies } from '@global/token';
import { BookingRequest, User } from '@global/types';
import { useNavigate } from 'react-router-dom';
import AppliedDrivers from './components/AppliedDrivers';

interface BookingRequestResponse {
    message: string;
    data: BookingRequest[];
}

interface BookingRequestsProps {
    user: User;
    baseUrl: string;
}

const BookingRequests: React.FC<BookingRequestsProps> = ({ user, baseUrl }) => {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null); // State to hold selected booking for the modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = getTokenFromCookies();
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await fetch(`${baseUrl}/booking/client/load_request?clientId=${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: BookingRequestResponse = await response.json();
                    setBookings(data.data.map((booking) => ({
                        ...booking,
                        start_date: new Date(booking.start_date),
                        end_date: new Date(booking.end_date),
                    })));
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to load bookings');
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('An error occurred while fetching bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate, baseUrl, user.id]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading booking requests...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    const getDriverCount = (driver_ids: string[] | null): string => {
        if (!driver_ids || driver_ids.length === 0) {
            return 'No drivers have applied';
        }
        return `${driver_ids.length} ${driver_ids.length === 1 ? 'driver' : 'drivers'} applied`;
    };

    const handleViewDrivers = (booking: BookingRequest) => {
        setSelectedBooking(booking);
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {bookings.length === 0 ? (
                <p className="text-center text-gray-500">No bookings available.</p>
            ) : (
                <ul className="space-y-4">
                    {bookings.map((booking) => (
                        <li
                            key={booking.booking_id}
                            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200"
                        >
                            <h3 className="text-xl font-semibold text-gray-800">Route: {booking.route}</h3>
                            <p className="text-gray-600">Start Date: {booking.start_date.toLocaleString()}</p>
                            <p className="text-gray-600">End Date: {booking.end_date.toLocaleString()}</p>
                            {booking.requirements && <p className="text-gray-600">Requirements: {booking.requirements}</p>}
                            <p className="text-gray-600">
                                {getDriverCount(booking.driver_ids)}
                            </p>
                            {booking.driver_ids && booking.driver_ids.length > 0 && (
                                <button
                                    onClick={() => handleViewDrivers(booking)}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-gray-600 rounded-lg hover:bg-blue-700"
                                >
                                    View Applied Drivers
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {selectedBooking && (
                <AppliedDrivers
                    baseUrl={baseUrl}
                    bookingId={selectedBooking.booking_id}
                    driverIds={selectedBooking.driver_ids}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default BookingRequests;
