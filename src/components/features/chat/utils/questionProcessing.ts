
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from '../types';

// Process next question in the sequence for current symptom
export const processNextQuestion = (
  currentSymptom: DetectedSymptom | null,
  questionIndex: number,
  yesCount: number,
  detectedSymptoms: DetectedSymptom[],
  setQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setConfirmedSymptoms: React.Dispatch<React.SetStateAction<DetectedSymptom[]>>,
  setDetectedSymptoms: React.Dispatch<React.SetStateAction<DetectedSymptom[]>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
) => {
  if (!currentSymptom) return;
  
  const { getQuestionsForSymptom } = require('@/services/mentalHealthService');
  const questions = getQuestionsForSymptom(currentSymptom.disorder, currentSymptom.name);
  
  // Show typing indicator first
  setMessages(prev => [...prev, { 
    text: '...', 
    sender: 'ai' as const, 
    timestamp: new Date(),
    isTyping: true 
  }]);
  
  // Add a random delay (1-2 seconds) to simulate thoughtful therapist response
  const delay = Math.floor(Math.random() * 1000) + 1000;
  
  setTimeout(() => {
    // Remove typing indicator
    setMessages(prev => prev.filter(msg => !msg.isTyping));
    
    if (yesCount >= 2 || questionIndex === questions.length - 1) {
      // Symptom is confirmed if 2+ yes answers or we reached the end of questions
      if (yesCount >= 2) {
        console.log('Symptom confirmed:', currentSymptom.name);
        setConfirmedSymptoms(prev => [...prev, {...currentSymptom, confirmed: true}]);
        
        const confirmMessage = {
          text: `Thank you for sharing. What you're describing about ${currentSymptom.name.toLowerCase()} helps me understand what you're going through.`,
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
      }, 1000);
    } else {
      // Ask next question for current symptom
      setQuestionIndex(prev => prev + 1);
      
      // Add a transition phrase before the next question
      const transitionPhrases = [
        "I appreciate your openness. Let me ask another question.",
        "Thank you for sharing that. I'd like to understand more.",
        "That's helpful to know. Could you also tell me,"
      ];
      
      const transitionPhrase = transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)];
      const nextQuestionText = `${transitionPhrase} ${questions[questionIndex + 1]}`;
      
      const nextQuestion = {
        text: nextQuestionText,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, nextQuestion]);
    }
  }, delay);
};
