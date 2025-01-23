import React from 'react';

interface ClientPendingProps {
    baseUrl: string;
}

const ClientPending: React.FC<ClientPendingProps> = ({ baseUrl }) => {
    return (
        <div>
            <p>Client Pending</p>
    <p>BaseUrl: ${baseUrl}</p>
    </div>
    );
};
export default ClientPending;
