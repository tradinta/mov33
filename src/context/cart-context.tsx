'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// A generic variant type that can be used for products (size, color) or tickets (tier name)
export type CartItemVariant = {
  name: string;
  size?: string;
  color?: string;
}

export interface CartItem {
  id: string; // Composite ID for products: `productId-size-color`, for tickets: `eventId-ticketId`
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant: CartItemVariant;
}


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'> & { id: string }) => void;
  removeFromCart: (itemId: string, variant: CartItemVariant) => void;
  updateQuantity: (itemId: string, quantity: number, variant: CartItemVariant) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const generateItemId = (productId: string, variant: CartItemVariant) => {
    return `${productId}-${variant.name.replace(/\s+/g, '-')}`;
  }

  const addToCart = (itemToAdd: Omit<CartItem, 'id'> & { id: string }) => {
    const itemId = generateItemId(itemToAdd.id, itemToAdd.variant);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      }
      return [...prevItems, { ...itemToAdd, id: itemId }];
    });
  };

  const removeFromCart = (productId: string, variant: CartItemVariant) => {
    const itemId = generateItemId(productId, variant);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (productId: string, quantity: number, variant: CartItemVariant) => {
     const itemId = generateItemId(productId, variant);
    if (quantity <= 0) {
      removeFromCart(productId, variant);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
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
