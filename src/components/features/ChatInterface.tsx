
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import PenguinMascot from '../mascot/PenguinMascot';

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai'; timestamp: Date }[]>([
    { 
      text: "Hi there! I'm Wysa, your mental wellness companion. How are you feeling today?", 
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
    <div className="h-[calc(100vh-160px)] flex flex-col bg-white dark:bg-card rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="bg-teal p-4 text-white flex items-center">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm">W</span>
        </div>
        <div className="flex-1">
          <h2 className="font-medium">Chat with Wysa</h2>
          <p className="text-xs text-white/80">Your AI wellness penguin</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
            {message.sender === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8">
                <PenguinMascot size="sm" animation="none" />
              </div>
            )}
            <div>
              <p className="text-gray-800 dark:text-gray-200">{message.text}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-card">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`ml-2 rounded-full w-8 h-8 flex items-center justify-center transition-colors ${
              input.trim() ? 'bg-teal text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
