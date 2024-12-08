import { useEffect, useState } from "react";
import ClientFormPendingCard from "./ClientFormPendingCard";
import { ClientForm } from "../../types";

interface ClientFormPendingProps {
    clientForms?: ClientForm[];
    onFetchClientForms: () => Promise<ClientForm[]>;
    onApprove: (type: string, clientFormId: string) => void;  // Approve handler passed down
    onReject: (type: string, clientFormId: string) => void;   // Reject handler passed down
}

export default function ClientFormPending({
                                              clientForms = [],
                                              onFetchClientForms,
                                              onApprove,
                                              onReject
                                          }: ClientFormPendingProps) {
    const [currentClientForms, setCurrentClientForms] = useState<ClientForm[]>(clientForms);
    const [isLoading, setIsLoading] = useState(true); // Add the loading state

    useEffect(() => {
        setIsLoading(true); // Start loading
        onFetchClientForms()
            .then((forms) => setCurrentClientForms(forms))
            .catch((error) => console.error("Failed to fetch client forms:", error))
            .finally(() => setIsLoading(false)); // End loading
    }, [onFetchClientForms]);

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <div style={styles.container}>
            <h1>Client Form Pending</h1>
            <div style={styles.grid}>
                {Array.isArray(currentClientForms) ? (
                    currentClientForms.map((form) => (
                        <ClientFormPendingCard
                            key={form.id}
                            clientForm={form}
                            onApprove={onApprove}  // Pass down onApprove
                            onReject={onReject}    // Pass down onReject
                        />
                    ))
                ) : (
                    <div>No client forms available.</div>
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
