import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { User } from '@global/types.ts';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const baseUrl = (import.meta as any).env.VITE_SERVER_URL;

    const setTokenInCookies = (token: string): void => {
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // Set cookie expiry time (1 hour)
        document.cookie = `authToken=${token}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`; // Secure; HttpOnly;
    };

    const handleLoginSuccess = (user: User, token: string) => {
        setUser(user);
        setIsLoggedIn(true);
        setTokenInCookies(token);
    };

    return (
        <div style={{ padding: '20px' }}>
            {!isLoggedIn ? (
                <AdminLogin
                    baseUrl={baseUrl}
                    onLoginSuccess={handleLoginSuccess}
                />
            ) : (
                <AdminDashboard
                    baseUrl={baseUrl}
                />
            )}
        </div>
    );
};

export default Admin;
