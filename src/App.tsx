import {useEffect, useState} from 'react';
//import { Supabase_User } from '@supabase/supabase-js';
import {AccountType, ClientForm, ClientFormSubmit, DriverForm, DriverFormSubmit, User} from "./types.ts";
import Navbar from "./Components/Home/Navbar.tsx";
import Hero from "./Components/Home/Hero.tsx";
import Form from "./Components/Form/Form.tsx";
import Footer from "./Components/Home/Footer.tsx";
import AuthModal from "./Components/AuthSidePanel/AuthSidePanel";
import FormPending from "./Components/Form/FormPending";
import DriverDashboard from "./Components/Dashboard/Driver/DriverDashboard";
import ClientDashboard from "./Components/Dashboard/Client/ClientDashboard";
import {Route, Routes} from 'react-router-dom';
import {ThemeProvider} from "./contexts/ThemeContext";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const baseUrl = (import.meta as any).env.VITE_SERVER_URL;

    const setTokenInCookies = (token: string): void => {
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // Set cookie expiry time (1 hour)
        document.cookie = `authToken=${token}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`; // Secure; HttpOnly;
    };

    const getTokenFromCookies = (): string | null => {
        const match = document.cookie.match(/(^| )authToken=([^;]+)/);
        return match ? match[2] : null;  // Return the token or null if not found
    };

    const deleteTokenFromCookies = (): void => {
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

    // Fetch user data if a valid token exists
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
                setUser(data.user);  // Set the user state with the fetched data
            } else {
                console.error('Failed to fetch user data');
                setUser(null);  // If token is invalid, clear the user state
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);  // Handle errors and clear user state
        }
    };

    // Function to handle driver registration form submission
    const handleDriverSubmit = async (driverData: DriverFormSubmit): Promise<void> => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('User not authenticated. Please log in to continue.');
                console.error('User not authenticated');
                return;
            }

            const formData = new FormData();
            formData.append('id', driverData.id);
            formData.append('name', driverData.name);
            formData.append('email', driverData.email);
            formData.append('phone', driverData.phone);
            formData.append('experience', String(driverData.experience));
            formData.append('licenseType', driverData.licenseType);
            formData.append('specializations', driverData.specializations.join(','));
            formData.append('serviceArea', driverData.serviceArea);

            if (driverData.photo instanceof File) {
                formData.append('photo', driverData.photo);
            } else {
                console.error('Invalid photo file');
                alert('Please upload a valid photo.');
                return;
            }

            const response = await fetch(`${baseUrl}/form/driver`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Request submitted successfully:', data);
                //alert('Driver registration successful!');
                setUser(data.user);
            } else {
                const errorData = await response.json();
                console.error('Driver registration failed:', errorData);
                alert('Driver registration failed: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting driver form:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        }
    };

    const handleClientSubmit = async (clientData: ClientFormSubmit): Promise<void> => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('User not authenticated. Please log in to continue.');
                console.error('User not authenticated');
                return;
            }

            const formData = new FormData();
            formData.append('id', clientData.id);
            formData.append('name', clientData.name); // Add name
            formData.append('email', clientData.email); // Add email
            formData.append('phone', clientData.phone);

            if (clientData.photo instanceof File) {
                formData.append('photo', clientData.photo);
            } else {
                console.error('Invalid photo file');
                alert('Please upload a valid photo.');
                return;
            }

            const response = await fetch(`${baseUrl}/form/client`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Client request submitted successfully:', data);
                //alert('Client registration successful!');
                setUser(data.user);
            } else {
                const errorData = await response.json();
                console.error('Client registration failed:', errorData);
                alert('Client registration failed: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting client form:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        }
    };

    // Fetch driver data for pending form
    const fetchDriverData = async (): Promise<DriverForm> => {
        const response = await fetch(`${baseUrl}/form/load`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getTokenFromCookies()}`,
            },
        });
        const data = await response.json();
        if (data.registrationData?.type === 'driver') {
            return data.registrationData.data;
        } else {
            throw new Error('Driver data not found');
        }
    };

    // Fetch client data for pending form
    const fetchClientData = async (): Promise<ClientForm> => {
        const response = await fetch(`${baseUrl}/form/load`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getTokenFromCookies()}`,
            },
        });
        const data = await response.json();
        if (data.registrationData?.type === 'client') {
            return data.registrationData.data;
        } else {
            throw new Error('Client data not found');
        }
    };

    const handleLogout = async () => {
        try {
            setUser(null);
            deleteTokenFromCookies();
            localStorage.removeItem('authToken');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar
                user={user}
                onAuthClick={() => setShowAuthModal(true)}
                onLogout={handleLogout}
            />

            <main className="flex-grow">
                <Routes>
                    <Route
                        path="/"
                        element={
                            !user ? (
                                <Hero />
                            ) : user.account_type === AccountType.client_new || user.account_type === AccountType.driver_new ? (
                                <Form
                                    id={user.id}
                                    name={user.name}
                                    email={user.email}
                                    account_type={user.account_type}
                                    onSubmitDriverForm={handleDriverSubmit}
                                    onSubmitClientForm={handleClientSubmit}
                                />
                            ) : user.account_type === AccountType.driver_pending || user.account_type === AccountType.client_pending ? (
                                <FormPending
                                    account_type={user.account_type}
                                    onFetchDriverForm={fetchDriverData}
                                    onFetchClientForm={fetchClientData}
                                />
                            ) : user.account_type === AccountType.client ? (
                                <ClientDashboard
                                    user={user}
                                    baseUrl={baseUrl}
                                    getTokenFromCookies={getTokenFromCookies}
                                />
                            ) : user.account_type === AccountType.driver ? (
                                <DriverDashboard
                                    user={user}
                                    baseUrl={baseUrl}
                                    getTokenFromCookies={getTokenFromCookies}
                                />
                            ) : (
                                <p>Unsupported account type: {user.account_type}</p>
                            )
                        }
                    />
                </Routes>
            </main>

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    baseUrl={baseUrl}
                    setUser={setUser}
                    setTokenInCookies={setTokenInCookies}
                    setShowAuthModal={setShowAuthModal}
                />
            )}

            <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;
