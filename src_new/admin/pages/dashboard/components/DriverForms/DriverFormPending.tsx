import { useEffect, useState } from "react";
import DriverFormPendingCard from "./DriverFormPendingCard.tsx";
import { DriverForm } from "@global/types.ts";

interface DriverFormPendingProps {
    driverForms?: DriverForm[];
    onFetchDriverForms: () => Promise<DriverForm[]>;
    onApprove: (type: string, driverFormId: string) => void;  // Approve handler passed down
    onReject: (type: string, driverFormId: string) => void;   // Reject handler passed down
}

export default function DriverFormPending({
                                              driverForms = [],
                                              onFetchDriverForms,
                                              onApprove,
                                              onReject
                                          }: DriverFormPendingProps) {
    const [currentDriverForms, setCurrentDriverForms] = useState<DriverForm[]>(driverForms);
    const [isLoading, setIsLoading] = useState(true); // Add the loading state

    useEffect(() => {
        setIsLoading(true); // Start loading
        onFetchDriverForms()
            .then((forms) => setCurrentDriverForms(forms))
            .catch((error) => console.error("Failed to fetch driver forms:", error))
            .finally(() => setIsLoading(false)); // End loading
    }, [onFetchDriverForms]);

    // Updated return statement
    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <div style={styles.container}>
            <h1>Driver Form Pending</h1>
            <div style={styles.grid}>
                {Array.isArray(currentDriverForms) ? (
                    currentDriverForms.map((form) => (
                        <DriverFormPendingCard
                            key={form.id}
                            driverForm={form}
                            onApprove={onApprove}  // Pass down onApprove
                            onReject={onReject}    // Pass down onReject
                        />
                    ))
                ) : (
                    <div>No driver forms available.</div>
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
