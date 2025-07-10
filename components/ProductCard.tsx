
import React, { useRef, useState } from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.2s' }}
      className="bg-brand-surface/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 group relative overflow-hidden"
    >
      <div 
        className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'opacity-30' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at center, ${product.id.includes('001') ? '#DB2777' : product.id.includes('002') ? '#6B21A8' : '#0891B2'} 20%, transparent 80%)`,
        }}
      />
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
        <div className="flex justify-between items-center mt-4">
          <p className="font-orbitron text-2xl font-bold text-brand-cyan">₹{product.price}</p>
          <button 
            onClick={() => addToCart(product)}
            className="bg-brand-pink/80 hover:bg-brand-pink text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-pink/20"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;