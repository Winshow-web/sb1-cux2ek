import { User } from 'lucide-react';
import { supabase } from '../db/index.js';

const Message = {
  async create({ senderId, receiverId, content }) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        content
      }])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async findConversation(userId1, userId2) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users!messages_sender_id_fkey (
          name
        ),
        users!messages_receiver_id_fkey (
          name
        )
      `)
      .or(`sender_id.eq.${userId1},sender_id.eq.${userId2}`)
      .or(`receiver_id.eq.${userId1},receiver_id.eq.${userId2}`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async markAsRead(senderId, receiverId) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('read', false)
      .select('*');

    if (error) throw error;
    return data;
  }
};

export default User;