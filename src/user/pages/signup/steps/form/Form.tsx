import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {ClientForm} from "./ClientForm.tsx";
import {DriverForm} from "./DriverForm.tsx";

interface FormProps {
    baseUrl: string;
}

const Form: React.FC<FormProps> = ({ baseUrl }) => {
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

export default Form;
