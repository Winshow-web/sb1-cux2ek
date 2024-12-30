import { useEffect, useState } from 'react';
import {ClientForm, User} from '@global/types.ts';
import {getTokenFromCookies} from "@global/token";

interface ClientFormPendingProps {
    user: User;
    baseUrl: string;
}

export default function ClientFormPending({ user, baseUrl }: ClientFormPendingProps) {
    const [formData, setFormData] = useState<ClientForm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClientForm = async (): Promise<ClientForm> => {
        const response = await fetch(`${baseUrl}/form/load`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getTokenFromCookies()}`,
            },
        });
        const data = await response.json();
        if (data.registrationData?.type === 'client') {
            return data.registrationData.data;
        } else {
            throw new Error('Clients data not found');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const clientData = await fetchClientForm();
                setFormData(clientData);
            } catch (error) {
                console.error('Error during fetch:', error);
                setError('Failed to fetch client data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user.account_type]);

    if (isLoading) {
        return <div className="text-white text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-xl">{error}</div>;
    }

    if (!formData) {
        return <div className="text-red-500 text-xl">No client form data available.</div>;
    }

    return (
        <div className="relative bg-indigo-800 py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
                <img
                    className="w-full h-full object-cover opacity-30"
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"
                    alt="Client"
                />
                <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
            </div>
            <div className="relative max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Client Pending Form Details
                </h1>

                <div className="mt-12 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Name</label>
                            <span className="mt-2 block px-4 py-2 text-gray-600">{formData.name}</span>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Email</label>
                            <span className="mt-2 block px-4 py-2 text-gray-600">{formData.email}</span>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Phone</label>
                            <span className="mt-2 block px-4 py-2 text-gray-600">{formData.phone}</span>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Photo</label>
                            <img
                                className="mt-2 w-24 h-24 object-cover border rounded-md"
                                src={formData.photo}
                                alt="Client"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
