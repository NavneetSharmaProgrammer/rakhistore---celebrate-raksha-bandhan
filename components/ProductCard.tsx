// File: components/ProductCard.tsx

import React, { useRef, useState } from 'react';
import { Product } from '../types'; // Make sure you import the Product type
import { useCart } from '../hooks/useCart';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ProductCardProps {
  product: Product;
}

// This is the one and only ProductCard component in this file.
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // --- REFS AND STATE ---
  const tiltRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  // --- INTERSECTION OBSERVER FOR SCROLL ANIMATION ---
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  // --- MOUSE EVENT HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current || !isVisible) return;
    const rect = tiltRef.current.getBoundingClientRect();
    
    // For 3D Tilt
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    tiltRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.05, 1.05, 1.05)`;

    // For Dynamic Radial Glow
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
    tiltRef.current.style.setProperty('--mouse-x', `${mouseX}%`);
    tiltRef.current.style.setProperty('--mouse-y', `${mouseY}%`);
  };

  const handleMouseEnter = () => {
    if (!isVisible) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
  };

  // --- CART HANDLER (This is the corrected version) ---
  const handleAddToCart = () => {
    // Calling addToCart as defined in your useCart hook.
    // It expects a Product and an optional quantity.
    addToCart(product, 1); 

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    // Outer container for the intersection observer
    <div
      ref={containerRef}
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      {/* Inner container for the 3D tilt effect */}
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transition: 'transform 0.1s linear', willChange: 'transform' }}
        className="bg-brand-surface/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 group relative overflow-hidden h-full flex flex-col"
      >
        {/* Dynamic Radial Glow that follows the mouse */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-30' : 'opacity-0'}`}
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), ${product.id.includes('001') ? '#DB2777' : product.id.includes('002') ? '#6B21A8' : '#0891B2'} 10%, transparent 80%)`,
          }}
        />
        
        {/* Card Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-600">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <h3 className="font-orbitron text-xl font-bold text-white truncate">{product.name}</h3>
          <p className="text-brand-muted text-sm mt-1 flex-grow">{product.description}</p>
          <div className="text-xs text-brand-cyan/70 font-mono mt-2">✨ Made in India</div>
          
          {/* Footer with Price and Add-to-Cart Button */}
          <div className="flex justify-between items-center mt-4">
            <p className="font-orbitron text-2xl font-bold text-brand-cyan">₹{product.price}</p>
            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-32 text-center text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg
                ${isAdded 
                  ? 'bg-green-500 shadow-green-500/30 scale-105' 
                  : 'bg-brand-pink/80 hover:bg-brand-pink shadow-brand-pink/20'
                }
              `}
            >
              {isAdded ? 'Added ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;