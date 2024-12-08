import type { User } from '../../../../types';
import ChatList from '../../Components/chat/ChatList';
import ChatWindow from '../../Components/chat/ChatWindow';
import { useChatStore } from '../../../../store/chatStore';

interface DriverDashboardSidebarProps {
  currentUser: User;
  allUsers: User[];
}

export default function DriverDashboardSidebar({ currentUser, allUsers }: DriverDashboardSidebarProps) {
  const { selectedUser, messages, setSelectedUser, addMessage } = useChatStore();

  const handleSendMessage = (content: string) => {
    if (selectedUser) {
      const newMessage = {
        id: Math.random().toString(),
        sender: currentUser.id,
        receiver: selectedUser.id,
        content,
        createdAt: new Date().toISOString(),
        read: false,
      };
      addMessage(newMessage);
    }
  };

  return (
    <>
      <ChatList
        users={allUsers.filter(u => u.id !== currentUser.id)}
        onSelectUser={setSelectedUser}
        currentUser={currentUser}
      />
      {selectedUser && (
        <ChatWindow
          currentUser={currentUser}
          otherUser={selectedUser}
          messages={messages.filter(
            m => (m.sender === currentUser.id && m.receiver === selectedUser.id) ||
                 (m.sender === selectedUser.id && m.receiver === currentUser.id)
          )}
          onSendMessage={handleSendMessage}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}