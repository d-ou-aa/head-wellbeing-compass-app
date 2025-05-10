
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useVoiceRecording = (onTranscript: (transcript: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsProcessing(true);
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      if (event.results[0].isFinal) {
        // Process transcript like Whisper would - correct common misrecognitions
        const processedTranscript = processTranscript(transcript);
        onTranscript(processedTranscript);
        setTimeout(() => setIsProcessing(false), 500);
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
      setIsProcessing(false);
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

  // Process transcript similar to how Whisper would
  const processTranscript = (text: string): string => {
    // Capitalize first letter of sentences
    let processed = text.replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
    
    // Fix common speech recognition issues
    processed = processed.replace(/i'm/gi, "I'm");
    processed = processed.replace(/i'll/gi, "I'll");
    processed = processed.replace(/i've/gi, "I've");
    processed = processed.replace(/i'd/gi, "I'd");
    
    // Add period at end if missing
    if (!/[.!?]$/.test(processed)) {
      processed += '.';
    }
    
    return processed;
  };

  const startRecording = useCallback(() => {
    if (!recognition) {
      toast({
        title: 'Voice Recognition Not Available',
        description: 'Your browser does not support voice recognition. Please use text input instead.',
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

  return { isRecording, startRecording, stopRecording, isProcessing };
};
