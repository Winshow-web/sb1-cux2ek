import { useState } from 'react';
import {AdminTab, Client, ClientForm, Driver, DriverForm} from "../types";
import DriverFormPending from "./Components/DriverFormPending";
import ClientFormPending from "./Components/ClientFormPending";
import Drivers from "./Components/Drivers";
import Clients from "./Components/Clients";

interface AdminDashboardProps {
    baseUrl: string;
}

export default function AdminDashboard({baseUrl}: AdminDashboardProps) {
    const [tab, setTab] = useState<AdminTab>(AdminTab.driver_form_pending);
    const [error, setError] = useState<string | null>(null);

    const getTokenFromCookies = (): string | null => {
        const match = document.cookie.match(/(^| )authToken=([^;]+)/);
        //console.log("match", match);
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
                body: JSON.stringify({account_type, id})
            });
            if (!response.ok) {
                console.error("Failed to approve form", response.statusText);
                setError(`Error: ${response.statusText}`);
                return;
            }
            // Handle success, you can update state or refresh data here
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
                body: JSON.stringify({account_type, id})
            });
            if (!response.ok) {
                console.error("Failed to reject form", response.statusText);
                setError(`Error: ${response.statusText}`);
                return;
            }
            // Handle success, you can update state or refresh data here
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
                return (
                    <Drivers
                        onFetchDrivers={fetchDrivers}
                    />
                );
            case AdminTab.clients:
                return (
                    <Clients
                        onFetchClients={fetchClients}
                    />
                );
            default:
                return <div>Select a tab to view content.</div>;
        }
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button
                    onClick={() => setTab(AdminTab.driver_form_pending)}
                    style={{
                        padding: "0.5rem 1rem",
                        background: tab === AdminTab.driver_form_pending ? "#007BFF" : "#E0E0E0",
                        color: tab === AdminTab.driver_form_pending ? "#FFF" : "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Driver Form Pending
                </button>
                <button
                    onClick={() => setTab(AdminTab.client_form_pending)}
                    style={{
                        padding: "0.5rem 1rem",
                        background: tab === AdminTab.client_form_pending ? "#007BFF" : "#E0E0E0",
                        color: tab === AdminTab.client_form_pending ? "#FFF" : "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Client Form Pending
                </button>
                <button
                    onClick={() => setTab(AdminTab.drivers)}
                    style={{
                        padding: "0.5rem 1rem",
                        background: tab === AdminTab.drivers ? "#007BFF" : "#E0E0E0",
                        color: tab === AdminTab.drivers ? "#FFF" : "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Drivers
                </button>
                <button
                    onClick={() => setTab(AdminTab.clients)}
                    style={{
                        padding: "0.5rem 1rem",
                        background: tab === AdminTab.clients ? "#007BFF" : "#E0E0E0",
                        color: tab === AdminTab.clients ? "#FFF" : "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Clients
                </button>
            </div>
            <div>{error && <div style={{ color: "red" }}>{error}</div>}</div>
            <div>{renderContent()}</div>
        </div>
    );
}
