import React from 'react';
import {Route, Routes} from "react-router-dom";
import {ClientForm} from "../form/ClientForm.tsx";
import {DriverForm} from "../form/DriverForm.tsx";

interface PendingProps {
    baseUrl: string;
}

const Pending: React.FC<PendingProps> = ({ baseUrl }) => {
    return (
        <div>
            <Routes>
                <Route
                    path="/client"
                    element={<ClientForm baseUrl={baseUrl} />}
                />
                <Route
                    path="/driver"
                    element={<DriverForm baseUrl={baseUrl} />}
                />
            </Routes>
        </div>
    );
};
//TODO: Make Pending /client and /driver pages
export default Pending;
