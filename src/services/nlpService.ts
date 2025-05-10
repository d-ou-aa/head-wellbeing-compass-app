import { Message } from '@/components/features/chat/types';

interface NLPResponse {
  sentiment: {
    sentiment: string;
    intensity: number;
    scores: Record<string, number>;
  };
  detected_symptoms: Array<{
    symptom: string;
    disorder: string;
    confidence: {
      overall_confidence: number;
      semantic_similarity: number;
      fuzzy_match: number;
      sentiment_intensity: number;
    };
  }>;
  severity_assessment?: {
    level: string;
    score: number;
    description: Record<string, string>;
  };
  confidence_scores: {
    max_confidence: number;
  };
}

// const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeMessage(message: string): Promise<NLPResponse> {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Failed to analyze message: ${response.status} ${response.statusText}${errorData ? ` - ${errorData}` : ''}`
      );
    }

    const data: unknown = await response.json();
    
    // Validate response structure with detailed checks
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: Expected an object');
    }

    const typedData = data as any;

    if (!typedData.sentiment || 
        typeof typedData.sentiment.sentiment !== 'string' || 
        typeof typedData.sentiment.intensity !== 'number' || 
        !typedData.sentiment.scores || 
        typeof typedData.sentiment.scores !== 'object') {
      throw new Error('Invalid response: Missing or invalid sentiment data');
    }

    if (!Array.isArray(typedData.detected_symptoms)) {
      throw new Error('Invalid response: detected_symptoms must be an array');
    }

    // Validate each symptom in the array
    for (const symptom of typedData.detected_symptoms) {
      if (!symptom || typeof symptom !== 'object' ||
          typeof symptom.symptom !== 'string' ||
          typeof symptom.disorder !== 'string' ||
          !symptom.confidence || typeof symptom.confidence !== 'object' ||
          typeof symptom.confidence.overall_confidence !== 'number' ||
          typeof symptom.confidence.semantic_similarity !== 'number' ||
          typeof symptom.confidence.fuzzy_match !== 'number' ||
          typeof symptom.confidence.sentiment_intensity !== 'number') {
        throw new Error('Invalid response: Invalid symptom data structure');
      }
    }

    if (typedData.severity_assessment && (
        typeof typedData.severity_assessment !== 'object' ||
        typeof typedData.severity_assessment.level !== 'string' ||
        typeof typedData.severity_assessment.score !== 'number' ||
        typeof typedData.severity_assessment.description !== 'object'
    )) {
      throw new Error('Invalid response: Invalid severity assessment data');
    }

    if (!typedData.confidence_scores || 
        typeof typedData.confidence_scores !== 'object' || 
        typeof typedData.confidence_scores.max_confidence !== 'number') {
      throw new Error('Invalid response: Missing or invalid confidence scores');
    }

    return typedData as NLPResponse;
  } catch (error) {
    console.error('Error analyzing message:', error);
    if (error instanceof TypeError) {
      throw new Error('Network error: Please check your connection');
    }
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}

export function generateResponse(analysis: NLPResponse): Message {
  let responseText = '';

  try {
    // Add empathetic opening based on sentiment
    if (analysis.sentiment?.sentiment === 'negative') {
      if (analysis.sentiment.intensity > 0.7) {
        responseText += "I can hear how much pain you're in right now. It takes courage to share these feelings. ";
      } else if (analysis.sentiment.intensity > 0.4) {
        responseText += "I can sense that you're going through a difficult time. Thank you for trusting me with your feelings. ";
      } else {
        responseText += "I notice that things might be challenging for you right now. ";
      }
    }

    // Add contextual response based on symptoms
    if (analysis.detected_symptoms?.length > 0) {
      const topSymptom = analysis.detected_symptoms[0];
      
      if (topSymptom?.symptom) {
        // Customize response based on severity
        if (analysis.severity_assessment?.level === 'severe') {
          responseText += `I'm concerned about the ${topSymptom.symptom} you're experiencing. This seems to be significantly impacting you. `;
          responseText += "Have you considered speaking with a mental health professional about this? I can help you find resources. ";
        } else if (analysis.severity_assessment?.level === 'moderate') {
          responseText += `I understand that you're dealing with ${topSymptom.symptom}. `;
          responseText += "Would you like to explore some coping strategies together? ";
        } else {
          responseText += `I notice you mentioned experiencing ${topSymptom.symptom}. `;
          responseText += "Would you like to talk more about how this is affecting you? ";
        }
      }

      // Add follow-up question based on context
      if (analysis.detected_symptoms.length > 1) {
        responseText += "I also notice you mentioned other challenges. Would you like to discuss those as well? ";
      }
    } else {
      // Generic supportive response for no detected symptoms
      responseText += "I'm here to support you and listen. What's on your mind today? Feel free to share whatever you're comfortable with.";
    }

    return {
      text: responseText || "I'm here to help. Could you tell me more about what's on your mind?",
      sender: 'ai',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      text: "I apologize, but I'm having trouble understanding. Could you please rephrase that?",
      sender: 'ai',
      timestamp: new Date()
    };
  }
}
