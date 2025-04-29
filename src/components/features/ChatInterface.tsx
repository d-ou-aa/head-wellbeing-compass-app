
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
  const [detectedSymptoms, setDetectedSymptoms] = useState<DetectedSymptom[]>([]);
  const [confirmedSymptoms, setConfirmedSymptoms] = useState<DetectedSymptom[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [askedDisorders, setAskedDisorders] = useState<string[]>([]);
  const [conversationState, setConversationState] = useState<'initial' | 'detecting' | 'questioning' | 'summarizing'>('initial');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Clear chat history when navigating to this page
    setMessages([
      { 
        text: "Hi there! I'm HeadDoWell, your mental wellness companion. How are you feeling today?",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setCurrentSymptom(null);
    setDetectedSymptoms([]);
    setConfirmedSymptoms([]);
    setQuestionIndex(0);
    setYesCount(0);
    setAskedDisorders([]);
    setConversationState('initial');
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    // Process conversation state transitions
    if (conversationState === 'detecting' && detectedSymptoms.length > 0) {
      setTimeout(() => {
        handleDetectedSymptoms();
      }, 800);
    } else if (conversationState === 'summarizing' && confirmedSymptoms.length > 0) {
      setTimeout(() => {
        provideSummaryAndRecommendations();
      }, 1000);
    }
  }, [conversationState, detectedSymptoms, confirmedSymptoms]);

  const handleDetectedSymptoms = () => {
    if (detectedSymptoms.length > 0) {
      const nextSymptom = detectedSymptoms[0];
      // Show message about which disorder we're discussing
      if (!askedDisorders.includes(nextSymptom.disorder)) {
        setAskedDisorders(prev => [...prev, nextSymptom.disorder]);
        
        const aiMessage = {
          text: `Let's talk about ${nextSymptom.disorder}...`,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        
        setTimeout(() => {
          const questions = getQuestionsForSymptom(nextSymptom.disorder, nextSymptom.name);
          if (questions.length > 0) {
            setCurrentSymptom(nextSymptom);
            setQuestionIndex(0);
            setYesCount(0);
            const questionMessage = {
              text: questions[0],
              sender: 'ai' as const,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, questionMessage]);
            setConversationState('questioning');
          }
        }, 800);
      } else {
        // Just ask about the next symptom
        const questions = getQuestionsForSymptom(nextSymptom.disorder, nextSymptom.name);
        if (questions.length > 0) {
          setCurrentSymptom(nextSymptom);
          setQuestionIndex(0);
          setYesCount(0);
          const questionMessage = {
            text: questions[0],
            sender: 'ai' as const,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, questionMessage]);
          setConversationState('questioning');
        }
      }
      
      // Remove this symptom from the detected symptoms queue
      setDetectedSymptoms(prev => prev.filter((_, i) => i !== 0));
    } else {
      // If no more symptoms to check, provide summary
      setConversationState('summarizing');
    }
  };

  const provideSummaryAndRecommendations = () => {
    if (confirmedSymptoms.length > 0) {
      // Create summary message
      const summaryText = `Thank you for sharing. Here are the symptoms we've identified:\n\n${
        confirmedSymptoms.map(s => `• ${s.name}`).join('\n')
      }\n\nRemember that this is not a diagnosis. If you're struggling, consider speaking with a mental health professional.`;
      
      const summaryMessage = {
        text: summaryText,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, summaryMessage]);
    } else {
      const noSymptomsMessage = {
        text: "Thanks for sharing how you're feeling. I haven't identified specific symptoms, but that doesn't mean your concerns aren't valid. If you're feeling unwell, it's always a good idea to talk to someone who can help.",
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, noSymptomsMessage]);
    }
    
    // Reset conversation state to initial after summary
    setConversationState('initial');
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' as const, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    if (conversationState === 'questioning' && currentSymptom) {
      // We're in the middle of questionnaire flow
      const isYes = input.toLowerCase().includes('yes') || 
                    input.toLowerCase().includes('yeah') || 
                    input.toLowerCase().includes('correct') ||
                    input.toLowerCase().includes('true');
                    
      if (isYes) {
        setYesCount(prev => prev + 1);
        
        // Send an affirmation as reply
        const affirmations = getAffirmationsForSymptom(currentSymptom.disorder, currentSymptom.name);
        if (affirmations.length > 0) {
          const affirmationIndex = Math.min(questionIndex, affirmations.length - 1);
          const affirmationMessage = {
            text: affirmations[affirmationIndex],
            sender: 'ai' as const,
            timestamp: new Date()
          };
          
          setTimeout(() => {
            setMessages(prev => [...prev, affirmationMessage]);
            processNextQuestion();
          }, 500);
        } else {
          processNextQuestion();
        }
      } else {
        // No affirmation for "no" answers, just move to next question
        processNextQuestion();
      }
    } else {
      // Initial input processing - detect symptoms
      const detectedSyms = detectSymptoms(input);
      
      if (detectedSyms.length > 0) {
        setDetectedSymptoms(detectedSyms);
        
        // Acknowledge detected symptoms
        const detectionMessage = {
          text: `I hear you're experiencing some challenges. Let me ask you a few questions to better understand how you're feeling.`,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, detectionMessage]);
          setConversationState('detecting');
        }, 1000);
      } else {
        const aiMessage = {
          text: "I'm here to listen. Could you tell me more about how you're feeling?",
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage]);
        }, 500);
      }
    }
    
    setInput('');
  };
  
  const processNextQuestion = () => {
    if (!currentSymptom) return;
    
    const questions = getQuestionsForSymptom(currentSymptom.disorder, currentSymptom.name);
    
    if (yesCount >= 2 || questionIndex === questions.length - 1) {
      // Symptom is confirmed if 2+ yes answers or we reached the end of questions
      if (yesCount >= 2) {
        setConfirmedSymptoms(prev => [...prev, {...currentSymptom, confirmed: true}]);
        
        const confirmMessage = {
          text: `I understand you're experiencing ${currentSymptom.name.toLowerCase()}.`,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, confirmMessage]);
          
          // Check if we have more symptoms to discuss or if we should summarize
          if (detectedSymptoms.length > 0) {
            setConversationState('detecting');
          } else {
            setConversationState('summarizing');
          }
        }, 800);
      } else {
        // Move to next detected symptom without confirming this one
        if (detectedSymptoms.length > 0) {
          setConversationState('detecting');
        } else {
          setConversationState('summarizing');
        }
      }
    } else {
      // Ask next question for current symptom
      setQuestionIndex(prev => prev + 1);
      
      const nextQuestion = {
        text: questions[questionIndex + 1],
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, nextQuestion]);
      }, 800);
    }
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
                <p className="text-sm whitespace-pre-line">{message.text}</p>
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
