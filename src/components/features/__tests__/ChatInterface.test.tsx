
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatInterface from '../ChatInterface';
import { BrowserRouter } from 'react-router-dom';

// Mock the chat components
jest.mock('../chat/ChatContainer', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-chat-container">Mock Chat Container</div>
  };
});

describe('ChatInterface', () => {
  test('renders chat container', () => {
    render(
      <BrowserRouter>
        <ChatInterface />
      </BrowserRouter>
    );
    
    // Check if the chat container is rendered
    expect(screen.getByTestId('mock-chat-container')).toBeInTheDocument();
  });
});
