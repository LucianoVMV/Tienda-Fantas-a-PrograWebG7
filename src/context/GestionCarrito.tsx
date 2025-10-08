import React, { createContext, useContext, useState, useEffect } from "react";

import type { Product } from "../data/productos"; 


export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  saved: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQty: (productId: number) => void;
  decreaseQty: (productId: number) => void;
  clearCart: () => void;
  saveForLater: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
 
useEffect(() => {
  const storedItems = localStorage.getItem("cartItems");
  const storedSaved = localStorage.getItem("savedItems");
  if (storedItems) setItems(JSON.parse(storedItems));
  if (storedSaved) setSaved(JSON.parse(storedSaved));
}, []);

useEffect(() => {
  localStorage.setItem("cartItems", JSON.stringify(items));
  localStorage.setItem("savedItems", JSON.stringify(saved));
}, [items, saved]);


  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (p: Product, qty = 1) => {
    setItems(prev => {
      const found = prev.find(x => x.product.id === p.id);
      if (found) {
        return prev.map(x => x.product.id === p.id ? { ...x, quantity: x.quantity + qty } : x);
      }
      return [...prev, { product: p, quantity: qty }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(x => x.product.id !== productId));
  };

  const increaseQty = (productId: number) => {
    setItems(prev => prev.map(x => x.product.id === productId ? { ...x, quantity: x.quantity + 1 } : x));
  };

  const decreaseQty = (productId: number) => {
    setItems(prev => prev.flatMap(x => x.product.id === productId ? (x.quantity > 1 ? [{ ...x, quantity: x.quantity - 1 }] : []) : [x]));
  };

  const clearCart = (keepLocalStorage = false) => {
    setItems([]);
    setSaved([]);
    if (!keepLocalStorage) {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("savedItems");
    }
  };
  

  const saveForLater = (productId: number) => {
    setItems(prev => {
      const found = prev.find(x => x.product.id === productId);
      if (!found) return prev;
      setSaved(s => [...s, found]);
      return prev.filter(x => x.product.id !== productId);
    });
  };

  return (
    <CartContext.Provider value={{ items, saved, isOpen, openCart, closeCart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, saveForLater }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
