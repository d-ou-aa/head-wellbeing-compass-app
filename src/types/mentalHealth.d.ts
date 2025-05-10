
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

// Text-to-speech related types
export type TTSOptions = {
  voice: 'female' | 'male';
  rate: number; // Speed of speech (0.1 to 10)
  pitch: number; // Voice pitch (0 to 2)
  volume: number; // Volume (0 to 1)
};
