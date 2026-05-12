import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.productId === newItem.productId && 
        item.selectedSize === newItem.selectedSize && 
        item.selectedColor === newItem.selectedColor
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.productId === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity < 1) return;
    setCart(prevCart => prevCart.map(item => 
      (item.productId === productId && 
       item.selectedSize === selectedSize && 
       item.selectedColor === selectedColor)
      ? { ...item, quantity }
      : item
    ));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      totalItems, totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
