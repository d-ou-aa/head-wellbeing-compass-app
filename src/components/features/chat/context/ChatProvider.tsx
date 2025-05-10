
import React, { useState, useEffect, useCallback } from 'react';
import { ChatContext } from './ChatContext';
import { useConversationLogic } from '../useConversationLogic';
import { useSymptomHandling } from '../useSymptomHandling';
import { useMessageHandling } from '../useMessageHandling';
import { useVoiceSynthesis } from '@/hooks/useVoiceSynthesis';
import { ChatContextType } from '../types';

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    messages,
    setMessages,
    input,
    setInput,
    currentSymptom,
    detectedSymptoms,
    setDetectedSymptoms,
    confirmedSymptoms,
    setConfirmedSymptoms,
    questionIndex,
    setQuestionIndex,
    yesCount,
    setYesCount,
    askedDisorders,
    setAskedDisorders,
    conversationState,
    setConversationState,
    addEmoji
  } = useConversationLogic();

  const {
    handleDetectedSymptoms,
    askQuestionAboutSymptom,
    processNextQuestion,
    provideSummaryAndRecommendations
  } = useSymptomHandling();

  const { handleSend: handleSendBase } = useMessageHandling();
  
  // Voice synthesis - default to enabled
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const { 
    speak, 
    stopSpeaking, 
    isSpeaking, 
    isSupported: isSpeechSupported 
  } = useVoiceSynthesis({
    onSpeakEnd: () => {
      console.log("Finished speaking");
    },
    rate: 1.0,
    pitch: 1.0
  });

  // Handle new AI messages for speech
  useEffect(() => {
    // Find the latest AI message
    const latestAiMessage = [...messages]
      .reverse()
      .find(msg => msg.sender === 'ai' && !msg.isTyping);
    
    // If voice is enabled and we have a new AI message, speak it
    if (
      voiceEnabled && 
      latestAiMessage && 
      !latestAiMessage.isTyping && 
      !isSpeaking
    ) {
      // We use a small timeout to avoid issues with state updates
      setTimeout(() => {
        speak(latestAiMessage.text);
      }, 100);
    }
  }, [messages, voiceEnabled, speak, isSpeaking]);

  // Handle sending a message
  const handleSend = useCallback(() => {
    // If voice synthesis is active, stop it
    if (isSpeaking) {
      stopSpeaking();
    }
    handleSendBase(input, setInput, setMessages);
  }, [input, setInput, setMessages, handleSendBase, isSpeaking, stopSpeaking]);

  // Watch for changes in conversation state and act accordingly
  useEffect(() => {
    if (conversationState === 'detecting') {
      handleDetectedSymptoms(
        input,
        setMessages,
        setDetectedSymptoms,
        setConversationState
      );
    } else if (conversationState === 'summarizing') {
      provideSummaryAndRecommendations(
        confirmedSymptoms,
        setMessages,
        setConversationState
      );
    }
  }, [
    conversationState,
    input,
    confirmedSymptoms,
    handleDetectedSymptoms,
    provideSummaryAndRecommendations,
    setMessages,
    setDetectedSymptoms,
    setConversationState
  ]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        handleSend,
        addEmoji,
        currentSymptom,
        conversationState,
        voiceEnabled,
        setVoiceEnabled,
        isSpeaking,
        stopSpeaking,
        isSpeechSupported
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
