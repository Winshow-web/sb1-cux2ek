import React from 'react';

interface DisabledProps {
    baseUrl: string;
}

const Disabled: React.FC<DisabledProps> = ({ baseUrl }) => {
    return (
        <div>
            <h1>Disabled Page</h1>
            <p>Base URL: {baseUrl}</p>
        </div>
    );
};

export default Disabled;
