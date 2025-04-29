
import React, { useState } from 'react';
import ChatContainer from './chat/ChatContainer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Message } from './chat/ChatContext';

const ChatInterface = () => {
  const [historyMessages, setHistoryMessages] = useState<Message[]>(
    JSON.parse(localStorage.getItem('chatHistory') || '[]')
  );

  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <ChatContainer historyMessages={historyMessages} />
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
