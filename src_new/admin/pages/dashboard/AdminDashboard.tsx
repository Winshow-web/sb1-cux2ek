import { useState } from 'react';
import { AdminTab, Client, ClientForm, Driver, DriverForm } from "@global/types.ts";
import DriverFormPending from "./Components/DriverForms/DriverFormPending.tsx";
import ClientFormPending from "./Components/ClientForms/ClientFormPending.tsx";
import Drivers from "./Components/Drivers/Drivers.tsx";
import Clients from "./Components/Clients/Clients.tsx";
import { Users, UserCheck, Clock, Calendar,  } from 'lucide-react';

interface AdminDashboardProps {
    baseUrl: string;
    onLogout: () => void;
}

export default function AdminDashboard({ baseUrl, onLogout }: AdminDashboardProps) {
    const [tab, setTab] = useState<AdminTab>(AdminTab.driver_form_pending);
    const [error, setError] = useState<string | null>(null);

    const tabs = [
        { id: AdminTab.driver_form_pending, name: 'Driver Form Pending', icon: Clock },
        { id: AdminTab.client_form_pending, name: 'Client Form Pending', icon: Calendar },
        { id: AdminTab.drivers, name: 'Drivers', icon: Users },
        { id: AdminTab.clients, name: 'Clients', icon: UserCheck },
    ] as const;

    const getTokenFromCookies = (): string | null => {
        const match = document.cookie.match(/(^| )authToken=([^;]+)/);
        return match ? match[2] : null;  // Return the token or null if not found
    };

    const fetchDriverForms = async (): Promise<DriverForm[]> => {
        try {
            const token = getTokenFromCookies();
            const response = await fetch(`${baseUrl}/admin/forms/drivers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch driver forms", response.statusText);
                setError(`Error: ${response.statusText}`);
                return [];
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error("Unexpected response format:", data);
                setError("Unexpected response format");
                return [];
            }
            return data;
        } catch (error) {
            console.error("Error fetching driver forms:", error);
            setError("Network or server error");
            return [];
        }
    };

    const fetchClientForms = async (): Promise<ClientForm[]> => {
        try {
            const token = getTokenFromCookies();
            const response = await fetch(`${baseUrl}/admin/forms/clients`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch client forms", response.statusText);
                setError(`Error: ${response.statusText}`);
                return [];
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error("Unexpected response format:", data);
                setError("Unexpected response format");
                return [];
            }
            return data;
        } catch (error) {
            console.error("Error fetching client forms:", error);
            setError("Network or server error");
            return [];
        }
    };

    const Approve = async (account_type: string, id: string) => {
        try {
            const token = getTokenFromCookies();
            const response = await fetch(`${baseUrl}/admin/request/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_type: account_type,
                    id: id,
                }),
            });
            if (!response.ok) {
                console.error("Failed to approve form", response.statusText);
                setError(`Error: ${response.statusText}`);
                return;
            }
            alert("Form approved successfully.");
        } catch (error) {
            console.error("Error approving form:", error);
            setError("Network or server error");
        }
    };

    const Reject = async (account_type: string, id: string) => {
        try {
            const token = getTokenFromCookies();
            const response = await fetch(`${baseUrl}/admin/request/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ account_type, id }),
            });
            if (!response.ok) {
                console.error("Failed to reject form", response.statusText);
                setError(`Error: ${response.statusText}`);
                return;
            }
            alert("Form rejected successfully.");
        } catch (error) {
            console.error("Error rejecting form:", error);
            setError("Network or server error");
        }
    };

    const fetchDrivers = async (): Promise<Driver[]> => {
        try {
            const token = getTokenFromCookies();
            const response = await fetch(`${baseUrl}/admin/profiles/drivers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch drivers", response.statusText);
                setError(`Error: ${response.statusText}`);
                return [];
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error("Unexpected response format:", data);
                setError("Unexpected response format");
                return [];
            }
            return data;
        } catch (error) {
            console.error("Error fetching drivers:", error);
            setError("Network or server error");
            return [];
        }
    };

    const fetchClients = async (): Promise<Client[]> => {
        try {
            const token = getTokenFromCookies();
            const response = await fetch(`${baseUrl}/admin/profiles/clients`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch clients", response.statusText);
                setError(`Error: ${response.statusText}`);
                return [];
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error("Unexpected response format:", data);
                setError("Unexpected response format");
                return [];
            }
            return data;
        } catch (error) {
            console.error("Error fetching clients:", error);
            setError("Network or server error");
            return [];
        }
    };

    const renderContent = () => {
        switch (tab) {
            case AdminTab.driver_form_pending:
                return (
                    <DriverFormPending
                        onFetchDriverForms={fetchDriverForms}
                        onApprove={Approve}
                        onReject={Reject}
                    />
                );
            case AdminTab.client_form_pending:
                return (
                    <ClientFormPending
                        onFetchClientForms={fetchClientForms}
                        onApprove={Approve}
                        onReject={Reject}
                    />
                );
            case AdminTab.drivers:
                return <Drivers onFetchDrivers={fetchDrivers} />;
            case AdminTab.clients:
                return <Clients onFetchClients={fetchClients} />;
            default:
                return <div>Select a tab to view content.</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-gray-600 px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {/* Dashboard Navigation */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tabItem) => (
                        <button
                            key={tabItem.id}
                            onClick={() => setTab(tabItem.id)}
                            className={`${
                                tab === tabItem.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            <tabItem.icon className="h-5 w-5 mr-2" />
                            {tabItem.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Dashboard Content */}
            <div>{renderContent()}</div>
        </div>
    );
}
