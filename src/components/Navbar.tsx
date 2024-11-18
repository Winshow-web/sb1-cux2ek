import { Menu, X, Bus, UserCircle, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, onAuthClick, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Trigger animation when user logs in
  useEffect(() => {
    if (user) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className={`flex-shrink-0 transition-transform duration-1000 ease-in-out ${
              animate ? 'translate-x-[200%]' : 'translate-x-0'
            }`}>
              <Bus className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                {user && (
                  <>
                    <a href="#drivers" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Find Drivers</a>
                    <a href="#bookings" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">My Bookings</a>
                  </>
                )}
                <a href="#about" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user.name}</span>
                  <button
                    onClick={onLogout}
                    className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Home</a>
            {user && (
              <>
                <a href="#drivers" className="text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Find Drivers</a>
                <a href="#bookings" className="text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">My Bookings</a>
              </>
            )}
            <a href="#about" className="text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">About</a>
            {user ? (
              <button
                onClick={onLogout}
                className="w-full text-left text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="w-full text-left text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}