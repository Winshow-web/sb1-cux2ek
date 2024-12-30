import React from 'react';
import { Client } from "@global/types.ts";

interface ClientCardProps {
    client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <img src={client.photo} alt={client.name} style={styles.photo}/>
                <div style={styles.cardTitle}>
                    <h3>{client.name}</h3>
                </div>
            </div>
            <div style={styles.cardContent}>
                <div>
                    <strong>Email:</strong> {client.email}
                </div>
                <div>
                    <strong>Phone:</strong> {client.phone}
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        width: '300px',
        marginBottom: '20px',
        backgroundColor: '#fff',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    photo: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '15px',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    cardContent: {
        fontSize: '14px',
    },
};

export default ClientCard;
