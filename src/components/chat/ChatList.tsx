import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import type { User } from '../../types';

interface ChatListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  currentUser: User;
}

export default function ChatList({ users, onSelectUser, currentUser }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(
    user => 
      user.id !== currentUser.id &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="w-full p-4 flex items-center hover:bg-gray-50 transition-colors"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.type}</p>
            </div>
            <MessageCircle className="ml-auto h-5 w-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}