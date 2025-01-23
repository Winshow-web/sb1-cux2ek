import React from 'react';

interface DashboardProps {
    baseUrl: string;
}

const Dashboard: React.FC<DashboardProps> = ({ baseUrl }) => {
    return (
        <p>Dashboard Page. Base URL: {baseUrl}</p>
    );

    // TODO 3: Add Client and Driver dashboards
};

export default Dashboard;
