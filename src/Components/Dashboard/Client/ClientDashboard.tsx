import { useEffect, useState } from 'react';
import type { Client, User, Driver, Booking } from '@global/types.ts';
import DriverCard from './Components/DriverCard.tsx';
import BookingsList from './Components/BookingsList.tsx';
import DashboardOverview from './Components/DashboardOverview.tsx';
import ActiveContracts from './Components/ActiveContracts';
import RouteSchedule from './Components/RouteSchedule';
import InvoiceList from '../Components/Invoice/InvoiceList.tsx';
import Navbar from './NavBar';

interface ClientDashboardProps {
    user: User;
    baseUrl: string;
    getTokenFromCookies: () => string | null;
    onLogout: () => void;
}

const TABS = [
    { id: 'overview', name: 'Overview' },
    { id: 'drivers', name: 'Find Drivers' },
    { id: 'schedule', name: 'Schedule' },
    { id: 'invoices', name: 'Invoices' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function ClientDashboard({
                                            user, baseUrl, getTokenFromCookies, onLogout
                                        }: ClientDashboardProps) {

    const [clientProfile, setClientProfile] = useState<Client | null>(null);
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    let bookings: Booking[] = [];
    let drivers: Driver[] = [];

    const activeBookings = bookings.filter(b => b.status === 'confirmed');
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');

    const onBook = async (id: string) => {
        console.log('booked id', id);
    }

    const fetchClientProfile = async (id: string) => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('user not authenticated. Please log in to continue.');
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
    }, [user, baseUrl, getTokenFromCookies]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Navbar with Tabs */}
            <Navbar
                user={user}
                onLogout={() => onLogout}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content */}
            <div className="flex gap-8 mt-8">
                <div className="flex-1">
                    {activeTab === 'overview' && (
                        <>
                            <DashboardOverview
                                activeBookings={activeBookings.length}
                                completedBookings={completedBookings.length}
                                pendingBookings={pendingBookings.length}
                            />
                            <ActiveContracts
                                bookings={activeBookings}
                                drivers={drivers}
                            />

                            {bookings.length > 0 && (
                                <section className="mt-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Bookings</h2>
                                    <BookingsList bookings={bookings.slice(0, 5)} drivers={drivers} />
                                </section>
                            )}
                        </>
                    )}

                    {activeTab === 'drivers' && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Drivers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {drivers
                                    .filter((driver) => driver.availability)
                                    .map((driver) => (
                                        <DriverCard
                                            key={driver.id}
                                            driver={driver}
                                            onBook={onBook}
                                        />
                                    ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'schedule' && (
                        <RouteSchedule bookings={bookings} drivers={drivers} />
                    )}

                    {activeTab === 'invoices' && (
                        <InvoiceList bookings={bookings} />
                    )}
                </div>
            </div>
        </div>
    );
}
