import React, { useState } from 'react';
import { ClientFormSubmit, User } from '@global/types.ts';
import {getTokenFromCookies} from "@global/token";

interface ClientFormProps {
    user: User;
    baseUrl: string;
    setUser: (user: User) => void;
}

export default function ClientForm({ user, baseUrl, setUser }: ClientFormProps) {
    const [formData, setFormData] = useState({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: '',
        photo: null as File | null,
    });

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

    const handleClientSubmit = async (clientData: ClientFormSubmit): Promise<void> => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('User not authenticated. Please log in to continue.');
                console.error('User not authenticated');
                return;
            }

            const formData = new FormData();
            formData.append('id', clientData.id);
            formData.append('name', clientData.name);
            formData.append('email', clientData.email);
            formData.append('phone', clientData.phone);

            if (clientData.photo instanceof File) {
                formData.append('photo', clientData.photo);
            } else {
                console.error('Invalid photo file');
                alert('Please upload a valid photo.');
                return;
            }

            console.log(clientData);

            const response = await fetch(`${baseUrl}/form/client`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Client request submitted successfully:', data);
                setUser(data.user);
            } else {
                const errorData = await response.json();
                console.error('Client registration failed:', errorData);
                alert('Client registration failed: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting client form:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const clientData: ClientFormSubmit = {
            id: formData.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            photo: formData.photo!,
        };

        handleClientSubmit(clientData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Client Form</h2>

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
                    <label className="block text-lg font-medium text-gray-700">Photo</label>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        required
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-indigo-700"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
