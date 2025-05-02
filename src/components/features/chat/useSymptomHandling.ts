
import { getQuestionsForSymptom, getAffirmationsForSymptom } from '@/services/mentalHealthService';
import { getRecommendedTherapies } from '@/services/knowledgeGraphService';
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from './types';

export function useSymptomHandling() {
  // Process detected symptoms and ask questions about them
  const handleDetectedSymptoms = (
    detectedSymptoms: DetectedSymptom[],
    askedDisorders: string[],
    setAskedDisorders: React.Dispatch<React.SetStateAction<string[]>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
  ) => {
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
          askQuestionAboutSymptom(
            nextSymptom,
            setMessages,
            setConversationState
          );
        }, 800);
      } else {
        // Just ask about the next symptom directly
        askQuestionAboutSymptom(
          nextSymptom,
          setMessages,
          setConversationState
        );
      }
    } else {
      // If no more symptoms to check, provide summary
      setConversationState('summarizing');
    }
  };

  // Ask a question about a specific symptom
  const askQuestionAboutSymptom = (
    symptom: DetectedSymptom,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
  ) => {
    const questions = getQuestionsForSymptom(symptom.disorder, symptom.name);
    
    if (questions.length > 0) {
      const questionMessage = {
        text: questions[0],
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

  // Process next question in the sequence for current symptom
  const processNextQuestion = (
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
  const provideSummaryAndRecommendations = (
    confirmedSymptoms: DetectedSymptom[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
  ) => {
    if (confirmedSymptoms.length > 0) {
      // Create summary message with therapy recommendations
      let summaryText = `Thank you for sharing. Based on our conversation, I've noticed these symptoms:\n\n`;
      
      // Group symptoms by disorder
      const disorderGroups: Record<string, string[]> = {};
      confirmedSymptoms.forEach(s => {
        if (!disorderGroups[s.disorder]) {
          disorderGroups[s.disorder] = [];
        }
        disorderGroups[s.disorder].push(s.name);
      });
      
      // List symptoms by disorder
      Object.entries(disorderGroups).forEach(([disorder, symptoms]) => {
        summaryText += `**${disorder}**:\n${symptoms.map(s => `• ${s}`).join('\n')}\n\n`;
      });
      
      // Add therapy recommendations
      summaryText += "**Potentially helpful approaches**:\n";
      const addedTherapies = new Set<string>();
      
      confirmedSymptoms.forEach(s => {
        const therapies = getRecommendedTherapies(s.disorder);
        therapies.forEach(therapy => {
          if (!addedTherapies.has(therapy.name)) {
            addedTherapies.add(therapy.name);
            summaryText += `• ${therapy.label}\n`;
          }
        });
      });
      
      summaryText += "\nRemember this isn't a diagnosis. If these symptoms are affecting your daily life, I encourage you to speak with a mental health professional.";
      
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

  return {
    handleDetectedSymptoms,
    askQuestionAboutSymptom,
    processNextQuestion,
    provideSummaryAndRecommendations
  };
}
