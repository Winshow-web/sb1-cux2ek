import { create } from 'zustand';
import type { Message, User } from '@global/types.ts';

interface ChatState {
  messages: Message[];
  selectedUser: User | null;
  addMessage: (message: Message) => void;
  setSelectedUser: (user: User | null) => void;
  markMessagesAsRead: (senderId: string, receiverId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  selectedUser: null,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setSelectedUser: (user) =>
    set(() => ({
      selectedUser: user,
    })),
  markMessagesAsRead: (senderId, receiverId) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.sender === senderId && msg.receiver === receiverId ? { ...msg, read: true } : msg
      ),
    })),
}));