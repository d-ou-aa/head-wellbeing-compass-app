
import React from 'react';
import { ChatContext } from './ChatContext';
import { useConversationLogic } from '../useConversationLogic';
import { useSymptomHandling } from '../useSymptomHandling';
import { useMessageHandling } from '../useMessageHandling';
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

  // Handle sending a message
  const handleSend = React.useCallback(() => {
    handleSendBase(input, setInput, setMessages);
  }, [input, setInput, setMessages, handleSendBase]);

  // Watch for changes in conversation state and act accordingly
  React.useEffect(() => {
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
        conversationState
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
