import { API_BASE_URL } from '../config';

// --- Auth ---
export const loginUser = async (email, password, role) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const registerUser = async (fullname, email, password, role) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, password, role }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

// --- Products ---
export const fetchProducts = async (categoryId) => {
  let url = `${API_BASE_URL}/api/products`;
  if (categoryId) url += `?category_id=${categoryId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

// --- Cart (Server) ---
export const addToCartApi = async (userId, productId, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
  });
  return response.json();
};

export const getCartApi = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/cart?user_id=${userId}`);
  return response.json();
};

export const removeFromCartApi = async (cartItemId) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
    method: 'DELETE',
  });
  return response.json();
};

// --- Profile ---
export const updateProfile = async (userId, address, contactNumber) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, contact_number: contactNumber }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Profile update failed');
  return data;
};
