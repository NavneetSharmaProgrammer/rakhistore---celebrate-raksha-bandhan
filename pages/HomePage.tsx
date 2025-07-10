
import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useChatAssistant } from '../hooks/useChatAssistant';

const AnimatedSection: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
};

const HomePage: React.FC = () => {
  const { openChat } = useChatAssistant();

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 md:pt-24">
        <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-widest animate-fade-in">
          Celebrate Raksha Bandhan with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple animate-subtle-glow">Style and Heart</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Timeless traditions meet modern design. Discover handpicked Rakhis, curated combos, and heartfelt gifts for every sibling bond.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Link to="/shop" className="w-full sm:w-auto bg-gradient-to-r from-brand-pink to-brand-purple hover:opacity-90 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-pink/30 text-lg">
            Shop Rakhis
          </Link>
          <button 
            onClick={openChat}
            className="w-full sm:w-auto bg-brand-surface/80 backdrop-blur-sm border border-gray-700/50 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:bg-white/10">
            💬 Chat with Assistant
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <AnimatedSection>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center text-white mb-12">This Year’s Most-Loved Rakhis 💫</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </AnimatedSection>
      
      {/* About Section Teaser */}
      <AnimatedSection>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl bg-brand-surface/50 p-8 md:p-12 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-brand-purple/30 to-transparent rounded-full blur-3xl"></div>
                <div className="relative z-10 text-center">
                    <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white">Threads of Love, Crafted with Care</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-gray-300">
                        At RakhiStore, we believe Raksha Bandhan is not just a festival — it's a heartfelt expression of sibling love. Our mission is to bring beauty, meaning, and convenience to your celebration.
                    </p>
                    <Link to="/about" className="mt-8 inline-block text-brand-pink font-bold hover:underline">
                        Learn Our Story &rarr;
                    </Link>
                </div>
            </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;
