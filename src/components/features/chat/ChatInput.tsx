
import React from 'react';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmojiPicker from './EmojiPicker';
import { useChatContext } from './ChatContext';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

const ChatInput = () => {
  const { input, setInput, handleSend } = useChatContext();
  
  const handleTranscript = (transcript: string) => {
    setInput(transcript);
  };

  const { isRecording, startRecording, stopRecording } = useVoiceRecording(handleTranscript);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={toggleRecording}
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            className={isRecording ? "animate-pulse" : ""}
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
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
    </div>
  );
};

export default ChatInput;
