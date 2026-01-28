import React, { createContext, useContext, useState } from 'react';

// Helper to safely read an entry's recipe id whether entry is { item, quantity }
// or a plain recipe object kept from a previous state shape.
const getEntryId = (entry) => {
  if (!entry) return undefined;
  if (entry.item && entry.item._id) return entry.item._id;
  return entry._id;
};

const CartContext = createContext({
  cartItems: [], // [{ item, quantity }]
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // [{ item, quantity }]

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((entry) => getEntryId(entry) === item._id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return updated;
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((entry) => getEntryId(entry) === itemId);
      if (existingIndex === -1) return prev;

      const updated = [...prev];
      const current = updated[existingIndex];
      const currentQty = current.quantity || 1;
      if (currentQty > 1) {
        updated[existingIndex] = { ...current, quantity: currentQty - 1 };
        return updated;
      }
      updated.splice(existingIndex, 1);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
