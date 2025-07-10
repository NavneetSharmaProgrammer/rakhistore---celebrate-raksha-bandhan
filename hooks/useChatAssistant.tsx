// File: hooks/useChatAssistant.tsx
import { useState, useCallback } from 'react';
import { Message } from '../types';

export const useChatAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Rakhi Assistant. How can I help you celebrate Raksha Bandhan today?",
      sender: 'ai',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);

  const sendMessage = useCallback(async (newMessageText: string) => {
    if (!newMessageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessageText,
      sender: 'user',
    };

    // Add the user's message to the state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // Create a placeholder for the AI's response to appear instantly
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      text: '', // Start with empty text
      sender: 'ai',
    };
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    try {
      // Prepare chat history for the API
      // Note: We use the state *before* adding the placeholder for the history
      const historyForApi = [...messages, userMessage].map(m => ({
        role: m.sender,
        parts: [{ text: m.text }],
      }));

      // Call our secure Vercel API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyForApi,
          message: newMessageText, // The API might not need this if history includes it, but it's good practice
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get streaming response from server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Update the AI message placeholder with the new text chunk
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, text: msg.text + chunk }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Update the placeholder with an error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, text: "Sorry, I'm having a little trouble right now. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  return {
    messages,
    isLoading,
    sendMessage,
    isChatOpen,
    openChat,
    closeChat,
  };
};