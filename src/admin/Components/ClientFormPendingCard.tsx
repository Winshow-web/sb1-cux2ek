import React from 'react';
import { ClientForm } from "../../types";

interface ClientFormPendingCardProps {
    clientForm: ClientForm;
    onApprove: (type: string, clientFormId: string) => void; // Function passed from parent
    onReject: (type: string, clientFormId: string) => void;  // Function passed from parent
}

const ClientFormPendingCard: React.FC<ClientFormPendingCardProps> = ({ clientForm, onApprove, onReject }) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <img src={clientForm.photo} alt={clientForm.name} style={styles.photo} />
                <div style={styles.cardTitle}>
                    <h3>{clientForm.name}</h3>
                </div>
            </div>
            <div style={styles.cardContent}>
                <div>
                    <strong>Email:</strong> {clientForm.email}
                </div>
                <div>
                    <strong>Phone:</strong> {clientForm.phone}
                </div>
            </div>
            <div style={styles.cardActions}>
                <button onClick={() => onApprove("client", clientForm.id)}>Approve</button>
                <button onClick={() => onReject("client", clientForm.id)}>Reject</button>
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
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
};

export default ClientFormPendingCard;
