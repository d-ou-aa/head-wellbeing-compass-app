
export type Symptom = {
  questions: string[];
  affirmations: string[];
};

export type Disorder = {
  [symptomName: string]: Symptom;
};

export type DetectedSymptom = {
  name: string;
  disorder: string;
  confirmed: boolean;
};
