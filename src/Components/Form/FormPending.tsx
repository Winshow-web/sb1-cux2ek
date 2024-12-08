import { useEffect, useState } from 'react';
import { AccountType, ClientForm, DriverForm } from '../../types.ts';

interface FormProps {
    account_type: AccountType;
    onFetchDriverForm: () => Promise<DriverForm>;
    onFetchClientForm: () => Promise<ClientForm>;
}

export default function FormPending({
                                        account_type,
                                        onFetchDriverForm,
                                        onFetchClientForm,
                                    }: FormProps) {
    const [formData, setFormData] = useState<DriverForm | ClientForm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);  // Set loading state to true before fetching
                setError(null); // Reset error message
                if (account_type === "driver_pending") {
                    const driverData = await onFetchDriverForm();
                    //console.log('Driver data:', driverData);
                    setFormData(driverData);
                } else if (account_type === "client_pending") {
                    const clientData = await onFetchClientForm();
                    setFormData(clientData);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setIsLoading(false);  // Set loading state to false after data is fetched
            }
        };

        fetchData();
    }, [account_type, onFetchDriverForm, onFetchClientForm]);

    if (isLoading) {
        return <div className="text-white text-xl">Loading...</div>; // Display loading state while data is being fetched
    }

    if (error) {
        return <div className="text-red-500 text-xl">{error}</div>; // Display error message if fetching fails
    }

    if (!formData) {
        return <div className="text-red-500 text-xl">No form data available.</div>; // Handle case when form data is not available
    }

    // Type checking for driver form properties
    const isDriverForm = (data: DriverForm | ClientForm): data is DriverForm => {
        return (data as DriverForm).experience !== undefined;
    };

    return (
        <div className="relative bg-indigo-800 py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
                <img
                    className="w-full h-full object-cover opacity-30"
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"
                    alt="Bus driver"
                />
                <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
            </div>
            <div className="relative max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Pending Form Details
                </h1>
                <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                    Below are the details of the pending form. You can review the data below.
                </p>

                <div className="mt-12 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Name</label>
                                <span className="mt-2 block px-4 py-2 text-gray-600">{formData.name}</span>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Email</label>
                                <span className="mt-2 block px-4 py-2 text-gray-600">{formData.email}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Phone</label>
                            <span className="mt-2 block px-4 py-2 text-gray-600">{formData.phone}</span>
                        </div>

                        {isDriverForm(formData) && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700">Experience (years)</label>
                                        <span className="mt-2 block px-4 py-2 text-gray-600">{formData.experience}</span>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700">License Type</label>
                                        <span className="mt-2 block px-4 py-2 text-gray-600">{formData.licenseType}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Specializations</label>
                                    <div className="mt-2">
                                        {formData.specializations.map((specialization, index) => (
                                            <div key={index} className="flex justify-between items-center mt-2">
                                                <span>{specialization}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Service Area</label>
                                    <span className="mt-2 block px-4 py-2 text-gray-600">{formData.serviceArea}</span>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Photo</label>
                            <img
                                className="mt-2 w-24 h-24 object-cover border rounded-md"
                                src={formData.photo} // Assuming photo is a URL string
                                alt="Driver or Client"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
