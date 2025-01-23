import React from 'react';

interface ResubmitProps {
    baseUrl: string;
}

const Resubmit: React.FC<ResubmitProps> = ({ baseUrl }) => {
    return (
        <div>
            <h1>Resubmit Page</h1>
            <p>Base URL: {baseUrl}</p>
        </div>
    );
};

export default Resubmit;
