
import { Message } from './types';
import { toast } from '@/components/ui/use-toast';
import { analyzeMessage, generateResponse } from '@/services/nlpService';
import { useState, useCallback } from 'react';

export function useMessageHandling() {
  const [isProcessing, setIsProcessing] = useState(false);

  const removeTypingIndicator = useCallback((messages: Message[]) => {
    return messages.filter(msg => !msg.isTyping);
  }, []);

  const addTypingIndicator = useCallback((messages: Message[]) => {
    return [...messages, { 
      text: '...', 
      sender: 'ai' as const, 
      timestamp: new Date(),
      isTyping: true 
    }];
  }, []);

  // Handle sending a message
  const handleSend = async (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ): Promise<void> => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isProcessing) return;

    try {
      setIsProcessing(true);
      const userMessage: Message = { 
        text: trimmedInput, 
        sender: 'user' as const, 
        timestamp: new Date() 
      };

      setMessages(prev => [...prev, userMessage]);
      setMessages(prev => addTypingIndicator(prev));
      setInput('');

      // Analyze message using NLP service
      const analysis = await analyzeMessage(trimmedInput);
      
      // Generate and add AI response
      const aiMessage = generateResponse(analysis);
      
      setMessages(prev => {
        const messagesWithoutTyping = removeTypingIndicator(prev);
        return [...messagesWithoutTyping, aiMessage];
      });
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      setMessages(prev => removeTypingIndicator(prev));
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleSend, isProcessing };
}
