'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size: string, color: string) => void;
  updateQuantity: (itemId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (itemToAdd: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === itemToAdd.id && item.size === itemToAdd.size && item.color === itemToAdd.color
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemToAdd.id && item.size === itemToAdd.size && item.color === itemToAdd.color
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      }
      return [...prevItems, itemToAdd];
    });
  };

  const removeFromCart = (itemId: string, size: string, color: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === itemId && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (itemId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice,
      }}
    >
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
