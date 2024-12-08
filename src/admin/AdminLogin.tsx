import React, { useState } from 'react';
import { User } from "../types";

interface AdminLoginProps {
    baseUrl: string;
    onLoginSuccess: (user: User, token: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ baseUrl, onLoginSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLoginSuccess(data.user, data.session.access_token); // Trigger success callback
            } else {
                setErrorMessage('Invalid credentials or server error.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred while logging in.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(email, password);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "1rem",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "1rem",
                        }}
                    />
                </div>
                {errorMessage && <p style={{ color: 'red', marginBottom: "1rem" }}>{errorMessage}</p>}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "1rem",
                        background: "#007BFF",
                        color: "#FFF",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "1rem",
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
