
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
  const askQuestionAboutSymptom = (
    symptom: DetectedSymptom,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
  ) => {
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

  // Provide summary and recommendations based on confirmed symptoms
  const provideSummaryAndRecommendations = (
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

  return {
    handleDetectedSymptoms,
    askQuestionAboutSymptom,
    processNextQuestion,
    provideSummaryAndRecommendations
  };
}
