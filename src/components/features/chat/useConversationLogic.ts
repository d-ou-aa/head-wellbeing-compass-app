
import { useState, useEffect } from 'react';
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from './types';
import { toast } from '@/components/ui/use-toast';

export function useConversationLogic() {
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

  // Update currentSymptom when detectedSymptoms change
  useEffect(() => {
    if (detectedSymptoms.length > 0) {
      setCurrentSymptom(detectedSymptoms[0]);
    } else {
      setCurrentSymptom(null);
    }
  }, [detectedSymptoms]);

  // Reset question state when currentSymptom changes
  useEffect(() => {
    setQuestionIndex(0);
    setYesCount(0);
  }, [currentSymptom]);

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

  // Add emoji to the input field
  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    currentSymptom,
    detectedSymptoms,
    setDetectedSymptoms,
    confirmedSymptoms,
    setConfirmedSymptoms,
    questionIndex,
    setQuestionIndex,
    yesCount,
    setYesCount,
    askedDisorders,
    setAskedDisorders,
    conversationState,
    setConversationState,
    resetConversation,
    addEmoji
  };
}
