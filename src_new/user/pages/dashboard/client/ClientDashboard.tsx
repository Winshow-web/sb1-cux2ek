import { useEffect, useState } from 'react';
import { Client, User } from '@global/types.ts';
import Navbar from './NavBar';
import { getTokenFromCookies } from '@global/token';
import Overview from './tabs/overview/Overview';
import Schedule from './tabs/schedule/Schedule';
import Bookings from './tabs/bookings/Bookings';
import Invoices from './tabs/invoices/Invoices';
import { ClientTab } from '@global/types.ts';
import Book from "./tabs/book/components/Book";
import BookingRequests from "./tabs/booking_requests/BookingRequests";

interface ClientDashboardProps {
    user: User;
    baseUrl: string;
    onLogout: () => void;
}

export default function ClientDashboard({
                                            user, baseUrl, onLogout
                                        }: ClientDashboardProps) {
    const [clientProfile, setClientProfile] = useState<Client | null>(null);
    const [activeTab, setActiveTab] = useState<ClientTab>(ClientTab.Overview);

    const fetchClientProfile = async (id: string) => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('User not authenticated. Please log in to continue.');
                return;
            }

            const response = await fetch(`${baseUrl}/profile/client/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setClientProfile(data);
            } else {
                const errorData = await response.json();
                console.error('Error fetching client profile:', errorData);
                alert('Failed to fetch client profile: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching client profile:', error);
            alert('An error occurred while fetching the client profile. Please try again later.');
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchClientProfile(user.id);
        }
    }, [user, baseUrl, getTokenFromCookies()]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Navbar user={user} onLogout={onLogout} setActiveTab={setActiveTab} />
            <div className="flex gap-8 mt-8">
                <div className="flex-1">
                    {activeTab === ClientTab.Overview && <Overview />}
                    {activeTab === ClientTab.Schedule && <Schedule />}
                    {activeTab === ClientTab.Bookings && <Bookings user={user} baseUrl={baseUrl}/>}
                    {activeTab === ClientTab.Booking_Requests && <BookingRequests user={user} baseUrl={baseUrl}/>}
                    {activeTab === ClientTab.Book && <Book userId={user.id} baseUrl={baseUrl}/>}
                    {activeTab === ClientTab.Invoices && <Invoices />}
                </div>
            </div>
        </div>
    );
}
