import { useState } from 'react';
import { useStore } from '../store';
import { AccountType, BasicUser } from '../store';

export function useAuth() {
  const { setUser } = useStore();
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, accountType: AccountType) => {
    try {
      // Simulate API call
      const mockUser: BasicUser = {
        uuid: Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0],
        password,
        accountType,
      };
      
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      setError('Login failed. Please try again.');
      return null;
    }
  };

  const signup = async (name: string, email: string, password: string, accountType: AccountType) => {
    try {
      // Simulate API call
      const mockUser: BasicUser = {
        uuid: Math.random().toString(36).substring(7),
        email,
        name,
        password,
        accountType,
      };
      
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      setError('Signup failed. Please try again.');
      return null;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return {
    login,
    signup,
    logout,
    error,
  };
}