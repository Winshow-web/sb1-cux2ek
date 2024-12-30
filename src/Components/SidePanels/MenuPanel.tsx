import { User, ClipboardCheck, Users, X } from 'lucide-react';
import type { User as UserType } from '@global/types.ts';

interface MenuPanelProps {
    user: UserType | null;
    onClose: () => void;  // This handler is passed from the parent
}

export default function MenuPanel({ user, onClose }: MenuPanelProps) {
    return (
        <div>
            {/* Backdrop (clicking on it will trigger onClose) */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={onClose}  // Triggers close when backdrop is clicked
            ></div>

            {/* Panel */}
            <div className="fixed inset-y-0 left-0 w-64 h-full bg-white shadow-lg p-4 flex flex-col z-50">
                {/* Close button */}
                <button
                    onClick={onClose}  // Triggers close when the close button is clicked
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Contents Button */}
                <a href="/" className="text-indigo-600 block px-3 py-2 rounded-md text-base font-medium mb-4">
                    Home
                </a>

                <div className="flex-1">
                    {user ? (
                        <div className="space-y-4">
                            <a href="/profile" className="text-gray-600 hover:text-indigo-600 flex items-center px-3 py-2 rounded-md text-base font-medium">
                                <User className="h-5 w-5 mr-2" />
                                Profile
                            </a>
                            <a href="/bookings" className="text-gray-600 hover:text-indigo-600 flex items-center px-3 py-2 rounded-md text-base font-medium">
                                <ClipboardCheck className="h-5 w-5 mr-2" />
                                My Bookings
                            </a>
                            <a href="/drivers" className="text-gray-600 hover:text-indigo-600 flex items-center px-3 py-2 rounded-md text-base font-medium">
                                <Users className="h-5 w-5 mr-2" />
                                Find Drivers
                            </a>
                        </div>
                    ) : null}
                </div>

                {/* About Button */}
                <a href="/about" className="text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium mt-4">
                    About
                </a>
            </div>
        </div>
    );
}
