import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (book, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.bookId === book.bookId);
      const maxQty = book.stockQty ?? Infinity;

      if (existing) {
        return current.map((i) =>
          i.bookId === book.bookId
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxQty) }
            : i
        );
      }

      return [
        ...current,
        {
          bookId: book.bookId,
          title: book.title,
          author: book.author,
          price: book.price,
          coverUrl: book.coverUrl,
          stockQty: book.stockQty,
          quantity: Math.min(quantity, maxQty),
        },
      ];
    });
  };

  const updateQuantity = (bookId, quantity) => {
    setItems((current) =>
      current
        .map((i) => (i.bookId === bookId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (bookId) => {
    setItems((current) => current.filter((i) => i.bookId !== bookId));
  };

  const clear = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * Number(i.price), 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
