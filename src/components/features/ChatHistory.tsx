
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from 'lucide-react';

type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative w-10 h-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
          <img 
            src="/lovable-uploads/d7c3a4b7-2864-4a8f-84a7-024a028614d0.png" 
            alt="Chat History" 
            className="w-full h-full object-contain"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
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
                    {new Date(message.timestamp).toLocaleTimeString([], { 
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
      </DialogContent>
    </Dialog>
  );
};

export default ChatHistory;
