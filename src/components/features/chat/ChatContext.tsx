
import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectSymptoms, getQuestionsForSymptom, getAffirmationsForSymptom } from '@/services/mentalHealthService';
import { DetectedSymptom } from '@/types/mentalHealth';

export type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type ChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  addEmoji: (emoji: string) => void;
  currentSymptom: DetectedSymptom | null;
  conversationState: 'initial' | 'detecting' | 'questioning' | 'summarizing';
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentSymptom, setCurrentSymptom] = useState<DetectedSymptom | null>(null);
  const [detectedSymptoms, setDetectedSymptoms] = useState<DetectedSymptom[]>([]);
  const [confirmedSymptoms, setConfirmedSymptoms] = useState<DetectedSymptom[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [askedDisorders, setAskedDisorders] = useState<string[]>([]);
  const [conversationState, setConversationState] = useState<'initial' | 'detecting' | 'questioning' | 'summarizing'>('initial');

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

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        handleSend,
        addEmoji,
        currentSymptom,
        conversationState
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};
