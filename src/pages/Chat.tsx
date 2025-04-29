
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import ChatInterface from '../components/features/ChatInterface';

const Chat = () => {
  return (
    <MainLayout pageTitle="Chat with HeadDoWell">
      <ChatInterface />
    </MainLayout>
  );
};

export default Chat;
