
import React, { useState } from 'react';
import { Send, Paperclip, Mic, MicOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmojiPicker from './EmojiPicker';
import { useChatContext } from './context';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

const ChatInput = () => {
  const { input, setInput, handleSend } = useChatContext();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleTranscript = (transcript: string) => {
    setInput(transcript);
    setIsProcessing(false);
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
      startRecognition();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Paperclip className="h-5 w-5" />
        </Button>
        <EmojiPicker />
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message or speak..."
            className="flex-1"
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
          <p className="text-sm text-teal">Listening... Speak now</p>
        </div>
      )}
      {(isProcessing || voiceProcessing) && (
        <div className="text-center mt-2">
          <p className="text-sm text-amber-500">Processing your voice...</p>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
