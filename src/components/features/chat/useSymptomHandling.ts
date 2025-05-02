
import { DetectedSymptom } from '@/types/mentalHealth';
import { Message } from './types';
import { handleDetectedSymptoms, askQuestionAboutSymptom } from './utils/symptomDetection';
import { processNextQuestion } from './utils/questionProcessing';
import { provideSummaryAndRecommendations } from './utils/therapyRecommendations';

export function useSymptomHandling() {
  return {
    handleDetectedSymptoms,
    askQuestionAboutSymptom,
    processNextQuestion,
    provideSummaryAndRecommendations
  };
}
