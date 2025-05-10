
import { DetectedSymptom } from '@/types/mentalHealth';
import { NLPAnalysisResult } from './nlpService';

/**
 * Process NLP analysis results to extract symptoms and generate response text
 */
export const processNLPResults = (analysis: NLPAnalysisResult): {
  detectedSymptoms: DetectedSymptom[];
  responseText: string;
} => {
  // Convert NLP symptoms to app format
  const detectedSymptoms = analysis.detectedSymptoms.map(symptom => ({
    name: symptom.name,
    confidence: symptom.confidence,
    description: getSymptomDescription(symptom.name),
    source: analysis.source || 'text'
  }));
  
  // Generate appropriate response based on detected symptoms
  let responseText = '';
  
  if (detectedSymptoms.length > 0) {
    // Mention detected symptoms
    if (detectedSymptoms.length === 1) {
      if (analysis.source === 'voice') {
        responseText = `I heard you mention something that might be related to ${detectedSymptoms[0].name}. I'd like to ask you a few questions about it, if that's okay?`;
      } else {
        responseText = `I noticed you mentioned something that might be related to ${detectedSymptoms[0].name}. I'd like to ask you a few questions about it, if that's okay?`;
      }
    } else {
      const symptomNames = detectedSymptoms.map(s => s.name).join(' and ');
      if (analysis.source === 'voice') {
        responseText = `I heard you mention some feelings that might be related to ${symptomNames}. I'd like to ask you a few questions about these, if that's okay?`;
      } else {
        responseText = `I noticed you mentioned some feelings that might be related to ${symptomNames}. I'd like to ask you a few questions about these, if that's okay?`;
      }
    }
  } else if (analysis.sentiment === 'negative') {
    responseText = "It sounds like you're going through a difficult time. Would you like to talk more about what's been happening?";
  } else {
    responseText = "Thank you for sharing. To help me understand better, could you tell me more about what you've been experiencing recently?";
  }
  
  return {
    detectedSymptoms,
    responseText
  };
};

/**
 * Get description for a symptom
 */
const getSymptomDescription = (symptomName: string): string => {
  const descriptions: Record<string, string> = {
    'anxiety': 'Persistent feelings of worry, fear, or nervousness that may interfere with daily activities',
    'depression': 'Persistent feelings of sadness, hopelessness, and loss of interest in activities',
    'stress': 'Physical or emotional tension resulting from demanding circumstances',
    'insomnia': 'Difficulty falling asleep or staying asleep, leading to daytime fatigue',
    'panic': 'Sudden episodes of intense fear with physical symptoms like racing heart',
    'ptsd': 'Flashbacks, nightmares, and severe anxiety after experiencing a traumatic event',
    'ocd': 'Recurring unwanted thoughts leading to repetitive behaviors',
    'bipolar': 'Extreme mood swings that include emotional highs and lows'
  };
  
  return descriptions[symptomName.toLowerCase()] || 
    'A mental health symptom that may benefit from professional evaluation';
};
