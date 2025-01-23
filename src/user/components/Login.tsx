import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {AccountType, User} from "@global/types.ts";
import { setTokenInCookies } from "@global/token";

interface LoginProps {
    baseUrl: string;
}

const Login: React.FC<LoginProps> = ({ baseUrl }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
            alert('Please fill in both fields');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.verified === false) {
                    navigate('/signup/verification', { state: { email } });
                } else {

                    if (data.session && data.session.access_token) {
                        setTokenInCookies(data.session.access_token);
                    } else {
                        console.error("Auth token missing from response!");
                    }

                    if (
                        !data.user.id ||
                        !data.user.name ||
                        !data.user.email ||
                        //!data.user.phone ||
                        !data.user.account_type
                    ) {
                        console.error('Necessary info not received on login!');
                    }

                    let user = new User(
                        data.user.id,
                        data.user.name,
                        data.user.email,
                        data.user.phone || "",
                        data.user.account_type
                    );

                    switch (data.user.account_type) {

                        case AccountType.client:
                            navigate('/dashboard/client', { state: { user: user } });
                            break;
                        case AccountType.driver:
                            navigate('/dashboard/driver', { state: { user: user } });
                            break;


                        case AccountType.client_new:
                            navigate('/signup/form/client', { state: { user: user } });
                            break;
                        case AccountType.driver_new:
                            navigate('/signup/form/driver', { state: { user: user } });
                            break;


                        case AccountType.client_pending:
                            navigate('/signup/pending/client', { state: { user: user } });
                            break;
                        case AccountType.driver_pending:
                            navigate('/signup/pending/driver', { state: { user: user } });
                            break;


                        case AccountType.client_can_resubmit:
                            navigate('/signup/resubmit/client', { state: { user: user } });
                            break;
                        case AccountType.driver_can_resubmit:
                            navigate('/signup/resubmit/driver', { state: { user: user } });
                            break;


                        case AccountType.client_suspended:
                            navigate('/suspended/client', { state: { user: user } });
                            break;
                        case AccountType.driver_suspended:
                            navigate('/suspended/driver', { state: { user: user } });
                            break;


                        case AccountType.client_disabled:
                            navigate('/disabled/client', { state: { user: user } });
                            break;
                        case AccountType.driver_disabled:
                            navigate('/disabled/driver', { state: { user: user } });
                            break;


                        case AccountType.administrator:
                            navigate('/admin', { state: { user: user } });
                            break;
                        case AccountType.administrator_suspended:
                            navigate('/admin/suspended', { state: { user: user } });
                            break;
                        case AccountType.administrator_disabled:
                            navigate('/admin/disabled', { state: { user: user } });
                            break;
                    }
                }
            } else {
                console.error('Login failed');
                alert('Invalid email or password!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login, please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <button type="submit" style={styles.button}>Login</button>

            </form>
        </div>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        margin: '10px 0',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        fontSize: '14px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    label: {
        display: 'block',
        fontSize: '16px',
        marginBottom: '5px',
    }
};

export default Login;
