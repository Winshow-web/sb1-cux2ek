import { useState, useEffect } from 'react';
import type { User, Driver, Booking } from '../types';
import ProfileCard from './profile/ProfileCard';
import DriverStats from './dashboard/DriverStats';
import UpcomingTrips from './dashboard/UpcomingTrips';
import AvailableJobs from './dashboard/AvailableJobs';
import ChatList from './chat/ChatList';
import ChatWindow from './chat/ChatWindow';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';

interface DriverDashboardProps {
  user: User;
  driver: Driver;
  bookings: Booking[];
  onUpdateAvailability: (available: boolean) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onUpdateDriver?: (updatedDriver: Driver) => void;
  allUsers: User[];
}

export default function DriverDashboard({
  user,
  driver,
  bookings,
  onUpdateAvailability,
  onUpdateBookingStatus,
  onUpdateDriver,
  allUsers,
}: DriverDashboardProps) {
  const [activeSection, setActiveSection] = useState<'schedule' | 'jobs'>('schedule');
  const { selectedUser, messages, setSelectedUser, addMessage } = useChatStore();
  
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

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
      addMessage(newMessage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile and Stats */}
            <div className="lg:col-span-1 space-y-8">
              <ProfileCard
                driver={driver}
                onViewSection={setActiveSection}
                activeSection={activeSection}
                onUpdateDriver={onUpdateDriver}
              />
              <DriverStats
                totalTrips={completedBookings.length}
                pendingRequests={pendingBookings.length}
                activeTrips={confirmedBookings.length}
                rating={driver.rating}
              />
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeSection === 'schedule' ? (
                <UpcomingTrips
                  bookings={confirmedBookings}
                  onUpdateStatus={onUpdateBookingStatus}
                />
              ) : (
                <AvailableJobs
                  driver={driver}
                  onUpdateAvailability={onUpdateAvailability}
                />
              )}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 flex flex-col space-y-4">
          <ChatList
            users={allUsers.filter(u => u.id !== user.id)}
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