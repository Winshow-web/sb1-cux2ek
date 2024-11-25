import { useStore } from '../store';
import { Message } from '../store';

export function useMessages() {
  const { messages, addMessage } = useStore();

  const sendMessage = (senderUuid: string, receiverUuid: string, textContent: string, mediaUrl?: string, replyMessageId?: string) => {
    const newMessage: Message = {
      message_id: Math.random().toString(36).substring(7),
      sender_uuid: senderUuid,
      receiver_uuid: receiverUuid,
      text_content: textContent,
      media_url: mediaUrl || '',
      reply_message_id: replyMessageId || '',
      read: false,
      createdAt: new Date(),
    };
    addMessage(newMessage);
    return newMessage;
  };

  const getConversation = (userUuid1: string, userUuid2: string) => {
    return messages.filter(
      (message) =>
        (message.sender_uuid === userUuid1 && message.receiver_uuid === userUuid2) ||
        (message.sender_uuid === userUuid2 && message.receiver_uuid === userUuid1)
    );
  };

  return {
    messages,
    sendMessage,
    getConversation,
  };
}