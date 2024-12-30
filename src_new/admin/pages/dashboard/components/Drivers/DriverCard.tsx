import React from 'react';
import { Driver } from "@global/types.ts";

interface DriverCardProps {
    driver: Driver;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
    // Determine the rating display
    const getRatingText = (rating: number) => {
        if (rating === -1) return "New";
        return `${(rating / 10).toFixed(1)}/5`;
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <img src={driver.photo} alt={driver.name} style={styles.photo} />
                <div style={styles.cardTitle}>
                    <h3>{driver.name}</h3>
                    <p>{driver.license_type}</p>
                </div>
            </div>
            <div style={styles.cardContent}>
                <div>
                    <strong>Email:</strong> {driver.email}
                </div>
                <div>
                    <strong>Phone:</strong> {driver.phone}
                </div>
                <div>
                    <strong>Experience:</strong> {driver.experience}
                </div>
                <div>
                    <strong>Rating:</strong> {getRatingText(driver.rating)}
                </div>
                <div>
                    <strong>Specializations:</strong>
                    <ul>
                        {driver.specializations.map((spec, index) => (
                            <li key={index}>{spec}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <strong>Service Area:</strong> {driver.serviceArea}
                </div>
                <div>
                    <strong>Availability:</strong> {driver.availability ? 'Available' : 'Not Available'}
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

export default DriverCard;
