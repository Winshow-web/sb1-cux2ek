import React from 'react';
import Login from "../../../components/Login.tsx";

interface SimpleLoginProps {
    baseUrl: string;
}

const SimpleLogin: React.FC<SimpleLoginProps> = ({ baseUrl }) => {
    return (
        <div>
            <Login baseUrl={baseUrl} />
        </div>
    );
};

export default SimpleLogin;
