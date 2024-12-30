import { useEffect, useState } from "react";
import ClientCard from "./ClientCard.tsx";
import { Client } from "@global/types.ts";

interface ClientsProps {
    clients?: Client[];
    onFetchClients: () => Promise<Client[]>;
}

export default function Clients({
                                    clients = [],
                                    onFetchClients,
                                }: ClientsProps) {
    const [currentClients, setCurrentClients] = useState<Client[]>(clients);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        onFetchClients()
            .then((fetchedClients) => setCurrentClients(fetchedClients))
            .catch((error) => console.error("Failed to fetch clients:", error))
            .finally(() => setIsLoading(false));
    }, [onFetchClients]);

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <div style={styles.container}>
            <h1>Clients</h1>
            <div style={styles.grid}>
                {Array.isArray(currentClients) ? (
                    currentClients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                        />
                    ))
                ) : (
                    <div>No clients available.</div>
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
