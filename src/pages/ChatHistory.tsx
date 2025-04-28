
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from '@/components/ui/card';

const ChatHistory = () => {
  const messages = JSON.parse(localStorage.getItem('chatHistory') || '[]')
    .map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));

  return (
    <MainLayout pageTitle="Chat History">
      <Card className="p-6">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {messages.map((message: any, index: number) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="/lovable-uploads/d7c3a4b7-2864-4a8f-84a7-024a028614d0.png" 
                      alt="HeadDoWell Avatar" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-teal text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-sm text-white">You</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </MainLayout>
  );
};

export default ChatHistory;
