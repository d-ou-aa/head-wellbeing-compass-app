
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
    processNextQuestion: processNextQuestionBase,
    provideSummaryAndRecommendations
  } = useSymptomHandling();

  const { handleSend: handleSendBase } = useMessageHandling();

  // Process next question with all required dependencies
  const processNextQuestion = React.useCallback(() => {
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
  const handleSend = React.useCallback(() => {
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
      confirmedSymptoms
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
    confirmedSymptoms
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
