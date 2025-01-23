import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountType, DriverFormSubmit, User } from "@global/types";
import { getTokenFromCookies } from "@global/token";

interface DriverFormProps {
    baseUrl: string;
}

const DriverForm: React.FC<DriverFormProps> = ({ baseUrl }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const user: User = location.state?.user;

    const [formData, setFormData] = useState({
        experience: "",
        licenseType: "",
        specializations: [] as string[],
        serviceArea: "",
        photo: null as File | null,
        newSpecialization: ""
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
            user.account_type !== AccountType.driver_new
        ) {
            navigate("/");
        } else {
            setLoading(false);
        }
    }, [navigate, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const file = (e.target.files && e.target.files[0]) || null;
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const addSpecialization = () => {
        if (formData.newSpecialization.trim()) {
            setFormData((prev) => ({
                ...prev,
                specializations: [...prev.specializations, formData.newSpecialization.trim()],
                newSpecialization: ""
            }));
        }
    };

    const removeSpecialization = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            specializations: prev.specializations.filter((_, i) => i !== index),
        }));
    };

    const handleDriverSubmit = async (driverData: DriverFormSubmit): Promise<void> => {
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
            requestData.append("experience", driverData.experience);
            requestData.append("licenseType", driverData.licenseType);
            requestData.append("specializations", JSON.stringify(driverData.specializations));
            requestData.append("serviceArea", driverData.serviceArea);

            if (user.phone) {
                requestData.append("phone", user.phone);
            }

            if (driverData.photo instanceof File) {
                requestData.append("photo", driverData.photo);
            } else {
                alert("Please upload a valid photo.");
                return;
            }

            const response = await fetch(`${baseUrl}/api/form/driver`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: requestData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Driver request submitted successfully:", data);
                navigate("/signup/pending/driver", { state: { user: data.user } });
            } else {
                const errorData = await response.json();
                alert("Driver registration failed: " + (errorData.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error submitting driver form:", error);
            alert("An error occurred while submitting the form. Please try again later.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const driverData: DriverFormSubmit = {
            experience: formData.experience,
            licenseType: formData.licenseType,
            specializations: formData.specializations,
            serviceArea: formData.serviceArea,
            photo: formData.photo!,
        };

        handleDriverSubmit(driverData);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
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
                    <label className="block text-lg font-medium text-gray-700">Experience</label>
                    <input
                        type="text"
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
                                    className="text-red-600"
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
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
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
                    className="w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-indigo-700"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export { DriverForm };
