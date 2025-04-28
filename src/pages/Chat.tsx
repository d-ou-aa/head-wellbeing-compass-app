
import React, { useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import ChatInterface from '../components/features/ChatInterface';

const Chat = () => {
  useEffect(() => {
    // Clear chat history when navigating to this page
    localStorage.removeItem('chatHistory');
  }, []);

  return (
    <MainLayout pageTitle="Chat with HeadDoWell">
      <ChatInterface />
    </MainLayout>
  );
};

export default Chat;
