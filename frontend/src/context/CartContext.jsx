import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCartApi, addToCartApi, removeFromCartApi } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const loadCart = async () => {
    if (user) {
      try {
        const dbCart = await getCartApi(user.id);
        // Map db fields to support both title/name and image/image_url
        const normalizedCart = dbCart.map(item => ({
          ...item,
          id: item.id, // cart item ID
          product_id: item.product_id, // actual product ID
          name: item.name || item.title,
          price: parseFloat(item.price),
          image: item.image || item.image_url,
          category: item.category || 'Electronics',
          quantity: item.quantity || 1
        }));
        setCart(normalizedCart);
      } catch (error) {
        console.error('Failed to load cart from database:', error);
      }
    } else {
      // Guest: Load from localStorage
      const localCart = localStorage.getItem('kelna_cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          localStorage.removeItem('kelna_cart');
          setCart([]);
        }
      } else {
        setCart([]);
      }
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await addToCartApi(user.id, product.product_id || product.id, quantity);
        await loadCart(); // Refresh cart from DB
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      }
    } else {
      // Guest cart
      const currentCart = [...cart];
      const productToAdd = {
        ...product,
        name: product.name || product.title,
        image: product.image || product.image_url,
        price: parseFloat(product.price)
      };
      currentCart.push(productToAdd);
      setCart(currentCart);
      localStorage.setItem('kelna_cart', JSON.stringify(currentCart));
    }
  };

  const removeFromCart = async (itemId, index) => {
    if (user) {
      try {
        await removeFromCartApi(itemId);
        await loadCart();
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        throw error;
      }
    } else {
      // Guest
      const currentCart = [...cart];
      currentCart.splice(index, 1);
      setCart(currentCart);
      localStorage.setItem('kelna_cart', JSON.stringify(currentCart));
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('kelna_cart');
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
