
import { DetectedSymptom } from '@/types/mentalHealth';

export type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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
};
