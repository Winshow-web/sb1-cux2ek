import React, {useState} from 'react';
import {Lock, Mail, Truck, User, Users, X} from 'lucide-react';
import {AccountType} from "../../types.ts";

interface AuthModalProps {
    onClose: () => void;
    baseUrl: string;
    setUser: (user: any) => void;
    setTokenInCookies: (token: string) => void;
    setShowAuthModal: (show: boolean) => void;
}

export default function AuthModal({ onClose, baseUrl, setUser, setTokenInCookies, setShowAuthModal }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        account_type: AccountType.none as AccountType,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin(formData.email, formData.password);
        } else {
            handleSignup(formData.name, formData.email, formData.password, formData.account_type);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 flex items-center justify-end z-50">
            <div className="h-full w-full max-w-md bg-white/90 backdrop-blur-lg p-8 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="h-full flex flex-col justify-center">
                    <h2 className="text-3xl font-semibold mb-8 text-gray-900">
                        {isLogin ? 'Welcome Back' : 'Join Us'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <div className="flex items-center mb-1">
                                        <User className="h-4 w-4 mr-2" />
                                        Full Name
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </label>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <div className="flex items-center mb-1">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <div className="flex items-center mb-1">
                                    <Lock className="h-4 w-4 mr-2" />
                                    Password
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </label>
                        </div>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center px-3 py-2 border rounded-md ${
                                            formData.account_type == AccountType.client_new
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-300 bg-white/50 text-gray-700'
                                        }`}
                                        onClick={() => setFormData({ ...formData, account_type: AccountType.client_new })}
                                    >
                                        <Users className="h-4 w-4 mr-2" />
                                        Client
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center px-3 py-2 border rounded-md ${
                                            formData.account_type == AccountType.driver_new
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-300 bg-white/50 text-gray-700'
                                        }`}
                                        onClick={() => setFormData({ ...formData, account_type: AccountType.driver_new })}
                                    >
                                        <Truck className="h-4 w-4 mr-2" />
                                        Driver
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col space-y-4">
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                {isLogin ? 'Login' : 'Sign Up'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10" onClick={onClose}></div>
        </div>
    );
}