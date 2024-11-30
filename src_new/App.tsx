import { useState } from 'react';
//import { Supabase_User } from '@supabase/supabase-js';
import {AccountType, User, Client, Driver, DriverForm} from "./types.ts";


import AnimatedBackground from "../src/components/AnimatedBackground.tsx";
import Navbar from "./Components/Home/Navbar.tsx"
import Hero from "./Components/Home/Hero.tsx";
import Form from "./Components/Form/Form.tsx";
import Footer from "./Components/Home/Footer.tsx";


import AuthModal from "../src/components/AuthModal.tsx";




function App() {
    const [user, setUser] = useState<User | null>(null);

    const [showAuthModal, setShowAuthModal] = useState(false);

    //const [messages, setMessages] = useState<Message[]>([]);

    //const [bookings, setBookings] = useState<Booking[]>([]);
    //const [showBookingForm, setShowBookingForm] = useState(false);

    const baseUrl = import.meta.env.VITE_SERVER_URL;

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
                localStorage.setItem('authToken', data.token); // Store the token securely
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
                console.error('C: Provide a valid account type for register: ' + account_type );
            }

            const response = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, account_type }),
            });

            if (response.ok) {
                const data = await response.json();

                const { id, email, user_metadata } = data.data.user;
                const { display_name, account_type } = user_metadata;

                setUser(new User(id, display_name, email, account_type));

                alert('Registration successful!');
            } else {
                console.error('Registration failed');
            }


        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const handleDriverSubmit = async (driverData: DriverForm) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('User not authenticated');
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

            if (driverData.photo) {
                formData.append('photo', driverData.photo);
            }

            const response = await fetch(`${baseUrl}/form/driver`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Request submitted succsessfully\n"+data);
                setUser(data.user); // Update the user state if necessary
                alert('Driver registration successful!');
            } else {
                console.error('Driver registration failed: ');
            }
        } catch (error) {
            console.error('Error submitting driver form:', error);
        }
    };

    const handleClientSubmit = () => {
        console.log('Client form submitted');
    };

    const handleLogout = async () => {
        try {
            setUser(null);
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