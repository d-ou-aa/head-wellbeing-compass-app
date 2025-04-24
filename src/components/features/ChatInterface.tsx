
import React, { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai'; timestamp: Date }[]>([
    { 
      text: "Hi there! I'm HeadDoWell, your mental wellness companion. How are you feeling today?", 
      sender: 'ai', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' as const, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      let response: string;

      if (input.toLowerCase().includes('anxiety') || input.toLowerCase().includes('anxious')) {
        response = "It sounds like you might be experiencing some anxiety. That's completely valid. Would you like to try a quick breathing exercise to help calm your mind?";
      } else if (input.toLowerCase().includes('sad') || input.toLowerCase().includes('depressed')) {
        response = "I'm sorry to hear you're feeling down. Would you like to talk more about what's been going on, or perhaps try an activity that might help lift your spirits?";
      } else if (input.toLowerCase().includes('stress') || input.toLowerCase().includes('stressed')) {
        response = "Dealing with stress can be challenging. Would you like to explore some stress management techniques that have helped others?";
      } else if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
        response = "Hello! It's great to chat with you today. How are you feeling?";
      } else {
        response = "Thank you for sharing that with me. Would you like to explore this further or try a mindfulness activity?";
      }

      const aiMessage = { text: response, sender: 'ai' as const, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <Card className="h-[calc(100vh-160px)] flex flex-col bg-white dark:bg-card rounded-lg shadow-sm">
      {/* Header */}
      <div className="bg-teal p-4 flex items-center rounded-t-lg">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img 
            src="/lovable-uploads/d7c3a4b7-2864-4a8f-84a7-024a028614d0.png" 
            alt="HeadDoWell Avatar" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h2 className="font-medium text-white">Chat with HeadDoWell</h2>
          <p className="text-xs text-white/80">Online</p>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
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
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {message.sender === 'user' && (
                <Avatar className="w-8 h-8 bg-orange-500">
                  <span className="text-sm text-white">You</span>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              size="icon"
              className="bg-teal hover:bg-teal/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
