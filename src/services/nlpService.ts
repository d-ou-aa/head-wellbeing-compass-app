
// API service for natural language processing
import { toast } from '@/components/ui/use-toast';

export type NLPAnalysisResult = {
  detectedSymptoms: Array<{
    name: string;
    confidence: number;
  }>;
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  entities: Array<{
    text: string;
    type: string;
  }>;
  suggestedResponses: string[];
  language: string;
};

// Analyze message using Python NLP service
export const analyzeMessage = async (text: string): Promise<NLPAnalysisResult> => {
  try {
    console.log('Analyzing message:', text);
    
    // In a real application, this would call the Python NLP service
    // For now, we'll simulate the response
    const mockResponse: NLPAnalysisResult = {
      detectedSymptoms: detectSimulatedSymptoms(text),
      sentiment: determineSentiment(text),
      topics: ['mental health', 'emotions'],
      entities: [],
      suggestedResponses: [],
      language: 'en'
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Error analyzing message:', error);
    toast({
      title: 'Analysis Error',
      description: 'Failed to analyze your message. Please try again.',
      variant: 'destructive'
    });
    throw error;
  }
};

// Generate AI response based on analysis
export const generateResponse = (analysis: NLPAnalysisResult): { text: string; sender: 'ai'; timestamp: Date } => {
  // Generate appropriate response based on analysis
  let responseText = '';
  
  if (analysis.detectedSymptoms.length > 0) {
    responseText = "I notice you mentioned some feelings that might be worth exploring. Would you like to talk more about that?";
  } else if (analysis.sentiment === 'negative') {
    responseText = "It sounds like you're going through a challenging time. Would you like to share more about what's been happening?";
  } else if (analysis.sentiment === 'positive') {
    responseText = "I'm glad to hear you're doing well! Is there anything specific you'd like to discuss today?";
  } else {
    responseText = "Thank you for sharing. How else can I support you today?";
  }
  
  return {
    text: responseText,
    sender: 'ai',
    timestamp: new Date()
  };
};

// Helper function to detect symptoms from text (simplified simulation)
function detectSimulatedSymptoms(text: string) {
  const symptoms = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('nervous')) {
    symptoms.push({ name: 'anxiety', confidence: 0.85 });
  }
  
  if (lowerText.includes('sad') || lowerText.includes('depress') || lowerText.includes('unhappy')) {
    symptoms.push({ name: 'depression', confidence: 0.82 });
  }
  
  if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('pressure')) {
    symptoms.push({ name: 'stress', confidence: 0.88 });
  }
  
  if (lowerText.includes('sleep') || lowerText.includes('insomnia') || lowerText.includes('awake')) {
    symptoms.push({ name: 'insomnia', confidence: 0.75 });
  }
  
  return symptoms;
}

// Helper function to determine sentiment (simplified)
function determineSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lowerText = text.toLowerCase();
  const positiveWords = ['happy', 'good', 'great', 'better', 'well', 'joy'];
  const negativeWords = ['sad', 'bad', 'awful', 'terrible', 'worried', 'anxious', 'depressed'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}
