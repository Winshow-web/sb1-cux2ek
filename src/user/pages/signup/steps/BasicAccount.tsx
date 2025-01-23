import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountType, User } from "@global/types.ts";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const BasicAccount: React.FC<{ baseUrl: string; setUser: (user: User) => void }> = ({ baseUrl, setUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        accountType: AccountType.client_new
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAccountTypeChange = (type: AccountType) => {
        setFormData((prevData) => ({
            ...prevData,
            accountType: type
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, email, phone, password, accountType } = formData;

        if (accountType !== AccountType.client_new && accountType !== AccountType.driver_new) {
            console.error('Provide a valid account type for registration: ' + accountType);
            alert('Invalid account type!');
            return;
        }

        if (!name || !email || !phone || !password) {
            alert('Please fill in all fields.');
            return;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            alert('Password must be at least 8 characters long and contain: \n- One lowercase letter \n- One uppercase letter \n- One number \n- One special character');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password, account_type: accountType }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                navigate('/signup/verification');
            } else {
                console.error('Registration failed');
                alert('Registration failed, please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration, please try again.');
        }
    };

    const handlePhoneChange = (phone: string) => {
        setFormData((prevData) => ({
            ...prevData,
            phone
        }));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

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
                    <label style={styles.label}>Phone:</label>
                    <PhoneInput
                        international
                        defaultCountry="US"
                        value={formData.phone}
                        // @ts-ignore
                        onChange={handlePhoneChange}
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

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Account Type:</label>
                    <div>
                        <button
                            type="button"
                            onClick={() => handleAccountTypeChange(AccountType.client_new)}
                            style={{
                                ...styles.accountButton,
                                backgroundColor: formData.accountType === AccountType.client_new ? '#4CAF50' : '#ddd',
                            }}
                        >
                            Client
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAccountTypeChange(AccountType.driver_new)}
                            style={{
                                ...styles.accountButton,
                                backgroundColor: formData.accountType === AccountType.driver_new ? '#4CAF50' : '#ddd',
                            }}
                        >
                            Driver
                        </button>
                    </div>
                </div>

                <button type="submit" style={styles.button}>Sign Up</button>
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
    },
    accountButton: {
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        margin: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    }
};

export default BasicAccount;
