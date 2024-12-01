import { useState, useEffect } from 'react';
//import { Supabase_User } from '@supabase/supabase-js';
import {AccountType, User, DriverForm, ClientForm} from "./types.ts";
import AnimatedBackground from "./Components/Home/AnimatedBackground.tsx";
import Navbar from "./Components/Home/Navbar.tsx";
import Hero from "./Components/Home/Hero.tsx";
import Form from "./Components/Form/Form.tsx";
import Footer from "./Components/Home/Footer.tsx";
import AuthModal from "./Components/AuthSidePanel/AuthSidePanel";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const baseUrl = (import.meta as any).env.VITE_SERVER_URL;

    // Cookie functions
    const setTokenInCookies = (token: string): void => {
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // Set cookie expiry time (1 hour)
        document.cookie = `authToken=${token}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`; // Secure; HttpOnly;
    };

    const getTokenFromCookies = (): string | null => {
        const match = document.cookie.match(/(^| )authToken=([^;]+)/);
        console.log("match", match);
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

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setTokenInCookies(data.session.access_token);
                setShowAuthModal(false);
            } else {
                console.error('Login response not ok');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleSignup = async (name: string, email: string, password: string, account_type: AccountType) => {
        try {
            if (account_type !== AccountType.client_new && account_type !== AccountType.driver_new) {
                console.error('C: Provide a valid account type for register: ' + account_type);
            }

            const response = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, account_type }),
            });

            if (response.ok) {
                //const data = await response.json();
                //console.log(data);
                //const { id, email, display_name, account_type } = data.user;
                //setUser(new User(id, display_name, email, account_type));
                alert('Registration successful!');
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    // Function to handle driver registration form submission
    const handleDriverSubmit = async (driverData: DriverForm): Promise<void> => {
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
                alert('Driver registration successful!');
                // TODO: 5 After success, load the form and then redirect to a form pending page
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

    const handleClientSubmit = async (clientData: ClientForm): Promise<void> => {
        try {
            const token = getTokenFromCookies();
            if (!token) {
                alert('User not authenticated. Please log in to continue.');
                console.error('User not authenticated');
                return;
            }

            const formData = new FormData();
            formData.append('id', clientData.id);
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
                alert('Client registration successful!');
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
        <div className="min-h-screen bg-transparent flex flex-col relative">
            <AnimatedBackground />
            <Navbar
                user={user}
                onAuthClick={() => setShowAuthModal(true)}
                onLogout={handleLogout}
            />

            {!user && <Hero />}

            <main className="flex-grow">
                {user ? (
                    user.account_type === AccountType.client_new || user.account_type === 'driver_new' ? (
                        <Form
                            id={user.uuid}
                            name={user.name}
                            email={user.email}
                            account_type={user.account_type}
                            onSubmitDriverForm={handleDriverSubmit}
                            onSubmitClientForm={handleClientSubmit}
                        />
                    ) : (
                        <p>Unsupported account type: {user.account_type}</p>
                    )
                ) : (
                    <p>No user logged in</p>
                )}
            </main>

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onLogin={handleLogin}
                    onSignup={handleSignup}
                />
            )}

            <Footer />
        </div>
    );
}

export default App;
