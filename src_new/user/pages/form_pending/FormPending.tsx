import { User } from '@global/types.ts';
import { Routes, Route } from 'react-router-dom';
import ClientFormPending from "./client/ClientFormPending";
import DriverFormPending from "./driver/DriverFormPending";

interface FormProps {
    user: User;
    baseUrl: string;
}

export default function FormPending({ user, baseUrl }: FormProps) {
    if (!user || !user.account_type) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            {/* Define routes for client and driver */}
            <Route path="/client" element={
                <ClientFormPending
                    user={user}
                    baseUrl={baseUrl}
                />} />
            <Route path="/driver" element={
                <DriverFormPending
                    user={user}
                    baseUrl={baseUrl}
                />} />
        </Routes>
    );
}
