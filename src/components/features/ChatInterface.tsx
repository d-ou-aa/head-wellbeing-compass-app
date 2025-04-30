
import React, { useState, useEffect } from 'react';
import ChatContainer from './chat/ChatContainer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Message } from './chat/ChatContext';

const ChatInterface = () => {
  const [historyMessages, setHistoryMessages] = useState<Message[]>(
    JSON.parse(localStorage.getItem('chatHistory') || '[]')
  );

  // Listen for changes to the chat history in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      setHistoryMessages(updatedHistory);
    };

    // Set up event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for local updates (within the same window/tab)
    window.addEventListener('chatHistoryUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chatHistoryUpdated', handleStorageChange);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <ChatContainer historyMessages={historyMessages} />
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
