
import { DetectedSymptom } from '@/types/mentalHealth';

export type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
};

export type ChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  addEmoji: (emoji: string) => void;
  currentSymptom: DetectedSymptom | null;
  conversationState: 'initial' | 'detecting' | 'questioning' | 'summarizing';
  voiceEnabled?: boolean;
  setVoiceEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeaking?: boolean;
  stopSpeaking?: () => void;
  isSpeechSupported?: boolean;
};
