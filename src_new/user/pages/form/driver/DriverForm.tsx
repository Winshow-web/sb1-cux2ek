import React, { useState } from 'react';
import { DriverFormSubmit, User } from '@global/types.ts';
import {getTokenFromCookies} from "@global/token";
import {useNavigate} from "react-router-dom";

interface DriverFormProps {
    user: User;
    baseUrl: string;
    setUser: (user: User) => void;
}

export default function DriverForm({ user, baseUrl, setUser }: DriverFormProps) {
    const [formData, setFormData] = useState({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: '',
        experience: '',
        licenseType: '',
        specializations: [] as string[],
        serviceArea: '',
        photo: null as File | null,
        newSpecialization: '',
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === 'file' && e.target instanceof HTMLInputElement) {
            const files = e.target.files;
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

    const addSpecialization = () => {
        if (formData.newSpecialization.trim()) {
            setFormData({
                ...formData,
                specializations: [...formData.specializations, formData.newSpecialization.trim()],
                newSpecialization: '',
            });
        }
    };

    const removeSpecialization = (index: number) => {
        setFormData({
            ...formData,
            specializations: formData.specializations.filter((_, i) => i !== index),
        });
    };

    const handleDriverSubmit = async (driverData: DriverFormSubmit): Promise<void> => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('User not authenticated. Please log in to continue.');
                console.error('User not authenticated');
                return;
            }

            const formData = new FormData();
            formData.append('id', driverData.id);
            formData.append('name', driverData.name);
            formData.append('email', driverData.email);
            formData.append('phone', driverData.phone);
            formData.append('experience', String(driverData.experience));
            formData.append('licenseType', driverData.licenseType);
            formData.append('specializations', driverData.specializations.join(','));
            formData.append('serviceArea', driverData.serviceArea);

            if (driverData.photo instanceof File) {
                formData.append('photo', driverData.photo);
            } else {
                console.error('Invalid photo file');
                alert('Please upload a valid photo.');
                return;
            }

            const response = await fetch(`${baseUrl}/form/driver`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                navigate('/form_pending/driver');
            } else {
                const errorData = await response.json();
                console.error('Driver registration failed:', errorData);
                alert('Driver registration failed: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting driver form:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const driverData: DriverFormSubmit = {
            id: formData.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            experience: formData.experience,
            licenseType: formData.licenseType,
            specializations: formData.specializations,
            serviceArea: formData.serviceArea,
            photo: formData.photo!,
        };

        handleDriverSubmit(driverData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Driver Form</h2>

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
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-700">Experience (years)</label>
                    <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
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
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-700">Specializations</label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            name="newSpecialization"
                            value={formData.newSpecialization}
                            onChange={handleChange}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        <button type="button" onClick={addSpecialization} className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md">
                            +
                        </button>
                    </div>
                    <div className="mt-2">
                        {formData.specializations.map((specialization, index) => (
                            <div key={index} className="flex justify-between items-center mt-2">
                                <span>{specialization}</span>
                                <button type="button" onClick={() => removeSpecialization(index)} className="text-red-600">
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
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-700">Photo</label>
                    <input type="file" name="photo" accept="image/*" onChange={handleChange} required className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>

                <button type="submit" className="mt-6 w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-indigo-700">
                    Submit
                </button>
            </div>
        </form>
    );
}
