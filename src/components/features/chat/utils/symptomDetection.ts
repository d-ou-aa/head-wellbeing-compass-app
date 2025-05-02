
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from '../types';

// Process detected symptoms and ask questions about them
export const handleDetectedSymptoms = (
  detectedSymptoms: DetectedSymptom[],
  askedDisorders: string[],
  setAskedDisorders: React.Dispatch<React.SetStateAction<string[]>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
) => {
  if (detectedSymptoms.length > 0) {
    const nextSymptom = detectedSymptoms[0];
    console.log('Handling next symptom:', nextSymptom);
    
    // Show typing indicator first
    setMessages(prev => [...prev, { 
      text: '...', 
      sender: 'ai' as const, 
      timestamp: new Date(),
      isTyping: true 
    }]);
    
    // Add a random delay (1-3 seconds) to simulate thoughtful therapist response
    const delay = Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Show message about which disorder we're discussing (if not already asked about)
      if (!askedDisorders.includes(nextSymptom.disorder)) {
        setAskedDisorders(prev => [...prev, nextSymptom.disorder]);
        
        const aiMessage = {
          text: `I notice some of what you're describing sounds like it might be related to ${nextSymptom.disorder}. If you're comfortable, I'd like to ask you a few more questions about your experience.`,
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Add delay before asking the first question
        setTimeout(() => {
          askQuestionAboutSymptom(
            nextSymptom,
            setMessages,
            setConversationState
          );
        }, 1500);
      } else {
        // Just ask about the next symptom directly
        askQuestionAboutSymptom(
          nextSymptom,
          setMessages,
          setConversationState
        );
      }
    }, delay);
  } else {
    // If no more symptoms to check, provide summary
    // Add typing indicator
    setMessages(prev => [...prev, { 
      text: '...', 
      sender: 'ai' as const, 
      timestamp: new Date(),
      isTyping: true 
    }]);
    
    // Delay before providing summary
    setTimeout(() => {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      setConversationState('summarizing');
    }, 1500);
  }
};

// Ask a question about a specific symptom
export const askQuestionAboutSymptom = (
  symptom: DetectedSymptom,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
) => {
  const { getQuestionsForSymptom } = require('@/services/mentalHealthService');
  const questions = getQuestionsForSymptom(symptom.disorder, symptom.name);
  
  if (questions.length > 0) {
    // Add a more empathetic preamble to the first question
    const questionText = `${questions[0]} Please take your time to answer.`;
    
    const questionMessage = {
      text: questionText,
      sender: 'ai' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, questionMessage]);
    setConversationState('questioning');
  } else {
    // Move to next symptom
    setConversationState('detecting');
  }
};

