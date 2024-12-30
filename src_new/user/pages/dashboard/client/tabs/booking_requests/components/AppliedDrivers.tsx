import React, { useEffect, useRef, useState } from "react";
import { Driver } from "@global/types";
import { getTokenFromCookies } from "@global/token";
import { useNavigate } from "react-router-dom";
import AppliedDriver from "./AppliedDriver";

interface AppliedDriversProps {
    baseUrl: string;
    bookingId: string;
    driverIds: string[] | null;
    onClose: () => void;
}

const AppliedDrivers: React.FC<AppliedDriversProps> = ({
                                                           baseUrl,
                                                           bookingId,
                                                           driverIds,
                                                           onClose,
                                                       }) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        if (driverIds && driverIds.length > 0) {
            const fetchDrivers = async () => {
                try {
                    const token = getTokenFromCookies();
                    if (!token) {
                        navigate("/");
                        return;
                    }

                    const response = await fetch(`${baseUrl}/load/drivers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ driver_ids: driverIds }),
                    });

                    if (!response.ok) {
                        console.error("Error: Failed to fetch drivers");
                        return;
                    }

                    const data = await response.json();

                    const driverList = data.map((driver: any) =>
                        new Driver(
                            driver.id,
                            driver.name,
                            driver.email,
                            driver.account_type,
                            driver.phone,
                            driver.experience,
                            driver.rating,
                            driver.license_type,
                            driver.specializations,
                            driver.service_area,
                            driver.availability,
                            driver.photo || ""
                        )
                    );

                    setDrivers(driverList);
                } catch (error) {
                    console.error("Error fetching driver data:", error);
                }
            };

            fetchDrivers();
        }
    }, [driverIds, baseUrl]);

    const selectDriver = async (driverId: string) => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(`${baseUrl}/booking/client/select`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookingId,
                    driverId
                }),
            });

            if (!response.ok) {
                console.error("Error: Failed to fetch drivers");
                return;
            }

            //const data = await response.json();

        } catch (error) {
            console.error("Error fetching driver data:", error);
        }
    };

    if (!driverIds || driverIds.length === 0) {
        return <p>No drivers have applied.</p>;
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5 relative overflow-auto"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                >
                    ✖
                </button>
                <h4 className="font-semibold text-2xl mb-6">Applied Drivers</h4>
                <div className="flex flex-wrap gap-4">
                    {drivers.map((driver) => (
                        <AppliedDriver key={driver.id}
                           driver={driver}
                           selectDriver={selectDriver}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppliedDrivers;
