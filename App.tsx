
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import { ChatAssistantProvider } from './hooks/useChatAssistant';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
  return (
    <CartProvider>
      <ChatAssistantProvider>
        <HashRouter>
          <div className="min-h-screen bg-brand-bg text-gray-200 flex flex-col">
            <div 
              className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"
              style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            ></div>
            <div className="relative z-10 flex flex-col flex-grow">
              <Header />
              <main className="pt-20 flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </main>
              <ChatAssistant />
              <Footer />
            </div>
          </div>
        </HashRouter>
      </ChatAssistantProvider>
    </CartProvider>
  );
};

export default App;
