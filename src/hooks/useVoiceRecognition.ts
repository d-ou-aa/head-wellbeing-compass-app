
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';

type VoiceRecognitionStatus = 'inactive' | 'listening' | 'processing';

interface UseVoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
  onStatusChange?: (status: VoiceRecognitionStatus) => void;
  language?: string;
  continuousRecognition?: boolean;
}

export const useVoiceRecognition = ({
  onTranscript,
  onStatusChange,
  language = 'en-US',
  continuousRecognition = false
}: UseVoiceRecognitionProps) => {
  const [status, setStatus] = useState<VoiceRecognitionStatus>('inactive');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  // Update external status handler
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      setIsSupported(false);
      toast({
        title: 'Voice Recognition Not Available',
        description: 'Your browser does not support voice recognition capabilities.',
        variant: 'destructive',
      });
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure recognition
    recognitionInstance.continuous = continuousRecognition;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;
    
    recognitionInstance.onstart = () => {
      console.log('Voice recognition started');
      setStatus('listening');
    };
    
    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      console.log('Transcript:', transcript);
      
      if (event.results[0].isFinal) {
        setStatus('processing');
        onTranscript(transcript);
        
        // If not continuous, automatically stop after final result
        if (!continuousRecognition) {
          stopRecognition();
        }
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast({
        title: 'Voice Recognition Error',
        description: `Error: ${event.error}. Please try again.`,
        variant: 'destructive',
      });
      setStatus('inactive');
    };
    
    recognitionInstance.onend = () => {
      console.log('Voice recognition ended');
      setStatus('inactive');
    };
    
    recognitionRef.current = recognitionInstance;
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error cleaning up recognition:', error);
        }
      }
    };
  }, [language, continuousRecognition, onTranscript]);
  
  const startRecognition = useCallback(() => {
    if (!isSupported) {
      toast({
        title: 'Voice Recognition Not Available',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive',
      });
      return;
    }
    
    if (status === 'listening') {
      return;
    }
    
    if (!recognitionRef.current) {
      toast({
        title: 'Voice Recognition Not Initialized',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast({
        title: 'Voice Recognition Error',
        description: 'Failed to start voice recognition. Please try again.',
        variant: 'destructive',
      });
    }
  }, [isSupported, status]);
  
  const stopRecognition = useCallback(() => {
    if (!isSupported || status === 'inactive' || !recognitionRef.current) {
      return;
    }
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, [isSupported, status]);
  
  return {
    isRecording: status === 'listening',
    isProcessing: status === 'processing',
    isSupported,
    startRecognition,
    stopRecognition,
  };
};
