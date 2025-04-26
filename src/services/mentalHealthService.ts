
import { Depression, Anxiety } from '@/data/mentalHealthData';
import { DetectedSymptom } from '@/types/mentalHealth';

const disorders = {
  Depression,
  Anxiety
};

// Simple symptom detection based on keywords
export function detectSymptoms(input: string): DetectedSymptom[] {
  const detectedSymptoms: DetectedSymptom[] = [];
  const lowercaseInput = input.toLowerCase();

  Object.entries(disorders).forEach(([disorderName, disorder]) => {
    Object.keys(disorder).forEach(symptomName => {
      if (lowercaseInput.includes(symptomName.toLowerCase())) {
        detectedSymptoms.push({
          name: symptomName,
          disorder: disorderName,
          confirmed: false
        });
      }
    });
  });

  return detectedSymptoms;
}

export function getQuestionsForSymptom(disorder: string, symptom: string): string[] {
  return disorders[disorder as keyof typeof disorders][symptom]?.questions || [];
}

export function getAffirmationsForSymptom(disorder: string, symptom: string): string[] {
  return disorders[disorder as keyof typeof disorders][symptom]?.affirmations || [];
}
