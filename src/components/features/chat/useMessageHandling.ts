
import { detectSymptoms, getAffirmationsForSymptom } from '@/services/mentalHealthService';
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from './types';

export function useMessageHandling() {
  // Handle sending a message
  const handleSend = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    conversationState: 'initial' | 'detecting' | 'questioning' | 'summarizing',
    currentSymptom: DetectedSymptom | null,
    setDetectedSymptoms: React.Dispatch<React.SetStateAction<DetectedSymptom[]>>,
    setYesCount: React.Dispatch<React.SetStateAction<number>>,
    setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>,
    processNextQuestion: () => void
  ) => {
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
          const affirmationIndex = 0; // Use first affirmation for simplicity
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

  return { handleSend };
}
