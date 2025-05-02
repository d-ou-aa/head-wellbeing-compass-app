
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from '../types';
import { getRecommendedTherapies } from '@/services/knowledgeGraphService';

// Provide summary and recommendations based on confirmed symptoms
export const provideSummaryAndRecommendations = (
  confirmedSymptoms: DetectedSymptom[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
) => {
  // Show typing indicator first
  setMessages(prev => [...prev, { 
    text: '...', 
    sender: 'ai' as const, 
    timestamp: new Date(),
    isTyping: true 
  }]);
  
  // Add a longer delay here (3-5 seconds) to simulate the therapist organizing their thoughts for summary
  const delay = Math.floor(Math.random() * 2000) + 3000;
  
  setTimeout(() => {
    // Remove typing indicator
    setMessages(prev => prev.filter(msg => !msg.isTyping));
    
    if (confirmedSymptoms.length > 0) {
      // Create summary message with therapy recommendations in therapist-like language
      let summaryText = `Thank you for sharing your experiences with me today. Based on our conversation, I've noticed you're experiencing these symptoms:\n\n`;
      
      // Group symptoms by disorder
      const disorderGroups: Record<string, string[]> = {};
      confirmedSymptoms.forEach(s => {
        if (!disorderGroups[s.disorder]) {
          disorderGroups[s.disorder] = [];
        }
        disorderGroups[s.disorder].push(s.name);
      });
      
      // List symptoms by disorder with more empathetic framing
      Object.entries(disorderGroups).forEach(([disorder, symptoms]) => {
        summaryText += `**${disorder}**-related experiences:\n${symptoms.map(s => `• ${s}`).join('\n')}\n\n`;
      });
      
      // Add therapy recommendations with more empathetic framing
      summaryText += "**Approaches that might be helpful**:\n";
      const addedTherapies = new Set<string>();
      
      confirmedSymptoms.forEach(s => {
        const therapies = getRecommendedTherapies(s.disorder);
        therapies.forEach(therapy => {
          if (!addedTherapies.has(therapy.name)) {
            addedTherapies.add(therapy.name);
            summaryText += `• ${therapy.label} - this could help with understanding and managing your experiences\n`;
          }
        });
      });
      
      summaryText += "\nI want to emphasize that this conversation isn't a diagnosis. These are just patterns I've noticed that might be worth exploring with a mental health professional who can provide personalized guidance.";
      
      const summaryMessage = {
        text: summaryText,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, summaryMessage]);
      
      // Add follow-up question after a delay
      setTimeout(() => {
        // Show typing indicator
        setMessages(prev => [...prev, { 
          text: '...', 
          sender: 'ai' as const, 
          timestamp: new Date(),
          isTyping: true 
        }]);
        
        setTimeout(() => {
          // Remove typing indicator
          setMessages(prev => prev.filter(msg => !msg.isTyping));
          
          const followUpMessage = {
            text: "How do you feel about what we've discussed? Is there a particular aspect of these experiences you'd like to explore further?",
            sender: 'ai' as const,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, followUpMessage]);
        }, 1500);
      }, 2000);
    } else {
      const noSymptomsMessage = {
        text: "Thank you for sharing how you're feeling. While I haven't identified specific patterns that match common symptoms, your experiences are absolutely valid. Sometimes our feelings don't fit neatly into categories, and that's completely normal. Would you like to tell me more about what's been on your mind lately?",
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, noSymptomsMessage]);
    }
    
    // Reset conversation state to initial after summary
    setConversationState('initial');
  }, delay);
};
