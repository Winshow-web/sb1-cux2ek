import React, { useEffect, useState } from "react";
import { getTokenFromCookies } from '@global/token'; // Assuming this is the method to get the token
import {Booking, BookingStatus, User} from '@global/types'; // Import Booking interface and BookingStatus enum
import { useNavigate } from 'react-router-dom';

interface BookingResponse {
    message: string;
    data: Booking[];
}

interface BookingProps {
    user: User;
    baseUrl: string;
}

const Bookings: React.FC<BookingProps> = ({ user, baseUrl }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = getTokenFromCookies();
                if (!token) {
                    navigate('/'); // Redirect if no token (i.e., user is not authenticated)
                    return;
                }

                const response = await fetch(`${baseUrl}/booking/driver/load?driverId=${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: BookingResponse = await response.json();
                    setBookings(data.data);  // Set the bookings data
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
    }, [navigate]);

    if (loading) {
        return <p>Loading bookings...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Your Bookings</h1>
            {bookings.length === 0 ? (
                <p>No bookings available.</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.booking_id}>
                            <h3>Route: {booking.route}</h3>
                            <p>Status: {BookingStatus[booking.status as keyof typeof BookingStatus]}</p>
                            <p>Start Date: {new Date(booking.start_date).toLocaleString()}</p>
                            <p>End Date: {new Date(booking.end_date).toLocaleString()}</p>
                            {booking.requirements && <p>Requirements: {booking.requirements}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Bookings;
