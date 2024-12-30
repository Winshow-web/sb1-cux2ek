import { LogOut } from 'lucide-react';
import type { User } from '@global/types.ts';

const TABS = [
    { id: 'overview', name: 'Overview' },
    { id: 'drivers', name: 'Find Drivers' },
    { id: 'schedule', name: 'Schedule' },
    { id: 'invoices', name: 'Invoices' },
] as const;

type TabId = typeof TABS[number]['id'];

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
}

export default function Navbar({ user, onLogout, activeTab, setActiveTab }: NavbarProps) {

    return (
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Tab Buttons */}
                    <div className="flex space-x-8">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Right side: Auth or Logout button */}
                    <div className="flex items-center ml-auto">
                        {user ? (
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
