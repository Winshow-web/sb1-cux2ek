import {Route, Routes, useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

import Home from './pages/home/Home';
import Form from './pages/form/Form';
import FormPending from "./pages/form_pending/FormPending";
import Dashboard from "./pages/dashboard/Dashboard";
import About from './pages/about/About'

import {AccountType, User} from "@global/types";
import {defaultUser} from "@global/default";
import {getTokenFromCookies, deleteTokenFromCookies} from "@global/token";


interface AppProps {
    baseUrl: string;
}

function App({baseUrl}: AppProps) {

    const [user, setUser] = useState<User>(defaultUser);

    const navigate = useNavigate();

    useEffect(() => {
        const token = getTokenFromCookies();
        if (token) {
            fetchUserFromToken(token);
        }
    }, []);

    const fetchUserFromToken = async (token: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                let user = data.user;
                setUser(new User(user.id, user.user_metadata.display_name, user.email, user.user_metadata.account_type));
                redirect();
            } else {
                console.error('Failed to fetch user data');
                setUser(defaultUser);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(defaultUser);
        }
    };

    const handleLogout = async () => {
        try {
            setUser(defaultUser);
            deleteTokenFromCookies();
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const redirect = () => {
        if (user) {
            switch (user.account_type) {
                case AccountType.client_new:
                    navigate('/form/client');
                    break;
                case AccountType.driver_new:
                    navigate('/form/driver');
                    break;
                case AccountType.client_pending:
                    navigate('/form_pending/client');
                    break;
                case AccountType.driver_pending:
                    navigate('/form_pending/driver');
                    break;
                case AccountType.client:
                    navigate('/dashboard/client');
                    break;
                case AccountType.driver:
                    navigate('/dashboard/driver');
                    break;
                default:
                    navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    const redirectWithData = (inUser: User) => {
        if (inUser) {
            switch (inUser.account_type) {
                case AccountType.client_new:
                    navigate('/form/client');
                    break;
                case AccountType.driver_new:
                    navigate('/form/driver');
                    break;
                case AccountType.client_pending:
                    navigate('/form_pending/client');
                    break;
                case AccountType.driver_pending:
                    navigate('/form_pending/driver');
                    break;
                case AccountType.client:
                    navigate('/dashboard/client');
                    break;
                case AccountType.driver:
                    navigate('/dashboard/driver');
                    break;
                default:
                    navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    return (
        <Routes>
            <Route path="/" element={
                <Home
                    baseUrl={baseUrl}
                    setUser={setUser}
                    redirect={redirectWithData}
                />} />

            <Route path="/form/*" element={
                <Form
                    user={user}
                    baseUrl={baseUrl}
                    setUser={setUser}
                />} />
            <Route path="/form_pending/*" element={
                <FormPending
                    user={user}
                    baseUrl={baseUrl}
                />} />
            <Route path="/dashboard/*" element={
                <Dashboard
                    user={user}
                    baseUrl={baseUrl}
                    onLogout={handleLogout}
                />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
}

export default App;
