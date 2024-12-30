import { User } from '@global/types.ts';
import { Routes, Route } from 'react-router-dom';
import ClientDashboard from "./client/ClientDashboard";
import DriverDashboard from "./driver/DriverDashboard";

interface FormProps {
    user: User;
    baseUrl: string;
    onLogout: () => void;
}

export default function Dashboard({ user, baseUrl, onLogout }: FormProps) {
    return (
        <Routes>
            {/* Define routes for client and driver */}
            <Route path="/client" element={
                <ClientDashboard
                    user={user}
                    baseUrl={baseUrl}
                    onLogout={onLogout}
                />} />
            <Route path="/driver" element={
                <DriverDashboard
                    user={user}
                    baseUrl={baseUrl}
                    onLogout={onLogout}
                />} />
        </Routes>
    );
}
