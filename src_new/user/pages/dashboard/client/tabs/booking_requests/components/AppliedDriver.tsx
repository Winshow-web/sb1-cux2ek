import React from "react";
import { Driver } from "@global/types";

interface AppliedDriverProps {
    driver: Driver;
    selectDriver: (driverId: string) => void;
}

const AppliedDriver: React.FC<AppliedDriverProps> = ({ driver, selectDriver }) => {

    const handleClick = ()=> {
        selectDriver(driver.id);
    }

    return (
        <div className="border p-4 rounded-lg shadow-md bg-gray-100 w-72">
            <div className="flex items-center mb-4">
                <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-sm">{driver.phone}</p>
                </div>
            </div>
            <div className="text-sm">
                <p>Rating: {driver.rating}⭐</p>
                <p>Experience: {driver.experience} years</p>
                <p>License: {driver.license_type}</p>
            </div>
            <button
                onClick={handleClick}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
                ✖
            </button>
        </div>
    );
};

export default AppliedDriver;
