import {Routes, Route, useNavigate} from 'react-router-dom';
import AdminLogin from "./pages/login/AdminLogin";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import {User} from "../global/types";
import {useState} from "react";
import {deleteTokenFromCookies, setTokenInCookies} from "@global/token";
import {defaultUser} from "../global/default";

interface AdminProps {
    baseUrl: string;
}

function Admin({baseUrl}: AdminProps) {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setUser(defaultUser);
            deleteTokenFromCookies();
            localStorage.removeItem('authToken');
            navigate('/admin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleLoginSuccess = (user: User, token: string) => {
        setUser(user);
        setIsLoggedIn(true);
        setTokenInCookies(token);
        navigate('/admin/dashboard');
    };

    return (
        <Routes>
            <Route path="/" element={
                <AdminLogin
                    baseUrl={baseUrl}
                    onLoginSuccess={handleLoginSuccess}

                />} />
            <Route path="/dashboard" element={
                <AdminDashboard
                    baseUrl={baseUrl}
                    onLogout={handleLogout}
                />} />
        </Routes>
    );
}

export default Admin;
