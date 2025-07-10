
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { startChatSession, streamMessage } from '../services/geminiService';
// import type { Chat } from '@google/genai';
type Chat = any; // Temporary fallback type, replace with actual type if available
import { useChatAssistant } from '../hooks/useChatAssistant';

const ChatAssistant: React.FC = () => {
  const { isChatOpen, openChat, closeChat } = useChatAssistant();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      chatRef.current = startChatSession();
      setMessages([
        { role: 'model', text: 'Hi there! I\'m your friendly Rakhi Assistant. How can I help you celebrate Raksha Bandhan today?' }
      ]);
    }
  }, [isChatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatRef.current) {
        const stream = await streamMessage(chatRef.current, input);
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of stream) {
          modelResponse += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error streaming message:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Apologies, my circuits are a bit scrambled. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <>
      <button
        onClick={openChat}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink shadow-lg shadow-brand-pink/40 text-white flex items-center justify-center transition-transform hover:scale-110 ${isChatOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
        aria-label="Toggle Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </button>

      <div className={`fixed bottom-6 right-6 z-40 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] transition-all duration-500 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <div className="w-full h-full bg-brand-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-brand-purple/30 border border-gray-700/50 flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h3 className="font-orbitron text-lg font-bold text-white">Rakhi Assistant</h3>
            <button onClick={closeChat} className="p-2 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </header>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink flex-shrink-0"></div>}
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-pink/80 rounded-br-lg' : 'bg-gray-700/60 rounded-bl-lg'}`}>
                  <p className="text-white text-sm whitespace-pre-wrap">{msg.text}{isLoading && msg.role === 'model' && index === messages.length -1 ? '...' : ''}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <footer className="p-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 rounded-lg bg-brand-pink text-white disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;
