
export type DetectedSymptom = {
  name: string;
  confidence: number;
  description: string;
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
