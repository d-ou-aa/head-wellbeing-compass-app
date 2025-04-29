
import { detectSymptoms, getQuestionsForSymptom, getAffirmationsForSymptom } from '../mentalHealthService';
import '@testing-library/jest-dom';

describe('mentalHealthService', () => {
  describe('detectSymptoms', () => {
    it('should detect sadness symptoms', () => {
      const input = 'I feel sad and hopeless';
      const symptoms = detectSymptoms(input);
      
      expect(symptoms).toBeDefined();
      expect(symptoms.length).toBeGreaterThan(0);
      expect(symptoms.some(s => s.name === 'Sadness')).toBe(true);
    });
    
    it('should detect fatigue symptoms', () => {
      const input = 'I feel tired all the time and have no energy';
      const symptoms = detectSymptoms(input);
      
      expect(symptoms).toBeDefined();
      expect(symptoms.length).toBeGreaterThan(0);
      expect(symptoms.some(s => s.name === 'Fatigue')).toBe(true);
    });
  });
  
  describe('getQuestionsForSymptom', () => {
    it('should return questions for a given symptom', () => {
      const questions = getQuestionsForSymptom('Depression', 'Fatigue');
      expect(questions).toBeDefined();
      expect(questions.length).toBeGreaterThan(0);
    });
  });
  
  describe('getAffirmationsForSymptom', () => {
    it('should return affirmations for a given symptom', () => {
      const affirmations = getAffirmationsForSymptom('Depression', 'Fatigue');
      expect(affirmations).toBeDefined();
      expect(affirmations.length).toBeGreaterThan(0);
    });
  });
});
