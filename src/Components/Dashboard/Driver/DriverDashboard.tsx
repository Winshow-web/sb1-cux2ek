import { useEffect, useState } from 'react';
import { User, Driver } from '@global/types.ts';
import DriverInfo from './Components/DriverInfo';
import DriverBookings from './Components/DriverBookings';
import DriverDashboardLayout from './Components/DriverDashboardLayout';

enum DriverTab {
    info = 'info',
    booking = 'booking',
}

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
    const [tab, setTab] = useState<DriverTab>(DriverTab.info); // Default tab

    const fetchDriverProfile = async (id: string) => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('user not authenticated. Please log in to continue.');
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
                setDriverProfile(data);
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

    // Function to render content based on selected tab
    const renderContent = () => {
        switch (tab) {
            case DriverTab.info:
                return <DriverInfo driver={driverProfile} />;
            case DriverTab.booking:
                return <DriverBookings
                    driver={driverProfile}
                    baseUrl={baseUrl}
                    getTokenFromCookies={getTokenFromCookies}
                />;
            default:
                return <div>Select a tab to view content.</div>;
        }
    };

    return (
        <DriverDashboardLayout
            mainContent={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Dashboard Navigation */}
                    <div className="mb-8 border-b border-gray-200">
                        <nav className="flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setTab(DriverTab.info)}
                                className={`${
                                    tab === DriverTab.info
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Info
                            </button>
                            <button
                                onClick={() => setTab(DriverTab.booking)}
                                className={`${
                                    tab === DriverTab.booking
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Bookings
                            </button>
                        </nav>
                    </div>

                    {/* Dashboard Content */}
                    <div>{renderContent()}</div>
                </div>
            }
            sidebar={null}
        />
    );
}
