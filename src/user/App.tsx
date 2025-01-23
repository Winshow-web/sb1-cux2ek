import {User} from "@global/types.ts";
import {defaultUser} from "@global/default.ts";
import {useEffect, useState} from "react";
import {fetchUserFromToken, getTokenFromCookies} from "@global/token.ts";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import SignUp from "./pages/signup/SignUp.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Suspended from "./pages/suspended/Suspended.tsx";
import Disabled from "./pages/disabled/Disabled.tsx";

interface AppProps {
    baseUrl: string;
}

function App({baseUrl}: AppProps) {

    const [user, setUser] = useState<User>(defaultUser);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchAndSetUser = async () => {
            const token = getTokenFromCookies();
            console.log("Token from cookies:", token);

            if (token) {
                const success = await fetchUserFromToken(token, baseUrl, setUser);
                if (!success) {
                    setError("Failed to fetch user data with the token.");
                }
            } else {
                setUser(defaultUser);
            }

            setLoading(false);
        };

        fetchAndSetUser();
    }, [baseUrl]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={
                    <Home
                        baseUrl={baseUrl}
                        //setUser={setUser}
                        //redirect={redirect}
                    />} />
                <Route path="/signup/*" element={
                    <SignUp
                        baseUrl={baseUrl}
                        setUser={setUser}
                        user={user}
                        //redirect={redirect}
                    />} />
                <Route path="/dashboard/*" element={
                    <Dashboard
                        baseUrl={baseUrl}
                    />} />
                <Route path="/suspended/*" element={
                    <Suspended
                        baseUrl={baseUrl}
                    />} />
                <Route path="/disabled/*" element={
                    <Disabled
                        baseUrl={baseUrl}
                    />} />
            </Routes>
        </div>

)
    ;
}

export default App;
