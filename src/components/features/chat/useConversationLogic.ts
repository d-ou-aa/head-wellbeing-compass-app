
import { useState, useEffect } from 'react';
import { detectSymptoms, getQuestionsForSymptom, getAffirmationsForSymptom } from '@/services/mentalHealthService';
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
