
import React, { useState, FormEvent } from 'react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  onCheckoutSuccess: () => void;
}

// !!! IMPORTANT: REPLACE WITH YOUR GOOGLE APPS SCRIPT URL !!!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz40lnEWfURudHr19joY56nwmqrQxZBxoO1C_HidQ51QOMetrEU_TkW_a2BFuiR20NN/exec';

// !!! IMPORTANT: REPLACE WITH YOUR WHATSAPP NUMBER (including country code) !!!
const WHATSAPP_NUMBER = '919412118305';

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onCheckoutSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !phone || !address) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }

    setIsLoading(true);

    const cartSummary = cartItems
      .map(item => `${item.name} (x${item.quantity})`)
      .join(', ');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('cartSummary', cartSummary);
    formData.append('totalPrice', totalPrice.toString());

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();

        if (data.result === 'success') {
            const message = `🎉 *New Order from RakhiStore!* 🎉\n\n*Name:*\n${name}\n\n*Phone:*\n${phone}\n\n*Address:*\n${address}\n\n*Items:*\n${cartSummary}\n\n*Total: ₹${totalPrice}*\n\nThank you for your order!`;
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            
            onCheckoutSuccess();
            window.open(whatsappUrl, '_blank');
        } else {
            throw new Error(data.error || 'Failed to submit order.');
        }

    } catch (err: any) {
        console.error('Fetch Error:', err);
        setError(`Order failed: ${err.message}. Please try again.`);
    } finally {
        setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-brand-surface/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-brand-purple/30 border border-gray-700/50 w-[calc(100%-2rem)] max-w-lg p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-white">Confirm Your Order</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-colors"
                required
            />
            <input 
                type="tel" 
                placeholder="10-Digit Phone Number" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-colors"
                required
            />
            <textarea 
                placeholder="Delivery Address" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-colors"
                required
            />

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-pink/30 text-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                    </>
                ) : `Submit & Confirm on WhatsApp (₹${totalPrice})`}
            </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
