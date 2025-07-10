
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import CheckoutModal from './CheckoutModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckoutSuccess = () => {
    clearCart();
    setIsCheckoutOpen(false);
    onClose(); // Close the cart sidebar
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'bg-black/60' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-surface/90 backdrop-blur-xl shadow-2xl shadow-brand-purple/20 transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="font-orbitron text-2xl font-bold text-white">Your Cart</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center text-brand-muted h-full flex flex-col justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <p>Your cart is a void... for now.</p>
                  <p className="text-sm">Time to sync some stellar gifts!</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.id} className="flex items-center space-x-4 animate-fade-in">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover border border-gray-700" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-brand-muted text-sm">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="font-orbitron text-lg text-white">₹{(item.price * item.quantity)}</div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 rounded-full text-brand-muted hover:text-red-500 hover:bg-red-500/10">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-700 space-y-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-300">Total ({totalItems} items)</span>
                  <span className="font-orbitron text-white">₹{totalPrice}</span>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-pink/30 text-lg">
                  Proceed to Checkout
                </button>
                 <button onClick={clearCart} className="w-full text-brand-muted hover:text-red-400 text-sm">Clear Cart</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        totalPrice={totalPrice}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </>
  );
};

export default Cart;
