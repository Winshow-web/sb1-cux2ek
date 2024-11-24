import {useState} from 'react';
import {Booking, Driver, User, UserType} from '../types';
import DriverCard from './DriverCard';
import BookingsList from './BookingsList';
import DashboardOverview from './dashboard/DashboardOverview';
import ActiveContracts from './dashboard/ActiveContracts';
import RouteSchedule from './dashboard/RouteSchedule';
import ChatList from './chat/ChatList';
import ChatWindow from './chat/ChatWindow';

//import { Layout, ChevronDown } from 'lucide-react';

interface ClientDashboardProps {
  user: User;
  drivers: Driver[];
  bookings: Booking[];
  onBook: (driverId: string) => void;
}

export default function ClientDashboard({
  user,
  drivers,
  bookings,
  onBook,
}: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'schedule'>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const handleSendMessage = (content: string) => {
    if (selectedUser) {
      const newMessage = {
        id: Math.random().toString(),
        sender: user.id,
        receiver: selectedUser.id,
        content,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setMessages([...messages, newMessage]);
      // Here you would also emit the message via Socket.IO
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'drivers', name: 'Find Drivers' },
            { id: 'schedule', name: 'Schedule' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {activeTab === 'overview' && (
            <>
              <DashboardOverview
                activeBookings={activeBookings.length}
                completedBookings={completedBookings.length}
                pendingBookings={pendingBookings.length}
              />
              <ActiveContracts bookings={activeBookings} drivers={drivers} />
            </>
          )}

          {activeTab === 'drivers' && (
            <section id="drivers">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Drivers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {drivers
                  .filter((driver) => driver.availability)
                  .map((driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      onBook={onBook}
                    />
                  ))}
              </div>
            </section>
          )}

          {activeTab === 'schedule' && (
            <RouteSchedule bookings={bookings} drivers={drivers} />
          )}

          {bookings.length > 0 && activeTab === 'overview' && (
            <section id="bookings" className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Bookings</h2>
              <BookingsList bookings={bookings.slice(0, 5)} drivers={drivers} />
            </section>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="ml-8 flex flex-col space-y-4">
          <ChatList
            users={drivers.map(d => ({ id: d.id, email: d.email, name: d.name, type: UserType.Driver }))}
            onSelectUser={setSelectedUser}
            currentUser={user}
          />
          {selectedUser && (
            <ChatWindow
              currentUser={user}
              otherUser={selectedUser}
              messages={messages.filter(
                m => (m.sender === user.id && m.receiver === selectedUser.id) ||
                     (m.sender === selectedUser.id && m.receiver === user.id)
              )}
              onSendMessage={handleSendMessage}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}