import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountType, ClientFormSubmit, User } from "@global/types";
import { getTokenFromCookies } from "@global/token";

interface ClientFormProps {
    baseUrl: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ baseUrl }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const user: User = location.state?.user;

    const [formData, setFormData] = useState({
        photo: null as File | null,
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (
            !user ||
            !user.id ||
            !user.name ||
            !user.email ||
            !user.account_type ||
            user.account_type !== AccountType.client_new
        ) {
            navigate("/");
        } else {
            setLoading(false);
        }
    }, [navigate, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === "file" && e.target instanceof HTMLInputElement) {
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
                alert("User not authenticated. Please log in to continue.");
                console.error("User not authenticated");
                return;
            }

            const requestData = new FormData();
            requestData.append("id", user.id);
            requestData.append("name", user.name);
            requestData.append("email", user.email);
            if (user.phone) {requestData.append("phone", user.phone);}

            if (clientData.photo instanceof File) {
                requestData.append("photo", clientData.photo);
            } else {
                console.error("Invalid photo file");
                alert("Please upload a valid photo.");
                return;
            }

            const response = await fetch(`${baseUrl}/api/form/client`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: requestData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Client request submitted successfully:", data);
                navigate("/signup/pending/client", { state: { user: data.user } });
            } else {
                const errorData = await response.json();
                console.error("Client registration failed:", errorData);
                alert("Client registration failed: " + (errorData.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error submitting client form:", error);
            alert("An error occurred while submitting the form. Please try again later.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const clientData: ClientFormSubmit = {
            photo: formData.photo!,
        };

        handleClientSubmit(clientData);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold mb-6">Client Form</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-lg font-medium text-gray-700">Name</label>
                    <span className="mt-2 block px-4 py-2 text-gray-600">{user.name}</span>
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-700">Email</label>
                    <span className="mt-2 block px-4 py-2 text-gray-600">{user.email}</span>
                </div>

                {user.phone && (
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Phone</label>
                        <span className="mt-2 block px-4 py-2 text-gray-600">{user.phone}</span>
                    </div>
                )}

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
};

export { ClientForm };
