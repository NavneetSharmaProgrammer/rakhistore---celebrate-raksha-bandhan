
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface ChatAssistantContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatAssistantContext = createContext<ChatAssistantContextType | undefined>(undefined);

export const ChatAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const toggleChat = useCallback(() => setIsChatOpen(prev => !prev), []);
  
  const value = { isChatOpen, openChat, closeChat, toggleChat };

  return (
    <ChatAssistantContext.Provider value={value}>
      {children}
    </ChatAssistantContext.Provider>
  );
};

export const useChatAssistant = (): ChatAssistantContextType => {
  const context = useContext(ChatAssistantContext);
  if (context === undefined) {
    throw new Error('useChatAssistant must be used within a ChatAssistantProvider');
  }
  return context;
};
