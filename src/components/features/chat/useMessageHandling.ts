
import { detectSymptoms, getAffirmationsForSymptom } from '@/services/mentalHealthService';
import { getRecommendedTherapies, generateTherapeuticResponse } from '@/services/knowledgeGraphService';
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from './types';
import { toast } from '@/components/ui/use-toast';

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
    processNextQuestion: () => void,
    confirmedSymptoms: DetectedSymptom[]
  ) => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' as const, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setMessages(prev => [...prev, { 
      text: '...', 
      sender: 'ai' as const, 
      timestamp: new Date(),
      isTyping: true 
    }]);
    
    // Add a randomized delay to simulate thoughtful response time (between 1-3 seconds)
    const delay = Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      // Process the message after delay
      if (conversationState === 'questioning' && currentSymptom) {
        // Remove typing indicator first
        setMessages(prev => prev.filter(msg => !msg.isTyping));
        
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
            const affirmationIndex = Math.floor(Math.random() * affirmations.length); 
            const affirmationMessage = {
              text: affirmations[affirmationIndex],
              sender: 'ai' as const,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, affirmationMessage]);
            
            // Add a small additional delay before the next question
            setTimeout(() => {
              processNextQuestion();
            }, 800);
          } else {
            processNextQuestion();
          }
        } else {
          // Add an acknowledgment response for "no" answers too
          const acknowledgeMessage = {
            text: `I understand. Let me ask you something else to get a better picture of what you're experiencing.`,
            sender: 'ai' as const,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, acknowledgeMessage]);
          
          // Small delay before next question
          setTimeout(() => {
            processNextQuestion();
          }, 800);
        }
      } else {
        // Initial input processing - detect symptoms
        const detectedSyms = detectSymptoms(input);
        
        // Remove typing indicator
        setMessages(prev => prev.filter(msg => !msg.isTyping));
        
        if (detectedSyms.length > 0) {
          console.log('Detected symptoms:', detectedSyms);
          setDetectedSymptoms(detectedSyms);
          
          // Use knowledge graph to generate a more personalized and flexible response
          const symptomNames = detectedSyms.map(s => s.name);
          const confirmedDisorderNames = confirmedSymptoms.map(s => s.disorder);
          const therapeuticResponse = generateTherapeuticResponse(
            symptomNames, 
            confirmedDisorderNames,
            'exploring'
          );
          
          // Acknowledge detected symptoms with a more therapeutic response
          const detectionMessage = {
            text: therapeuticResponse,
            sender: 'ai' as const,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, detectionMessage]);
          
          // Add a brief pause before changing state to make conversation feel more natural
          setTimeout(() => {
            setConversationState('detecting');
          }, 800);
        } else {
          // No symptoms detected, respond with an open-ended therapeutic question
          const aiMessage = {
            text: generateTherapeuticResponse([], [], 'initial'),
            sender: 'ai' as const,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
        }
      }
    }, delay);
    
    setInput('');
  };

  return { handleSend };
}
