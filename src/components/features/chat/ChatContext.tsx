
import React, { createContext, useContext, useCallback } from 'react';
import { useConversationLogic } from './useConversationLogic';
import { useSymptomHandling } from './useSymptomHandling';
import { useMessageHandling } from './useMessageHandling';
import { ChatContextType } from './types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

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
    processNextQuestion: processNextQuestionBase,
    provideSummaryAndRecommendations
  } = useSymptomHandling();

  const { handleSend: handleSendBase } = useMessageHandling();

  // Process next question with all required dependencies
  const processNextQuestion = useCallback(() => {
    processNextQuestionBase(
      currentSymptom,
      questionIndex,
      yesCount,
      detectedSymptoms,
      setQuestionIndex,
      setConfirmedSymptoms,
      setDetectedSymptoms,
      setMessages,
      setConversationState
    );
  }, [
    currentSymptom,
    questionIndex,
    yesCount,
    detectedSymptoms,
    setQuestionIndex,
    setConfirmedSymptoms,
    setDetectedSymptoms,
    setMessages,
    setConversationState,
    processNextQuestionBase
  ]);

  // Handle sending a message with all required dependencies
  const handleSend = useCallback(() => {
    handleSendBase(
      input,
      setInput,
      setMessages,
      conversationState,
      currentSymptom,
      setDetectedSymptoms,
      setYesCount,
      setConversationState,
      processNextQuestion,
      confirmedSymptoms // Pass confirmedSymptoms here
    );
  }, [
    input,
    setInput,
    setMessages,
    conversationState,
    currentSymptom,
    setDetectedSymptoms,
    setYesCount,
    setConversationState,
    processNextQuestion,
    handleSendBase,
    confirmedSymptoms // Include in dependencies
  ]);

  // Watch for changes in conversation state and act accordingly
  React.useEffect(() => {
    if (conversationState === 'detecting') {
      handleDetectedSymptoms(
        detectedSymptoms,
        askedDisorders,
        setAskedDisorders,
        setMessages,
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
    detectedSymptoms,
    askedDisorders,
    confirmedSymptoms,
    handleDetectedSymptoms,
    provideSummaryAndRecommendations,
    setAskedDisorders,
    setMessages,
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
        conversationState
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};

// Use `export type` when 'isolatedModules' is enabled
export type { Message } from './types';
