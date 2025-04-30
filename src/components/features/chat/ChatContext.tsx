import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectSymptoms, getQuestionsForSymptom, getAffirmationsForSymptom } from '@/services/mentalHealthService';
import { DetectedSymptom } from '@/types/mentalHealth';
import { toast } from '@/components/ui/use-toast';

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

  // Initialize the chat with a welcome message
  useEffect(() => {
    setMessages([
      { 
        text: "Hi there! I'm HeadDoWell, your mental wellness companion. How are you feeling today?",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    resetConversation();
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) { // Skip the initial greeting message
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      
      // Dispatch a custom event to notify other components about the update
      const event = new Event('chatHistoryUpdated');
      window.dispatchEvent(event);
    }
  }, [messages]);

  // Reset the conversation state variables
  const resetConversation = () => {
    setCurrentSymptom(null);
    setDetectedSymptoms([]);
    setConfirmedSymptoms([]);
    setQuestionIndex(0);
    setYesCount(0);
    setAskedDisorders([]);
    setConversationState('initial');
  };

  // Handle state transitions based on conversation flow
  useEffect(() => {
    if (conversationState === 'detecting' && detectedSymptoms.length > 0) {
      console.log('Starting symptom detection process');
      // Short delay to make the conversation feel natural
      setTimeout(() => {
        handleDetectedSymptoms();
      }, 800);
    } else if (conversationState === 'summarizing' && confirmedSymptoms.length > 0) {
      console.log('Starting summary process with symptoms:', confirmedSymptoms);
      // Delay before providing the summary
      setTimeout(() => {
        provideSummaryAndRecommendations();
      }, 1000);
    }
  }, [conversationState, detectedSymptoms, confirmedSymptoms]);

  // Process detected symptoms and ask questions about them
  const handleDetectedSymptoms = () => {
    if (detectedSymptoms.length > 0) {
      const nextSymptom = detectedSymptoms[0];
      console.log('Handling next symptom:', nextSymptom);
      
      // Show message about which disorder we're discussing (if not already asked about)
      if (!askedDisorders.includes(nextSymptom.disorder)) {
        setAskedDisorders(prev => [...prev, nextSymptom.disorder]);
        
        const aiMessage = {
          text: `I notice you might be experiencing symptoms related to ${nextSymptom.disorder}. Let me ask a few questions to understand better.`,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        setTimeout(() => {
          askQuestionAboutSymptom(nextSymptom);
        }, 800);
      } else {
        // Just ask about the next symptom directly
        askQuestionAboutSymptom(nextSymptom);
      }
    } else {
      // If no more symptoms to check, provide summary
      setConversationState('summarizing');
    }
  };

  // Ask a question about a specific symptom
  const askQuestionAboutSymptom = (symptom: DetectedSymptom) => {
    const questions = getQuestionsForSymptom(symptom.disorder, symptom.name);
    
    if (questions.length > 0) {
      setCurrentSymptom(symptom);
      setQuestionIndex(0);
      setYesCount(0);
      
      const questionMessage = {
        text: questions[0],
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setConversationState('questioning');
    } else {
      // If no questions, remove from queue and move to next symptom
      setDetectedSymptoms(prev => prev.filter((_, i) => i !== 0));
      handleDetectedSymptoms();
    }
  };

  // Process next question in the sequence for current symptom
  const processNextQuestion = () => {
    if (!currentSymptom) return;
    
    const questions = getQuestionsForSymptom(currentSymptom.disorder, currentSymptom.name);
    
    if (yesCount >= 2 || questionIndex === questions.length - 1) {
      // Symptom is confirmed if 2+ yes answers or we reached the end of questions
      if (yesCount >= 2) {
        console.log('Symptom confirmed:', currentSymptom.name);
        setConfirmedSymptoms(prev => [...prev, {...currentSymptom, confirmed: true}]);
        
        const confirmMessage = {
          text: `I understand you're experiencing ${currentSymptom.name.toLowerCase()}.`,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, confirmMessage]);
      }
      
      // Remove this symptom from the queue
      setDetectedSymptoms(prev => prev.filter((_, i) => i !== 0));
      
      // Check if we have more symptoms to discuss or if we should summarize
      setTimeout(() => {
        if (detectedSymptoms.length > 0) {
          setConversationState('detecting');
        } else {
          setConversationState('summarizing');
        }
      }, 800);
    } else {
      // Ask next question for current symptom
      setQuestionIndex(prev => prev + 1);
      
      const nextQuestion = {
        text: questions[questionIndex + 1],
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, nextQuestion]);
    }
  };

  // Provide summary and recommendations based on confirmed symptoms
  const provideSummaryAndRecommendations = () => {
    if (confirmedSymptoms.length > 0) {
      // Create summary message
      const summaryText = `Thank you for sharing. Based on our conversation, I've noticed these symptoms:\n\n${
        confirmedSymptoms.map(s => `• ${s.name} (related to ${s.disorder})`).join('\n')
      }\n\nRemember this isn't a diagnosis. If these symptoms are affecting your daily life, I encourage you to speak with a mental health professional.`;
      
      const summaryMessage = {
        text: summaryText,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, summaryMessage]);
      
      // Add follow-up question to continue the conversation
      setTimeout(() => {
        const followUpMessage = {
          text: "Is there anything specific about these feelings you'd like to discuss further?",
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, followUpMessage]);
      }, 1500);
    } else {
      const noSymptomsMessage = {
        text: "Thanks for sharing how you're feeling. I haven't identified specific symptoms that match our patterns, but your feelings are valid. Would you like to tell me more about what's on your mind?",
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, noSymptomsMessage]);
    }
    
    // Reset conversation state to initial after summary
    setConversationState('initial');
  };

  // Handle sending a message
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' as const, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    if (conversationState === 'questioning' && currentSymptom) {
      // We're in the middle of questionnaire flow
      const isYes = input.toLowerCase().includes('yes') || 
                    input.toLowerCase().includes('yeah') || 
                    input.toLowerCase().includes('correct') ||
                    input.toLowerCase().includes('true') ||
                    input.toLowerCase().includes('i do');
                    
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
        console.log('Detected symptoms:', detectedSyms);
        setDetectedSymptoms(detectedSyms);
        
        // Acknowledge detected symptoms with a more empathetic response
        const detectionMessage = {
          text: `I hear that you're going through a difficult time. I'd like to understand better how you're feeling.`,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, detectionMessage]);
          setConversationState('detecting');
        }, 800);
      } else {
        // No symptoms detected, respond with an open-ended question
        const aiMessage = {
          text: "Thank you for sharing. Could you tell me more about what's been on your mind lately? I'm here to listen.",
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

  // Add emoji to the input field
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
