
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
  const transcriptRef = useRef<string>('');
  
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
    recognitionInstance.maxAlternatives = 3; // Get multiple recognition alternatives
    
    recognitionInstance.onstart = () => {
      console.log('Voice recognition started');
      setStatus('listening');
      transcriptRef.current = ''; // Reset transcript on start
    };
    
    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      console.log('Transcript:', transcript);
      
      // Store interim results
      transcriptRef.current = transcript;
      
      if (event.results[0].isFinal) {
        setStatus('processing');
        
        // Process transcript like Whisper would - correct common misrecognitions
        const processedTranscript = processTranscript(transcript);
        console.log('Processed transcript:', processedTranscript);
        
        onTranscript(processedTranscript);
        
        // If not continuous, automatically stop after final result
        if (!continuousRecognition) {
          stopRecognition();
        }
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      
      // Handle the "no-speech" error more gracefully
      if (event.error === 'no-speech') {
        toast({
          title: 'No speech detected',
          description: 'Please speak more clearly or try again.',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Voice Recognition Error',
          description: `Error: ${event.error}. Please try again.`,
          variant: 'destructive',
        });
      }
      
      setStatus('inactive');
    };
    
    recognitionInstance.onend = () => {
      console.log('Voice recognition ended');
      
      // If we have a transcript but didn't process it as final yet, process it now
      if (transcriptRef.current && status === 'listening') {
        setStatus('processing');
        const processedTranscript = processTranscript(transcriptRef.current);
        onTranscript(processedTranscript);
      }
      
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

