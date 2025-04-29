
import { mentalHealthData } from '@/data/mentalHealthData';
import { DetectedSymptom } from '@/types/mentalHealth';

// Helper function to match user input against symptom expressions
function matchTextWithSymptoms(input: string): string[] {
  const lowerInput = input.toLowerCase();
  const matches: string[] = [];
  
  // Go through all disorders and symptoms
  Object.entries(mentalHealthData).forEach(([disorderName, disorder]) => {
    Object.entries(disorder).forEach(([symptomName, symptomData]) => {
      // Check if any symptom expression matches the input
      const hasMatch = symptomData.symptoms.some(expression => 
        lowerInput.includes(expression.toLowerCase())
      );
      
      if (hasMatch && !matches.includes(symptomName)) {
        matches.push(symptomName);
      }
    });
  });
  
  return matches;
}

export function detectSymptoms(input: string): DetectedSymptom[] {
  const lowercaseInput = input.toLowerCase();
  const detectedSymptoms: DetectedSymptom[] = [];
  const matchedSymptoms = matchTextWithSymptoms(lowercaseInput);

  // Find which disorder each symptom belongs to
  matchedSymptoms.forEach(symptomName => {
    Object.entries(mentalHealthData).forEach(([disorderName, disorder]) => {
      if (symptomName in disorder) {
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
  return mentalHealthData[disorder]?.[symptom]?.questions || [];
}

export function getAffirmationsForSymptom(disorder: string, symptom: string): string[] {
  return mentalHealthData[disorder]?.[symptom]?.affirmations || [];
}
