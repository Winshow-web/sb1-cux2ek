interface NavbarProps {
    onAuthClick: () => void;
}

export default function Navbar({ onAuthClick}: NavbarProps) {

    return (
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center ml-auto">
                        <button
                            onClick={onAuthClick}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
