import { useEffect, useState } from 'react';
import { User, Driver, Booking } from '../../../types.ts';
import { ErrorBoundary } from './Components/ErrorBoundary';
import DriverDashboardLayout from './Components/DriverDashboardLayout';
import DriverDashboardContent from './Components/DriverDashboardContent';
import DriverDashboardSidebar from './Components/DriverDashboardSidebar';

interface DriverDashboardProps {
    user: User;
    baseUrl: string;
    getTokenFromCookies: () => string | null;
}

export default function DriverDashboard({
                                            user,
                                            baseUrl,
                                            getTokenFromCookies,
                                        }: DriverDashboardProps) {
    const [driverProfile, setDriverProfile] = useState<Driver | null>(null);

    // Mock data for bookings and allUsers
    const bookings: Booking[] = []; // Replace with real data or fetch logic
    const allUsers: User[] = []; // Replace with real data or fetch logic

    // Mock function for updating availability
    const onUpdateAvailability = (available: boolean) => {
        console.log(`Driver availability updated to: ${available}`);
    };

    // Mock function for updating booking status
    const onUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
        console.log(`Booking ${bookingId} status updated to: ${status}`);
    };

    // Mock function for updating driver profile
    const onUpdateDriver = (updatedDriver: Driver) => {
        console.log('Driver profile updated:', updatedDriver);
    };

    // Fetch the driver profile from the API
    const fetchDriverProfile = async (id: string) => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('User not authenticated. Please log in to continue.');
                return;
            }

            const response = await fetch(`${baseUrl}/profile/driver/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDriverProfile(data); // Set the fetched data into state
            } else {
                const errorData = await response.json();
                console.error('Error fetching driver profile:', errorData);
                alert('Failed to fetch driver profile: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching driver profile:', error);
            alert('An error occurred while fetching the driver profile. Please try again later.');
        }
    };

    useEffect(() => {
        // If user exists and has an id, fetch driver profile
        if (user && user.id) {
            fetchDriverProfile(user.id);
        }
    }, [user, baseUrl, getTokenFromCookies]);

    if (!driverProfile) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading driver data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <DriverDashboardLayout
                mainContent={
                    <DriverDashboardContent
                        driver={driverProfile}
                        bookings={bookings}
                        onUpdateAvailability={onUpdateAvailability}
                        onUpdateBookingStatus={onUpdateBookingStatus}
                        onUpdateDriver={onUpdateDriver}
                    />
                }
                sidebar={
                    <DriverDashboardSidebar
                        currentUser={user}
                        allUsers={allUsers}
                    />
                }
            />
        </ErrorBoundary>
    );
}
