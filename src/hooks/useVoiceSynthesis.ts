
import { useState, useEffect, useCallback } from 'react';

interface UseVoiceSynthesisProps {
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useVoiceSynthesis = ({
  onSpeakStart,
  onSpeakEnd,
  rate = 1,
  pitch = 1,
  volume = 1
}: UseVoiceSynthesisProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech synthesis
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported in this browser');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // Get available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      if (availableVoices.length > 0) {
        setVoiceOptions(availableVoices);
        
        // Select a default voice (prefer female English voice if available)
        const englishVoice = availableVoices.find(
          voice => voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
        );
        
        setSelectedVoice(englishVoice || availableVoices[0]);
      }
    };

    // Load voices - voices may not be available immediately
    loadVoices();
    
    // Chrome loads voices asynchronously
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Cleanup
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle speaking text
  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return false;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate; // Speed
    utterance.pitch = pitch; // Pitch
    utterance.volume = volume; // Volume
    
    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakStart?.();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakEnd?.();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      onSpeakEnd?.();
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    return true;
  }, [isSupported, selectedVoice, rate, pitch, volume, onSpeakStart, onSpeakEnd]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Change selected voice
  const changeVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);
  
  return {
    speak,
    stopSpeaking,
    isSpeaking,
    isSupported,
    voiceOptions,
    selectedVoice,
    changeVoice
  };
};
