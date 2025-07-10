
// File: components/ChatAssistant.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChatAssistant } from '../hooks/useChatAssistant'; // Make sure this path is correct

const ChatAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  
  // This one line replaces all your old state and chat logic!
  const { messages, isLoading, sendMessage, isChatOpen, openChat, closeChat } = useChatAssistant();
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // THIS IS THE NEW, SIMPLIFIED SUBMIT HANDLER
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue); // Use the function from the hook
      setInputValue(''); // Clear the input field
    }
  };

  if (!isChatOpen) {
    return (
      <button onClick={openChat} className="fixed bottom-5 right-5 ...">
        {/* Your chat icon */}
      </button>
    );
  }

  return (
    // Your JSX for the open chat window
    // It will use the `messages` array to render the chat bubbles
    // and the `isLoading` state to show a typing indicator.
    <div className="fixed bottom-5 right-5 ...">
      <div className="chat-header">
        <button onClick={closeChat}>Close</button>
      </div>
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="typing-indicator">...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default ChatAssistant;