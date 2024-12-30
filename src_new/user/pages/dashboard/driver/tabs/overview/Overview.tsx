import React from 'react';
import { Driver } from '@global/types.ts';

interface OverviewProps {
    driver: Driver;
}

const Overview: React.FC<OverviewProps> = ({ driver }) => {
    // Function to format the rating display
    const getRatingText = (rating: number) => {
        if (rating === -1) return "New";
        return `${(rating / 10).toFixed(1)}/5`;
    };

    return (
        <div className="bg-white shadow-md rounded p-6">
            <img
                src={driver.photo}
                alt={`${driver.name}'s photo`}
                className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold text-center mb-2">{driver.name}</h2>
            <p className="text-center text-gray-500 mb-4">{driver.email}</p>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p><strong>Phone:</strong> {driver.phone}</p>
                    <p><strong>Experience:</strong> {driver.experience}</p>
                    <p><strong>Rating:</strong> {getRatingText(driver.rating)}</p>
                </div>
                <div>
                    <p><strong>License Type:</strong> {driver.license_type}</p>
                    <p><strong>Specializations:</strong> {driver.specializations.join(', ')}</p>
                    <p><strong>Service Area:</strong> {driver.serviceArea}</p>
                    <p><strong>Availability:</strong> {driver.availability ? 'Available' : 'Unavailable'}</p>
                </div>
            </div>
        </div>
    );
};

export default Overview;
