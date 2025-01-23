import React from 'react';

interface SuspendedProps {
    baseUrl: string;
}

const Suspended: React.FC<SuspendedProps> = ({ baseUrl }) => {
    return (
        <div>
            <h1>Suspended Page</h1>
            <p>Base URL: {baseUrl}</p>
        </div>
    );
};

export default Suspended;
