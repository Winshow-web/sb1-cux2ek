import { useEffect, useState } from 'react';
import { Client, User } from '../../../types';

interface ClientDashboardProps {
    user: User;
    baseUrl: string;
    getTokenFromCookies: () => string | null;
}

export default function ClientDashboard({ user, baseUrl, getTokenFromCookies }: ClientDashboardProps) {
    const [clientProfile, setClientProfile] = useState<Client | null>(null);

    // Fetch the client profile from the API
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
                setClientProfile(data); // Set the fetched data into state
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
        // If user exists and has an id, fetch client profile
        if (user && user.id) {
            fetchClientProfile(user.id);
        }
    }, [user, baseUrl, getTokenFromCookies]);

    const displayClient = clientProfile;

    return (
        <div className="relative bg-blue-800 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            {/* Profile Container */}
            <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                {/* Client Info */}
                <div className="flex items-center space-x-6">
                    <img
                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-600"
                        src={displayClient?.photo}
                        alt={`${displayClient?.name}'s Photo`}
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{displayClient?.name}</h2>
                        <p className="text-lg text-gray-500">{displayClient?.email}</p>
                        <p className="text-lg text-gray-500">{displayClient?.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
