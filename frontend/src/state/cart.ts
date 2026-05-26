import type { CartLine } from "../api/client";

export type Cart = Record<number, number>;

const STORAGE_KEY = "ecommerce_cart_v1";

export function loadCart(): Cart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    // localStorage keys are strings; convert to numbers.
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [Number(k), Number(v)])
    );
  } catch {
    return {};
  }
}

export function saveCart(cart: Cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

export function cartToLines(cart: Cart): CartLine[] {
  return Object.entries(cart)
    .map(([productId, quantity]) => ({
      product_id: Number(productId),
      quantity,
    }))
    .filter((l) => l.quantity > 0);
}

export function addToCart(cart: Cart, productId: number, quantity: number = 1): Cart {
  const next = { ...cart };
  const current = next[productId] ?? 0;
  next[productId] = current + quantity;
  if (next[productId] <= 0) delete next[productId];
  return next;
}

export function setCartQuantity(cart: Cart, productId: number, quantity: number): Cart {
  const next = { ...cart };
  if (quantity <= 0) delete next[productId];
  else next[productId] = quantity;
  return next;
}

export function removeFromCart(cart: Cart, productId: number): Cart {
  const next = { ...cart };
  delete next[productId];
  return next;
}

export function clearCart(): Cart {
  return {};
}

