import React from 'react';

interface DriverPendingProps {
    baseUrl: string;
}

const DriverPending: React.FC<DriverPendingProps> = ({ baseUrl }) => {
    return (
        <div>
            <p>Driver Pending</p>
            <p>BaseUrl: ${baseUrl}</p>
        </div>
    );
};
export default DriverPending;
