import React, { useState } from "react";
import { getTokenFromCookies } from "@global/token";
import { useNavigate } from "react-router-dom";

interface BookProps {
    userId: string;
    baseUrl: string;
}

const Book: React.FC<BookProps> = ({ userId, baseUrl }) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [route, setRoute] = useState<string>("");
    const [requirements, setRequirements] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = getTokenFromCookies();
        if (!token) {
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Convert startDate and endDate to UTC ISO format
            const startDateUTC = new Date(startDate).toISOString();
            const endDateUTC = new Date(endDate).toISOString();

            const response = await fetch(`${baseUrl}/booking/client/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    clientId: userId,
                    startDate: startDateUTC,
                    endDate: endDateUTC,
                    route,
                    requirements,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess("Booking request created successfully.");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create booking request.");
                console.error("Server Error:", errorData);
            }
        } catch (err) {
            console.error("Error creating booking request:", err);
            setError("An error occurred while creating the booking request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Create a Booking Request</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700">Start Date:</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">End Date:</label>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Route:</label>
                    <input
                        type="text"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Requirements (optional):</label>
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                    {loading ? "Creating Booking Request..." : "Create Booking Request"}
                </button>
            </form>
        </div>
    );
};

export default Book;
