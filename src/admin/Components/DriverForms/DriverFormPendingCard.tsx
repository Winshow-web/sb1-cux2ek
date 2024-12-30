import React from 'react';
import { DriverForm } from "@global/types.ts";

interface DriverFormPendingCardProps {
    driverForm: DriverForm;
    onApprove: (type: string, driverFormId: string) => void; // Prop to handle approval
    onReject: (type: string, driverFormId: string) => void;  // Prop to handle rejection
}

const DriverFormPendingCard: React.FC<DriverFormPendingCardProps> = ({ driverForm, onApprove, onReject }) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <img src={driverForm.photo} alt={driverForm.name} style={styles.photo} />
                <div style={styles.cardTitle}>
                    <h3>{driverForm.name}</h3>
                    <p>{driverForm.licenseType}</p>
                </div>
            </div>
            <div style={styles.cardContent}>
                <div>
                    <strong>Email:</strong> {driverForm.email}
                </div>
                <div>
                    <strong>Phone:</strong> {driverForm.phone}
                </div>
                <div>
                    <strong>Experience:</strong> {driverForm.experience}
                </div>
                <div>
                    <strong>Specializations:</strong>
                    <ul>
                        {driverForm.specializations.map((spec, index) => (
                            <li key={index}>{spec}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <strong>Service Area:</strong> {driverForm.serviceArea}
                </div>
            </div>
            <div style={styles.cardFooter}>
                <button
                    style={styles.approveButton}
                    onClick={() => onApprove("driver", driverForm.id)}>
                    Approve
                </button>
                <button
                    style={styles.rejectButton}
                    onClick={() => onReject("driver", driverForm.id)}>
                    Reject
                </button>
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
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
    },
    approveButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745', // Green for approve
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    rejectButton: {
        padding: '10px 15px',
        backgroundColor: '#dc3545', // Red for reject
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default DriverFormPendingCard;
