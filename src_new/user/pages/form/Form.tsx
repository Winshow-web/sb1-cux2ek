import { User } from '@global/types.ts';
import { Routes, Route } from 'react-router-dom';
import ClientForm from "./client/ClientForm";
import DriverForm from "./driver/DriverForm";

interface FormProps {
    user: User;
    baseUrl: string;
    setUser: (user: User) => void;
}

export default function Form({ user, baseUrl, setUser }: FormProps) {
    return (
        <Routes>
            {/* Define routes for client and driver */}
            <Route path="/client" element={
                <ClientForm
                    user={user}
                    baseUrl={baseUrl}
                    setUser={setUser}
                />} />
            <Route path="/driver" element={
                <DriverForm
                    user={user}
                    baseUrl={baseUrl}
                    setUser={setUser}
                />} />
        </Routes>
    );
}
