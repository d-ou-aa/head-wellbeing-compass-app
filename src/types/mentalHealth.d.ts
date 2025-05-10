
export type DetectedSymptom = {
  name: string;
  confidence: number;
  description: string;
  source?: 'text' | 'voice';
};

export type TherapyRecommendation = {
  title: string;
  description: string;
  steps?: string[];
  resources?: Array<{
    name: string;
    url?: string;
    description?: string;
  }>;
};

export type Disorder = {
  name: string;
  description: string;
  symptoms: string[];
  commonTreatments: string[];
};

// Voice interaction related types
export type VoiceDetectedIntent = {
  name: string; // e.g., 'get_help', 'express_feeling', 'ask_question'
  confidence: number;
  entities?: Record<string, string>;
};

export type VoiceInteractionContext = {
  lastIntent?: VoiceDetectedIntent;
  sessionDuration: number;
  interactionCount: number;
  detectedMood?: 'positive' | 'negative' | 'neutral';
};
