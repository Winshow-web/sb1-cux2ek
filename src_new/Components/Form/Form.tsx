import React, { useState } from 'react';
import { AccountType, Client, DriverForm } from '../../types.ts';

interface FormProps {
    id: string;
    name: string;
    email: string;
    account_type: AccountType;
    onSubmitDriverForm: (driverData: DriverForm) => void;
    onSubmitClientForm: (clientData: Client) => void;
}

export default function Form({
                                 id,
                                 name,
                                 email,
                                 account_type,
                                 onSubmitDriverForm,
                                 onSubmitClientForm,
                             }: FormProps) {
    // Add newSpecialization to the formData state
    const [formData, setFormData] = useState({
        id,
        name,
        email,
        phone: '',
        experience: '',
        licenseType: '',
        specializations: [] as string[], // Start with an empty array for specializations
        serviceArea: '',
        photo: null as File | null,
        newSpecialization: '', // This is the new field for the input
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'file' && e.target instanceof HTMLInputElement) {
            const files = e.target.files; // Explicitly access files
            setFormData({
                ...formData,
                [name]: files ? files[0] : null,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Add a new specialization to the list
    const addSpecialization = () => {
        if (formData.newSpecialization.trim() !== '') {
            setFormData({
                ...formData,
                specializations: [...formData.specializations, formData.newSpecialization],
                newSpecialization: '', // Reset input field after adding
            });
        }
    };

    // Remove a specialization from the list
    const removeSpecialization = (index: number) => {
        const updatedSpecializations = formData.specializations.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            specializations: updatedSpecializations,
        });
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (account_type === AccountType.driver_new) {
            // For driver, we need to pass driver data
            const driverData: DriverForm = {
                id: id,
                name: formData.name,
                email: email,
                phone: formData.phone,
                experience: formData.experience,
                licenseType: formData.licenseType,
                specializations: formData.specializations,
                serviceArea: formData.serviceArea,
                photo: formData.photo?.name || '', // Use filename or handle the photo upload separately
            };
            onSubmitDriverForm(driverData);
        } else if (account_type === AccountType.client_new) {
            // For client, we need to pass client data
            const clientData: Client = {
                id: formData.name, // Assuming `name` is treated as ID here
                phone: formData.phone,
            };
            onSubmitClientForm(clientData);
        }
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
                    Join Our Network of Bus Drivers
                </h1>
                <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                    Fill out the form below to apply as a bus driver or client. Start connecting with experienced drivers today.
                </p>

                <form onSubmit={handleSubmit} className="mt-12 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Name</label>
                                {/* Display name as text */}
                                <span className="mt-2 block px-4 py-2 text-gray-600">{formData.name}</span>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Email</label>
                                {/* Display email as text */}
                                <span className="mt-2 block px-4 py-2 text-gray-600">{formData.email}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {account_type === AccountType.driver_new && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700">Experience (years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700">License Type</label>
                                        <input
                                            type="text"
                                            name="licenseType"
                                            value={formData.licenseType}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Specializations</label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            name="newSpecialization"
                                            value={formData.newSpecialization}
                                            onChange={handleChange}
                                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSpecialization}
                                            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        {formData.specializations.map((specialization, index) => (
                                            <div key={index} className="flex justify-between items-center mt-2">
                                                <span>{specialization}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpecialization(index)}
                                                    className="ml-2 text-red-600"
                                                >
                                                    -
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Service Area</label>
                                    <input
                                        type="text"
                                        name="serviceArea"
                                        value={formData.serviceArea}
                                        onChange={handleChange}
                                        required
                                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Photo</label>
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handleChange}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}