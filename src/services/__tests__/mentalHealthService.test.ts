
import { detectSymptoms, getQuestionsForSymptom, getAffirmationsForSymptom } from '@/services/mentalHealthService';

describe('Mental Health Service', () => {
  describe('detectSymptoms', () => {
    it('should detect depression symptoms', () => {
      const input = "I feel tired and sad all the time";
      const symptoms = detectSymptoms(input);
      
      expect(symptoms).toContainEqual(
        expect.objectContaining({
          name: expect.stringMatching(/Fatigue|Sadness/),
          disorder: 'Depression',
          confirmed: false
        })
      );
    });

    it('should detect anxiety symptoms', () => {
      const input = "I'm always feeling restless and sweating";
      const symptoms = detectSymptoms(input);
      
      expect(symptoms).toContainEqual(
        expect.objectContaining({
          name: expect.stringMatching(/Restlessness|Sweating/),
          disorder: 'Anxiety',
          confirmed: false
        })
      );
    });
  });

  describe('getQuestionsForSymptom', () => {
    it('should return questions for a specific symptom', () => {
      const questions = getQuestionsForSymptom('Depression', 'Fatigue');
      expect(questions).toBeInstanceOf(Array);
      expect(questions.length).toBeGreaterThan(0);
    });
  });

  describe('getAffirmationsForSymptom', () => {
    it('should return affirmations for a specific symptom', () => {
      const affirmations = getAffirmationsForSymptom('Depression', 'Sadness');
      expect(affirmations).toBeInstanceOf(Array);
      expect(affirmations.length).toBeGreaterThan(0);
    });
  });
});
