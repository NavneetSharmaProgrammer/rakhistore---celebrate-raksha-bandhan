
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  keywords: string[];
}

export interface CartItem extends Product {
  quantity: number;
}