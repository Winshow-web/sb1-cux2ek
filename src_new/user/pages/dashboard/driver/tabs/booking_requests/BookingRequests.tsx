import React, { useEffect, useState } from "react";
import { getTokenFromCookies } from '@global/token';
import { BookingRequest, User } from '@global/types';
import { useNavigate } from 'react-router-dom';

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

    const [applyError, setApplyError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = getTokenFromCookies();
                if (!token) {
                    navigate('/'); // Redirect if no token
                    return;
                }

                const response = await fetch(`${baseUrl}/booking/driver/load_request`, {
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

    const handleApply = async (bookingId: string) => {
        setApplyError(null);
        setSuccessMessage(null);
        try {
            const token = getTokenFromCookies();
            if (!token) {
                navigate('/'); // Redirect if no token
                return;
            }

            const response = await fetch(`${baseUrl}/booking/driver/apply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    driverId: user.id,
                }),
            });

            if (response.ok) {
                setSuccessMessage(`Successfully applied to booking with ID: ${bookingId}`);
            } else {
                const errorData = await response.json();
                setApplyError(errorData.error || 'Failed to apply for the booking.');
            }
        } catch (err) {
            console.error('Error applying to booking:', err);
            setApplyError('An error occurred while applying to the booking.');
        }
    };

    if (loading) {
        return <p className="text-center text-gray-600">Loading booking requests...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Booking Requests</h1>
            {applyError && <p className="text-red-500">{applyError}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
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
                            {booking.requirements &&
                                <p className="text-gray-600">Requirements: {booking.requirements}</p>}
                            <button
                                onClick={() => handleApply(booking.booking_id)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Apply
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingRequests;
