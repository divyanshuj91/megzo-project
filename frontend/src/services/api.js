const BASE_URL = '/api';

export async function loginApi(email, password, role) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function registerApi(fullname, email, password, role) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, password, role }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function getCategoriesApi() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function getProductsApi(categoryId) {
  const url = categoryId ? `${BASE_URL}/products?category_id=${categoryId}` : `${BASE_URL}/products`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function getProductByIdApi(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product details');
  return response.json();
}

export async function getCartApi(userId) {
  const response = await fetch(`${BASE_URL}/cart?user_id=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch cart');
  return response.json();
}

export async function addToCartApi(userId, productId, quantity = 1) {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to add item to cart');
  return data;
}

export async function removeFromCartApi(cartItemId) {
  const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to remove item from cart');
  return data;
}

export async function updateProfileApi(userId, { name, address, contactNumber, location, profilePicture }) {
  const response = await fetch(`${BASE_URL}/users/${userId}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      name, 
      address, 
      contact_number: contactNumber,
      location,
      profile_picture: profilePicture
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
}
