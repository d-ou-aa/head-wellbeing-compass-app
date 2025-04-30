
import { useEffect, useState } from 'react';
import { Message } from '@/components/features/chat/ChatContext';

export const useChatHistory = () => {
  const [messages, setMessages] = useState<Message[]>(
    JSON.parse(localStorage.getItem('chatHistory') || '[]')
  );

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      
      // Dispatch a custom event to notify other components about the update
      const event = new Event('chatHistoryUpdated');
      window.dispatchEvent(event);
    }
  }, [messages]);

  return { messages, setMessages };
};
