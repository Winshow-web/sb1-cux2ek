import { useEffect, useState } from "react";
import DriverCard from "./DriverCard.tsx";
import { Driver } from "@global/types.ts";

interface DriversProps {
    drivers?: Driver[];
    onFetchDrivers: () => Promise<Driver[]>;
}

export default function Drivers({
                                    drivers = [],
                                    onFetchDrivers,
                                }: DriversProps) {
    const [currentDrivers, setCurrentDrivers] = useState<Driver[]>(drivers);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        onFetchDrivers()
            .then((fetchedDrivers) => setCurrentDrivers(fetchedDrivers))
            .catch((error) => console.error("Failed to fetch drivers:", error))
            .finally(() => setIsLoading(false));
    }, [onFetchDrivers]);

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <div style={styles.container}>
            <h1>Drivers</h1>
            <div style={styles.grid}>
                {Array.isArray(currentDrivers) ? (
                    currentDrivers.map((driver) => (
                        <DriverCard
                            key={driver.id}
                            driver={driver}
                        />
                    ))
                ) : (
                    <div>No drivers available.</div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
        textAlign: "center",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        justifyContent: "center",
    },
};
