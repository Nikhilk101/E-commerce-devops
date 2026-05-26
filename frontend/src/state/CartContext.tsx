import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { CartLine } from "../api/client";
import {
  addToCart,
  cartCount,
  cartToLines,
  clearCart,
  loadCart,
  removeFromCart,
  saveCart,
  setCartQuantity,
  type Cart,
} from "./cart";

type CartContextValue = {
  cart: Cart;
  count: number;
  lines: CartLine[];
  addItem: (productId: number, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    setCart(loadCart());
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const value = useMemo<CartContextValue>(() => {
    return {
      cart,
      count: cartCount(cart),
      lines: cartToLines(cart),
      addItem: (productId, quantity = 1) => setCart((c) => addToCart(c, productId, quantity)),
      setQuantity: (productId, quantity) =>
        setCart((c) => setCartQuantity(c, productId, quantity)),
      removeItem: (productId) => setCart((c) => removeFromCart(c, productId)),
      clear: () => setCart(clearCart()),
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

