
import { mentalHealthData } from '@/data/mentalHealthData';
import { DetectedSymptom } from '@/types/mentalHealth';

const symptomExpressions: Record<string, string[]> = {};

// Populate symptomExpressions from mentalHealthData
Object.values(mentalHealthData).forEach(disorder => {
  Object.values(disorder).forEach(symptomData => {
    symptomData.symptoms.forEach(symptom => {
      symptomExpressions[symptom] = symptomData.symptoms;
    });
  });
});

export function detectSymptoms(input: string): DetectedSymptom[] {
  const lowercaseInput = input.toLowerCase();
  const detectedSymptoms: DetectedSymptom[] = [];

  Object.entries(mentalHealthData).forEach(([disorderName, disorder]) => {
    Object.entries(disorder).forEach(([symptomName, symptomData]) => {
      const matchedSymptoms = symptomData.symptoms.filter(symptomExpression => 
        lowercaseInput.includes(symptomExpression.toLowerCase())
      );

      if (matchedSymptoms.length > 0) {
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
  return mentalHealthData[disorder][symptom]?.questions || [];
}

export function getAffirmationsForSymptom(disorder: string, symptom: string): string[] {
  return mentalHealthData[disorder][symptom]?.affirmations || [];
}
