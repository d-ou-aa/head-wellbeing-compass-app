
import React, { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ChatContextProvider } from './ChatContext';
import { Card } from '@/components/ui/card';

const ChatContainer = () => {
  return (
    <Card className="h-[calc(100vh-160px)] flex flex-col bg-white dark:bg-card rounded-lg shadow-sm">
      <ChatContextProvider>
        <div className="bg-teal p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="/lovable-uploads/d7c3a4b7-2864-4a8f-84a7-024a028614d0.png" 
                alt="HeadDoWell Avatar" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="ml-3">
              <h2 className="font-medium text-white">Chat with HeadDoWell</h2>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
        </div>
        <ChatMessages />
        <ChatInput />
      </ChatContextProvider>
    </Card>
  );
};

export default ChatContainer;
