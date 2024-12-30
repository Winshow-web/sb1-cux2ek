import { useEffect, useState } from 'react';
import {User, Driver, DriverTab} from '@global/types.ts';
import {getTokenFromCookies} from "@global/token";
import Navbar from "./NavBar";
import Overview from "./tabs/overview/Overview";
import Bookings from "./tabs/bookings/Bookings";
import BookingRequests from "./tabs/booking_requests/BookingRequests";

interface DriverDashboardProps {
    user: User;
    baseUrl: string;
    onLogout: () => void;
}

export default function DriverDashboard({
                                            user,
                                            baseUrl,
                                            onLogout
                                        }: DriverDashboardProps) {
    const [driverProfile, setDriverProfile] = useState<Driver | null>(null);
    const [activeTab, setActiveTab] = useState<DriverTab | null>(DriverTab.Overview);

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Navbar user={user} onLogout={onLogout} setActiveTab={setActiveTab} />
            <div className="flex gap-8 mt-8">
                <div className="flex-1">
                    {activeTab === DriverTab.Overview && driverProfile && <Overview driver={driverProfile}/>}
                    {activeTab === DriverTab.Bookings && <Bookings user={user} baseUrl={baseUrl}/>}
                    {activeTab === DriverTab.Booking_Requests && <BookingRequests user={user} baseUrl={baseUrl}/>}
                </div>
            </div>
        </div>
    );
}
