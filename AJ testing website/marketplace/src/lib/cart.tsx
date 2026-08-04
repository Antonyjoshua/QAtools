'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Product } from './products';
import { bundle } from './products';

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'product' | 'bundle';
  slug?: string;
}

interface CartContext {
  items: CartItem[];
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addProduct: (product: Product) => void;
  addBundle: () => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearCart: () => void;
}

const CartCtx = createContext<CartContext | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart  = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const clearCart = useCallback(() => setItems([]), []);

  const addProduct = useCallback((product: Product) => {
    setItems(prev => {
      if (prev.some(i => i.id === product.id)) return prev;
      return [...prev, { id: product.id, name: product.name, price: product.price, type: 'product', slug: product.slug }];
    });
    setIsOpen(true);
  }, []);

  const addBundle = useCallback(() => {
    setItems([{ id: 'bundle-all', name: bundle.name, price: bundle.price, type: 'bundle' }]);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const hasItem = useCallback((id: string) => {
    if (items.some(i => i.id === 'bundle-all')) return true;
    return items.some(i => i.id === id);
  }, [items]);

  const total = items.reduce((s, i) => s + i.price, 0);
  const count = items.length;

  return (
    <CartCtx.Provider value={{ items, total, count, isOpen, openCart, closeCart, addProduct, addBundle, removeItem, hasItem, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
