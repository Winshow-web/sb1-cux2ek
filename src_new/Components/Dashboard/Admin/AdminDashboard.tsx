import { useState } from 'react';
import {AdminTab, ClientForm, DriverForm} from "../../../types";
import DriverFormPending from "./Components/DriverFormPending";
import ClientFormPending from "./Components/ClientFormPending";

interface AdminDashboardProps {
    baseUrl: string;
    getTokenFromCookies: () => string | null;
}

export default function AdminDashboard({baseUrl, getTokenFromCookies}: AdminDashboardProps) {
    const [tab, setTab] = useState<AdminTab>(AdminTab.driver_form_pending);
    const [error, setError] = useState<string | null>(null);

    const fetchDriverForms = async (): Promise<DriverForm[]> => {
        try {
            const token = getTokenFromCookies();
            const response = await fetch(`${baseUrl}/admin/drivers`, {
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
        const response = await fetch(`${baseUrl}/admin/clients`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getTokenFromCookies()}`,
            },
        });
        return await response.json();
    };

    const renderContent = () => {
        switch (tab) {
            case AdminTab.driver_form_pending:
                return <DriverFormPending
                    onFetchDriverForms={fetchDriverForms}
                />;
            case AdminTab.client_form_pending:
                return <ClientFormPending />;
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
            </div>
            <div>{error && <div style={{ color: "red" }}>{error}</div>}</div>
            <div>{renderContent()}</div>
        </div>
    );
}
