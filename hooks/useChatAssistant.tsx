// File: hooks/useChatAssistant.tsx
import React, { useState, useCallback, useContext, createContext, ReactNode } from 'react';
import { Message } from '../types';

// Define the shape of the context's value
interface ChatAssistantContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (newMessageText: string) => Promise<void>;
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

// Create the context with a default undefined value
const ChatAssistantContext = createContext<ChatAssistantContextType | undefined>(undefined);

// Create the Provider component
export const ChatAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
    };
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    try {
      const historyForApi = currentMessages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user', // Match API's role names
        parts: [{ text: m.text }],
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyForApi,
          message: newMessageText,
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
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: "Sorry, I'm having trouble." } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const value = { messages, isLoading, sendMessage, isChatOpen, openChat, closeChat };

  return (
    <ChatAssistantContext.Provider value={value}>
      {children}
    </ChatAssistantContext.Provider>
  );
};

// Create the custom hook to easily access the context
export const useChatAssistant = (): ChatAssistantContextType => {
  const context = useContext(ChatAssistantContext);
  if (context === undefined) {
    throw new Error('useChatAssistant must be used within a ChatAssistantProvider');
  }
  return context;
};