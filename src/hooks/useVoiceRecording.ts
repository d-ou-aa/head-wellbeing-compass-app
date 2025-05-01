
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useVoiceRecording = (onTranscript: (transcript: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      if (event.results[0].isFinal) {
        onTranscript(transcript);
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast({
        title: 'Voice Recognition Error',
        description: `Error: ${event.error}. Please try again.`,
        variant: 'destructive',
      });
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [onTranscript]);

  const startRecording = useCallback(() => {
    if (!recognition) {
      toast({
        title: 'Voice Recognition Not Available',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive',
      });
      return;
    }

    try {
      recognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Voice Recognition Error',
        description: 'Failed to start voice recording. Please try again.',
        variant: 'destructive',
      });
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition, isRecording]);

  return { isRecording, startRecording, stopRecording };
};
