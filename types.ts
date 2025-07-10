// File: types.ts

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    keywords: string[];
}

// ADD THIS NEW INTERFACE
export interface CartItem extends Product {
  quantity: number;
}
// File: types.ts

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    keywords: string[];
}

// ADD THIS EXPORTED INTERFACE
export interface CartItem extends Product {
  quantity: number;
}