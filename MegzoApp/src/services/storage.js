import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'megzo_user';
const CART_KEY = 'megzo_cart';

// --- User Storage ---
export const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Error reading user:', e);
    return null;
  }
};

export const setUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user:', e);
  }
};

export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Error clearing user:', e);
  }
};

// --- Cart Storage ---
export const getCart = async () => {
  try {
    const value = await AsyncStorage.getItem(CART_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('Error reading cart:', e);
    return [];
  }
};

export const setCart = async (cart) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
};

export const addToCartStorage = async (product) => {
  const cart = await getCart();
  cart.push(product);
  await setCart(cart);
  return cart;
};

export const removeFromCartStorage = async (index) => {
  const cart = await getCart();
  cart.splice(index, 1);
  await setCart(cart);
  return cart;
};

export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (e) {
    console.error('Error clearing cart:', e);
  }
};

export const getCartCount = async () => {
  const cart = await getCart();
  return cart.length;
};
