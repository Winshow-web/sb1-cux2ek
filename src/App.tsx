import {useEffect, useState} from 'react';
import {AccountType, ClientForm, ClientFormSubmit, DriverForm, DriverFormSubmit, User} from '@global/types';
import Form from "./Components/Form/Form.tsx";
import AuthModal from "./Components/SidePanels/AuthSidePanel";
import FormPending from "./Components/Form/FormPending";
import DriverDashboard from "./Components/Dashboard/Driver/DriverDashboard";
import ClientDashboard from "./Components/Dashboard/Client/ClientDashboard";
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {ThemeProvider} from "./contexts/ThemeContext";
import HomePage from "./Components/Home/HomePage.tsx";

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
                handleUnsupportedAccountType(data.user);
                let user = data.user;
                setUser(new User(user.id, user.user_metadata.display_name, user.email, user.user_metadata.account_type));
            } else {
                console.error('Failed to fetch user data');
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
        }
    };

    const handleDriverSubmit = async (driverData: DriverFormSubmit): Promise<void> => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('user not authenticated. Please log in to continue.');
                console.error('user not authenticated');
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
                alert('user not authenticated. Please log in to continue.');
                console.error('user not authenticated');
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
                console.log('Clients request submitted successfully:', data);
                //alert('Clients registration successful!');
                setUser(data.user);
            } else {
                const errorData = await response.json();
                console.error('Clients registration failed:', errorData);
                alert('Clients registration failed: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting client form:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        }
    };

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
            throw new Error('Clients data not found');
        }
    };

    const handleLogout = async () => {
        console.log('user logged out');
        const navigate = useNavigate();
        try {
            setUser(null);
            deleteTokenFromCookies();
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleUnsupportedAccountType = (user: User) => {
        const supportedAccountTypes = [
            AccountType.client_new,
            AccountType.driver_new,
            AccountType.driver_pending,
            AccountType.client_pending,
            AccountType.client,
            AccountType.driver,
        ];

        if (!supportedAccountTypes.includes(user.account_type)) {
            const navigate = useNavigate();
            console.log('Unsupported account type:', user);
            setUser(null);
            navigate('/');
        }
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background text-foreground flex flex-col">

                <main className="flex-grow">
                    <Routes>
                        {/* Default route to HomePage if no user */}
                        <Route
                            path="/"
                            element={
                                !user ? (
                                    <HomePage setShowAuthModal={setShowAuthModal} />
                                ) : (
                                    // If user exists, navigate to their account type route
                                    <Navigate to={`/${user.account_type}`} />
                                )
                            }
                        />

                        {/* Separate routes for each account type */}
                        <Route
                            path="/new_client"
                            element={
                                user && user.account_type === AccountType.client_new ? (
                                    <Form
                                        id={user.id}
                                        name={user.name}
                                        email={user.email}
                                        account_type={user.account_type}
                                        onSubmitDriverForm={handleDriverSubmit}
                                        onSubmitClientForm={handleClientSubmit}
                                    />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        <Route
                            path="/new_driver"
                            element={
                                user && user.account_type === AccountType.driver_new ? (
                                    <Form
                                        id={user.id}
                                        name={user.name}
                                        email={user.email}
                                        account_type={user.account_type}
                                        onSubmitDriverForm={handleDriverSubmit}
                                        onSubmitClientForm={handleClientSubmit}
                                    />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        <Route
                            path="/request_pending"
                            element={
                                user && (user.account_type === AccountType.driver_pending || user.account_type === AccountType.client_pending) ? (
                                    <FormPending
                                        account_type={user.account_type}
                                        onFetchDriverForm={fetchDriverData}
                                        onFetchClientForm={fetchClientData}
                                    />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        <Route
                            path="/client"
                            element={
                                user && user.account_type === AccountType.client ? (
                                    <ClientDashboard
                                        user={user}
                                        baseUrl={baseUrl}
                                        getTokenFromCookies={getTokenFromCookies}
                                        onLogout={handleLogout}
                                    />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        <Route
                            path="/driver"
                            element={
                                user && user.account_type === AccountType.driver ? (
                                    <DriverDashboard
                                        user={user}
                                        baseUrl={baseUrl}
                                        getTokenFromCookies={getTokenFromCookies}
                                    />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />

                        {/* Fallback for unsupported account types */}
                        <Route
                            path="*"
                            element={
                                // If the account type is unsupported, reset user
                                user && handleUnsupportedAccountType(user) ? (
                                    <Navigate to="/" />
                                ) : null
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

            </div>
        </ThemeProvider>
    );
}

export default App;
