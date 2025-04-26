
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from '../ChatInterface';

describe('ChatInterface', () => {
  it('renders initial AI message', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Hi there! I'm HeadDoWell/i)).toBeInTheDocument();
  });

  it('allows user to send a message', async () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'I feel sad and tired' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('I feel sad and tired')).toBeInTheDocument();
    });
  });
});
