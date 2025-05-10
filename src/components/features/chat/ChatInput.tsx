
import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmojiPicker from './EmojiPicker';
import { useChatContext } from './context';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { toast } from '@/components/ui/use-toast';

const ChatInput = () => {
  const { input, setInput, handleSend } = useChatContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const handleTranscript = (transcript: string) => {
    console.log("Voice transcript received:", transcript);
    setInput(transcript);
    setIsProcessing(false);
    
    // Auto-send if we have a complete sentence ending with punctuation
    if (/[.!?]$/.test(transcript.trim())) {
      setTimeout(() => handleSend(), 300);
    }
  };

  const {
    isRecording,
    isProcessing: voiceProcessing,
    startRecognition,
    stopRecognition,
  } = useVoiceRecognition({
    onTranscript: handleTranscript,
    onStatusChange: (status) => {
      setIsProcessing(status === 'processing');
    },
    language: 'en-US',
    continuousRecognition: false,
  });

  const toggleRecording = () => {
    if (isRecording) {
      stopRecognition();
    } else {
      // Request audio permission and start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          startRecognition();
          toast({
            title: "Voice recognition active",
            description: "Speak clearly and I'll listen to what you say.",
            duration: 3000,
          });
        })
        .catch(err => {
          console.error("Microphone access error:", err);
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice recognition.",
            variant: "destructive",
            duration: 5000,
          });
        });
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2">
        {!isMobile && (
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip className="h-5 w-5" />
          </Button>
        )}
        {!isMobile && <EmojiPicker />}
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "Listening..." : "Type your message or speak..."}
            className={`flex-1 ${isRecording ? 'animate-pulse border-teal' : ''}`}
          />
          <Button
            onClick={toggleRecording}
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            className={isRecording ? "animate-pulse" : ""}
            title={isRecording ? "Stop recording" : "Start voice input"}
            disabled={isProcessing || voiceProcessing}
          >
            {isProcessing || voiceProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="bg-teal hover:bg-teal/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isRecording && (
        <div className="text-center mt-2">
          <p className="text-sm text-teal font-medium">Listening... Speak now</p>
          <div className="flex justify-center mt-1">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-1.5 h-4 bg-teal rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
      {(isProcessing || voiceProcessing) && (
        <div className="text-center mt-2">
          <p className="text-sm text-amber-500">Processing your voice...</p>
        </div>
      )}
      {isMobile && (
        <div className="flex justify-center mt-3 text-xs text-gray-500">
          <p>Tap the mic button to speak with HeadDoWell</p>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
