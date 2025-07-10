import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { useCart } from '../hooks/useCart';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState<string | null>(null);

  // States for filtering, sorting, and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const filterCategories = [
    'Designer', 'Kids', 'Cartoon', 'Lumba', 'Divine', 'Traditional', 
    'Evil Eye', 'Stone Work', 'Eco-Friendly', 'Silver', 'Superhero', 
    'Light-Up', 'Set', 'Spiritual Decor'
  ];

  // Memoize the filtered and sorted product list
  const displayedProducts = useMemo(() => {
    let products = [...PRODUCTS];

    if (searchTerm) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.length > 0) {
      products = products.filter(p =>
        activeFilters.every(filter => p.keywords.includes(filter.toLowerCase()))
      );
    }

    switch (sortOrder) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for 'default'
        break;
    }

    return products;
  }, [searchTerm, sortOrder, activeFilters]);
  
  const handleFilterToggle = (category: string) => {
    setActiveFilters(prev => {
      const lowerCategory = category.toLowerCase();
      return prev.includes(lowerCategory)
        ? prev.filter(c => c !== lowerCategory)
        : [...prev, lowerCategory];
    });
  };

  const handleVoiceResult = useCallback((transcript: string) => {
    console.log("Voice transcript:", transcript);
    if (transcript.startsWith('add ')) {
      const productName = transcript.replace('add ', '').replace(' to cart', '').trim();
      
      let productToAdd = displayedProducts.find(p => p.name.toLowerCase().includes(productName));

      if (!productToAdd) {
        productToAdd = PRODUCTS.find(p => p.name.toLowerCase().includes(productName));
      }

      if (productToAdd) {
        addToCart(productToAdd);
        setNotification(`Added "${productToAdd.name}" to your cart!`);
      } else {
        setNotification(`Sorry, I couldn't find a product named "${productName}".`);
      }
    }
  }, [addToCart, displayedProducts]);
  
  const { isListening, startListening, isSupported } = useSpeechRecognition(handleVoiceResult);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white text-center md:text-left">
          Our Rakhi Collection
        </h1>
        {isSupported && (
          <button
            onClick={startListening}
            disabled={isListening}
            className={`flex items-center gap-2 py-2 px-5 rounded-lg text-white font-semibold transition-all duration-300 shrink-0 ${
              isListening
                ? 'bg-red-500 animate-pulse'
                : 'bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
              <path d="M5.5 13a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
              <path d="M10 18a5 5 0 005-5h-1a4 4 0 01-8 0H5a5 5 0 005 5z" />
            </svg>
            {isListening ? 'Listening...' : 'Voice-to-Cart'}
          </button>
        )}
      </div>

      <div className="mb-12 p-4 bg-brand-surface/50 rounded-xl border border-gray-700/50 backdrop-blur-sm space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-colors"
          />
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink transition-colors appearance-none"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
            }}
          >
            <option value="default">Sort By: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterCategories.map(category => (
            <button
              key={category}
              onClick={() => handleFilterToggle(category)}
              className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                activeFilters.includes(category.toLowerCase())
                  ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20'
                  : 'bg-brand-surface border border-gray-600 text-gray-300 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-brand-muted animate-fade-in">
            <h2 className="font-orbitron text-2xl text-white">No Signal...</h2>
            <p className="mt-2">No products match your current filter configuration.</p>
            <p className="text-sm">Try adjusting your search parameters to re-establish connection.</p>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-brand-surface border border-brand-pink rounded-lg shadow-lg p-4 z-50 animate-fade-in">
          <p className="text-white text-center">{notification}</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;