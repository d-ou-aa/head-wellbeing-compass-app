
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from './types';
import { toast } from '@/components/ui/use-toast';
import { analyzeMessage } from '@/services/nlpService';
import { processNLPResults } from '@/services/symptomService';

export function useSymptomHandling() {
  // Handle detected symptoms based on NLP analysis
  const handleDetectedSymptoms = async (
    userMessage: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setDetectedSymptoms: React.Dispatch<React.SetStateAction<DetectedSymptom[]>>,
    setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
  ) => {
    try {
      // First show a typing indicator
      setMessages(prev => [...prev, { 
        text: '...', 
        sender: 'ai', 
        timestamp: new Date(),
        isTyping: true 
      }]);
      
      // Process the message through our Python NLP service
      const analysis = await analyzeMessage(userMessage);
      console.log("NLP Analysis results:", analysis);
      
      // Process the NLP results to extract symptoms
      const { detectedSymptoms, responseText } = processNLPResults(analysis);
      
      // Remove typing indicator and show response
      setMessages(prev => {
        const messagesWithoutTyping = prev.filter(msg => !msg.isTyping);
        return [...messagesWithoutTyping, {
          text: responseText,
          sender: 'ai',
          timestamp: new Date()
        }];
      });
      
      // Update detected symptoms
      if (detectedSymptoms.length > 0) {
        setDetectedSymptoms(detectedSymptoms);
        setConversationState('questioning');
      }
      
    } catch (error) {
      console.error("Error in symptom handling:", error);
      toast({
        title: "Error analyzing message",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  // Ask focused questions about a specific symptom
  const askQuestionAboutSymptom = (
    symptom: DetectedSymptom,
    questionIndex: number,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    // Get appropriate question based on the symptom and question index
    const questions = getQuestionsForSymptom(symptom.name);
    const question = questions[questionIndex] || "Can you tell me more about how you're feeling?";
    
    // Add the question to messages
    setMessages(prev => [...prev, {
      text: question,
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  // Process user's answer and determine next question
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
    
    const questions = getQuestionsForSymptom(currentSymptom.name);
    
    // If we've asked all questions for this symptom
    if (questionIndex >= questions.length - 1) {
      // If user confirmed enough symptoms, add to confirmed
      if (yesCount >= 2) {
        setConfirmedSymptoms(prev => [...prev, currentSymptom]);
      }
      
      // Move to next symptom or summarize
      const remainingSymptoms = detectedSymptoms.filter(s => s.name !== currentSymptom.name);
      setDetectedSymptoms(remainingSymptoms);
      
      if (remainingSymptoms.length === 0) {
        setConversationState('summarizing');
      } else {
        // Reset for next symptom
        setQuestionIndex(0);
      }
    } else {
      // Ask next question
      setQuestionIndex(prev => prev + 1);
      askQuestionAboutSymptom(currentSymptom, questionIndex + 1, setMessages);
    }
  };

  // Provide summary and recommendations based on confirmed symptoms
  const provideSummaryAndRecommendations = (
    confirmedSymptoms: DetectedSymptom[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setConversationState: React.Dispatch<React.SetStateAction<'initial' | 'detecting' | 'questioning' | 'summarizing'>>
  ) => {
    // If no symptoms were confirmed
    if (confirmedSymptoms.length === 0) {
      setMessages(prev => [...prev, {
        text: "Based on our conversation, I don't have enough information to identify specific concerns. Would you like to tell me more about what you're experiencing?",
        sender: 'ai',
        timestamp: new Date()
      }]);
      setConversationState('initial');
      return;
    }
    
    // Generate summary based on confirmed symptoms
    const summary = generateSummary(confirmedSymptoms);
    
    // Add summary to messages
    setMessages(prev => [...prev, {
      text: summary,
      sender: 'ai',
      timestamp: new Date()
    }]);
    
    // Reset conversation state
    setConversationState('initial');
  };
  
  // Helper function to get questions for a symptom
  const getQuestionsForSymptom = (symptomName: string): string[] => {
    const questionSets: Record<string, string[]> = {
      'anxiety': [
        'Have you been feeling more worried or anxious than usual?',
        'Have you experienced physical symptoms like rapid heartbeat, sweating, or shortness of breath?',
        'Are your worries affecting your daily activities or relationships?'
      ],
      'depression': [
        'Have you been feeling sad or down for most of the day, nearly every day?',
        'Have you lost interest in activities you used to enjoy?',
        'Have you noticed changes in your sleep or appetite?'
      ],
      'stress': [
        'Are you feeling overwhelmed by your responsibilities?',
        'Have you noticed tension in your body, like headaches or muscle tightness?',
        'Are you having trouble relaxing or switching off?'
      ],
      'insomnia': [
        'Are you having trouble falling asleep or staying asleep?',
        'Do you feel tired even after sleeping?',
        'Has poor sleep affected your mood or functioning during the day?'
      ],
      // Default questions for any symptom
      'default': [
        'Can you tell me more about when you started feeling this way?',
        'How has this been affecting your daily life?',
        'Have you spoken to anyone else about this?'
      ]
    };
    
    return questionSets[symptomName.toLowerCase()] || questionSets['default'];
  };
  
  // Helper function to generate summary and recommendations
  const generateSummary = (confirmedSymptoms: DetectedSymptom[]): string => {
    const symptomNames = confirmedSymptoms.map(s => s.name.toLowerCase());
    
    let summary = "Based on our conversation, I've noticed some patterns that might be worth discussing. ";
    
    // Add symptom-specific text
    if (symptomNames.includes('anxiety')) {
      summary += "You seem to be experiencing symptoms of anxiety, such as excessive worry and physical tension. ";
    }
    
    if (symptomNames.includes('depression')) {
      summary += "You're showing signs of depression, including persistent sadness and loss of interest in activities. ";
    }
    
    if (symptomNames.includes('stress')) {
      summary += "You appear to be dealing with significant stress that's affecting your wellbeing. ";
    }
    
    if (symptomNames.includes('insomnia')) {
      summary += "You're having sleep difficulties that are impacting how you feel during the day. ";
    }
    
    // Add general recommendations
    summary += "\n\nHere are some suggestions that might help:\n\n";
    
    if (symptomNames.includes('anxiety') || symptomNames.includes('stress')) {
      summary += "• Try deep breathing exercises or progressive muscle relaxation to reduce physical tension.\n";
      summary += "• Consider limiting caffeine and practicing mindfulness meditation daily.\n";
    }
    
    if (symptomNames.includes('depression')) {
      summary += "• Make time for activities you used to enjoy, even if they don't seem appealing right now.\n";
      summary += "• Try to maintain social connections and regular physical activity.\n";
    }
    
    if (symptomNames.includes('insomnia')) {
      summary += "• Establish a regular sleep schedule and create a relaxing bedtime routine.\n";
      summary += "• Avoid screens at least an hour before bed and limit daytime napping.\n";
    }
    
    // Add universal recommendations
    summary += "• Consider speaking with a healthcare professional for personalized guidance.\n";
    summary += "• Practice self-care by ensuring you're eating well, staying hydrated, and getting regular exercise.\n\n";
    
    summary += "Remember, these are just suggestions based on our conversation. How does this sound to you?";
    
    return summary;
  };

  return {
    handleDetectedSymptoms,
    askQuestionAboutSymptom,
    processNextQuestion,
    provideSummaryAndRecommendations
  };
}
