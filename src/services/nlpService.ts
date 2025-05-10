
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
  source?: 'text' | 'voice';
};

// Analyze message using Python NLP service
export const analyzeMessage = async (text: string, source: 'text' | 'voice' = 'text'): Promise<NLPAnalysisResult> => {
  try {
    console.log(`Analyzing ${source} message:`, text);
    
    // In a real application, this would call the Python NLP service
    // For now, we'll simulate the response with enhanced speech recognition
    const mockResponse: NLPAnalysisResult = {
      detectedSymptoms: detectSimulatedSymptoms(text),
      sentiment: determineSentiment(text),
      topics: ['mental health', 'emotions'],
      entities: [],
      suggestedResponses: [],
      language: 'en',
      source: source
    };
    
    // If voice source, give higher confidence to detected symptoms
    if (source === 'voice') {
      mockResponse.detectedSymptoms = mockResponse.detectedSymptoms.map(symptom => ({
        ...symptom,
        confidence: Math.min(symptom.confidence + 0.12, 0.98) // Increase confidence for voice inputs
      }));
    }
    
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
    const symptoms = analysis.detectedSymptoms.map(s => s.name).join(' and ');
    
    if (analysis.source === 'voice') {
      responseText = `I heard you mention feelings related to ${symptoms}. Would you like to talk more about that?`;
    } else {
      responseText = `I notice you mentioned some feelings that might be related to ${symptoms}. Would you like to talk more about that?`;
    }
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

// Helper function to detect symptoms from text (enhanced for better detection)
function detectSimulatedSymptoms(text: string) {
  const symptoms = [];
  const lowerText = text.toLowerCase();
  
  // Enhanced symptom detection patterns
  const patterns = [
    {
      name: 'anxiety',
      keywords: ['anxious', 'anxiety', 'worry', 'worried', 'nervous', 'panic', 'fear', 'afraid'],
      confidence: 0.85
    },
    {
      name: 'depression',
      keywords: ['sad', 'depress', 'unhappy', 'hopeless', 'empty', 'meaningless', 'unmotivated'],
      confidence: 0.82
    },
    {
      name: 'stress',
      keywords: ['stress', 'overwhelm', 'pressure', 'burden', 'exhausted', 'burnout', 'tired'],
      confidence: 0.88
    },
    {
      name: 'insomnia',
      keywords: ['sleep', 'insomnia', 'awake', 'cannot sleep', "can't sleep", 'restless', 'tired'],
      confidence: 0.75
    },
    {
      name: 'ptsd',
      keywords: ['trauma', 'flashback', 'nightmare', 'ptsd', 'traumatic', 'event', 'trigger'],
      confidence: 0.90
    }
  ];
  
  patterns.forEach(pattern => {
    for (const keyword of pattern.keywords) {
      if (lowerText.includes(keyword)) {
        symptoms.push({ 
          name: pattern.name, 
          confidence: pattern.confidence 
        });
        break; // Only add each symptom once
      }
    }
  });
  
  return symptoms;
}

// Enhanced sentiment analysis function
function determineSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lowerText = text.toLowerCase();
  
  const positiveWords = [
    'happy', 'good', 'great', 'better', 'well', 'joy', 'excited', 
    'wonderful', 'fantastic', 'pleased', 'delighted', 'content', 'satisfied',
    'enjoyable', 'fun', 'enthusiastic', 'optimistic', 'proud'
  ];
  
  const negativeWords = [
    'sad', 'bad', 'awful', 'terrible', 'worried', 'anxious', 'depressed',
    'upset', 'miserable', 'unhappy', 'disappointed', 'frustrated', 'angry',
    'hurt', 'broken', 'lost', 'alone', 'hopeless', 'fear', 'scared',
    'stress', 'stressed', 'overwhelmed', 'exhausted', 'tired'
  ];
  
  // Count positive and negative word matches with weighting
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore += 1;
    // Check for intensifiers
    if (lowerText.includes(`very ${word}`) || lowerText.includes(`really ${word}`)) {
      positiveScore += 0.5;
    }
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore += 1;
    // Check for intensifiers
    if (lowerText.includes(`very ${word}`) || lowerText.includes(`really ${word}`)) {
      negativeScore += 0.5;
    }
  });
  
  // Check for negations that flip sentiment
  const negations = ['not', "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't"];
  negations.forEach(negation => {
    // Find all occurrences of negation
    let startPos = 0;
    while ((startPos = lowerText.indexOf(negation, startPos)) !== -1) {
      // Check if a positive word follows the negation within 3 words
      const followingText = lowerText.slice(startPos + negation.length, startPos + negation.length + 30);
      const followingWords = followingText.split(/\s+/).slice(0, 3);
      
      followingWords.forEach(word => {
        if (positiveWords.includes(word.replace(/[^a-z]/g, ''))) {
          positiveScore -= 1;
          negativeScore += 0.5;
        }
        if (negativeWords.includes(word.replace(/[^a-z]/g, ''))) {
          negativeScore -= 1;
          positiveScore += 0.5;
        }
      });
      
      startPos += negation.length;
    }
  });
  
  // Determine sentiment based on scores
  if (positiveScore > negativeScore + 0.5) return 'positive';
  if (negativeScore > positiveScore + 0.5) return 'negative';
  return 'neutral';
}
