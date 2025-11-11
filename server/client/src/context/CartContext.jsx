import { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../lib/auth';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);

  const loadCount = async () => {
    const token = getToken();
    if (!token) return setCount(0);
    try {
      const r = await fetch('http://localhost:4000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await r.json();
      setCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => { loadCount(); }, []);

  return (
    <CartContext.Provider value={{ count, setCount, reload: loadCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
