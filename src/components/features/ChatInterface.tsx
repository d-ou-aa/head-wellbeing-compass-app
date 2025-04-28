
import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ChatHistory from './ChatHistory';
import { detectSymptoms, getQuestionsForSymptom, getAffirmationsForSymptom } from '@/services/mentalHealthService';
import { DetectedSymptom } from '@/types/mentalHealth';

type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const emojis = [
  '😊', '😃', '😄', '😁', '😆', '😅', '🥰', '😇', 
  '😉', '😌', '😍', '🤗', '🤔', '🤨', '😐', '😑',
  '😶', '🙄', '😏', '😣', '😥', '😮', '😯', '😪',
  '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓',
  '😔', '😕', '🙃', '🤑', '😲', '☹️', '😖', '😞',
  '😤', '😢', '😭', '😧', '😩', '😰', '😱', '🥵'
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentSymptom, setCurrentSymptom] = useState<DetectedSymptom | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    } else {
      setMessages([
        { 
          text: "Hi there! I'm HeadDoWell, your mental wellness companion. How are you feeling today?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' as const, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    const detectedSymptoms = detectSymptoms(input);
    
    if (detectedSymptoms.length > 0) {
      setCurrentSymptom(detectedSymptoms[0]);
      setQuestionIndex(0);
      setYesCount(0);
      
      const questions = getQuestionsForSymptom(detectedSymptoms[0].disorder, detectedSymptoms[0].name);
      const aiMessage = {
        text: questions[0],
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      const aiMessage = {
        text: "I'm here to listen. Could you tell me more about how you're feeling?",
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }
    
    setInput('');
  };

  const handleUserResponse = (input: string) => {
    if (!currentSymptom) return;

    const isYes = input.toLowerCase().includes('yes');
    if (isYes) setYesCount(prev => prev + 1);

    const questions = getQuestionsForSymptom(currentSymptom.disorder, currentSymptom.name);
    
    if (yesCount >= 3 || questionIndex === questions.length - 1) {
      const affirmations = getAffirmationsForSymptom(currentSymptom.disorder, currentSymptom.name);
      const affirmationMessage = {
        text: affirmations.join('\n'),
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, affirmationMessage]);
      setCurrentSymptom(null);
      setQuestionIndex(0);
      setYesCount(0);
    } else {
      setQuestionIndex(prev => prev + 1);
      const nextQuestion = {
        text: questions[questionIndex + 1],
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, nextQuestion]);
    }
  };

  const clearHistory = () => {
    const initialMessage = {
      text: "Hi there! I'm HeadDoWell, your mental wellness companion. How are you feeling today?",
      sender: 'ai' as const,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    localStorage.setItem('chatHistory', JSON.stringify([initialMessage]));
  };
  
  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  return (
    <Card className="h-[calc(100vh-160px)] flex flex-col bg-white dark:bg-card rounded-lg shadow-sm">
      <div className="bg-teal p-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center">
          <ChatHistory messages={messages} />
          <div className="ml-3">
            <h2 className="font-medium text-white">Chat with HeadDoWell</h2>
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
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
