import { useEffect, useState } from 'react';
import {DriverForm, User} from '@global/types.ts';
import {getTokenFromCookies} from "@global/token";

interface DriverFormPendingProps {
    user: User;
    baseUrl: string;
}

export default function DriverFormPending({ user, baseUrl }: DriverFormPendingProps) {
    const [formData, setFormData] = useState<DriverForm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDriverForm = async (): Promise<DriverForm> => {
        const response = await fetch(`${baseUrl}/form/load`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getTokenFromCookies()}`,
            },
        });
        const data = await response.json();
        if (data.registrationData?.type === 'driver') {
            return data.registrationData.data;
        } else {
            throw new Error('Driver data not found');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const driverData = await fetchDriverForm();
                setFormData(driverData);
            } catch (error) {
                console.error('Error during fetch:', error);
                setError('Failed to fetch driver data. Please try again later.');
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
        return <div className="text-red-500 text-xl">No driver form data available.</div>;
    }

    return (
        <div className="relative bg-indigo-800 py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
                <img
                    className="w-full h-full object-cover opacity-30"
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"
                    alt="Driver"
                />
                <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
            </div>
            <div className="relative max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Driver Pending Form Details
                </h1>

                <div className="mt-12 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Name</label>
                            <span className="mt-2 block px-4 py-2 text-gray-600">{formData.name}</span>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Experience (years)</label>
                            <span className="mt-2 block px-4 py-2 text-gray-600">{formData.experience}</span>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">License Type</label>
                            <span className="mt-2 block px-4 py-2 text-gray-600">{formData.licenseType}</span>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Photo</label>
                            <img
                                className="mt-2 w-24 h-24 object-cover border rounded-md"
                                src={formData.photo}
                                alt="Driver"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
