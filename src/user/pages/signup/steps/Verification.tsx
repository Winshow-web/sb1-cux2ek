import React, { useEffect, useState } from 'react';
import { User } from "@global/types.ts";
import { useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore
import emailImage from "./email.png";

interface VerificationProps {
    baseUrl: string;
    user: User;
    setUser: Function;
}

const Verification: React.FC<VerificationProps> = ({ baseUrl, user }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [verificationMessage, setVerificationMessage] = useState<string>('');
    const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || user.email;

    useEffect(() => {
        if (!email) {
            setError('No email found. Redirecting...');
            setLoading(false);
            setTimeout(() => {
                navigate('/'); // Redirect after 2 seconds
            }, 2000);
        } else {
            setLoading(false);
            setVerificationMessage('Please verify your email to continue.');
        }
    }, [email, navigate]);

    const resendVerificationEmail = async () => {
        if (isCooldownActive) return;

        try {
            const response = await fetch(`${baseUrl}/api/auth/resend-email-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                }),
            });

            if (response.ok) {
                alert('Verification email resent! Please check your inbox.');
                setIsCooldownActive(true);
                setTimeout(() => setIsCooldownActive(false), 60000); // Cooldown for 1 minute
            } else {
                alert('Failed to resend verification email.');
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            alert('An error occurred while resending the verification email.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <img src={emailImage} alt="Check your email" style={styles.image} />
                <h1 style={styles.title}>{verificationMessage}</h1>
                <p style={styles.subtitle}>
                    Check your email <strong>{email}</strong> for a verification link.
                </p>
                <button
                    onClick={resendVerificationEmail}
                    disabled={isCooldownActive}
                    style={{
                        ...styles.button,
                        backgroundColor: isCooldownActive ? '#aaa' : '#007BFF',
                        cursor: isCooldownActive ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isCooldownActive ? 'Please wait 1 minute...' : 'Resend Verification Email'}
                </button>
                <br></br>
                <button
                    onClick={() => navigate('/signup/login')}
                    style={{
                        ...styles.button,
                        backgroundColor: '#28a745', // Green for "Continue"
                        marginTop: '10px',
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center' as const,
        padding: '40px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    image: {
        width: '100px',
        marginBottom: '20px',
    },
    title: {
        fontSize: '20px',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Verification;
