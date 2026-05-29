export const PRODUCTS = [
  { id: 1, name: 'Headphones', category: 'Electronics', price: 2999, image: 'wheadphones' },
  { id: 2, name: 'Smart Watch', category: 'Accessories', price: 4500, image: 'smartwatch' },
  { id: 3, name: 'Modern Camera', category: 'Electronics', price: 50000, image: 'camera' },
  { id: 4, name: 'VR Headset', category: 'Electronics', price: 27000, image: 'vr' },
  { id: 5, name: 'PC Cabinet', category: 'Electronics', price: 10000, image: 'pccabinet' },
  { id: 6, name: 'Smart Speaker', category: 'Electronics', price: 5000, image: 'speaker' },
  { id: 7, name: 'Laptop', category: 'Electronics', price: 55000, image: 'laptop' },
  { id: 8, name: 'Ps5 Controller', category: 'Gaming', price: 4500, image: 'gamecontroller' },
  { id: 9, name: 'Mechanical Keyboard', category: 'Electronics', price: 8000, image: 'keyboard' },
  { id: 10, name: 'Leather Bag', category: 'Accessories', price: 3500, image: 'bag' },
  { id: 11, name: 'Gaming Console', category: 'Gaming', price: 35000, image: 'gamingconsole' },
];

// Placeholder image map - since we don't have the actual image files,
// we use emojis / placeholder URLs. Replace with require() for real assets.
export const PRODUCT_IMAGES = {
  wheadphones: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Headphones',
  smartwatch: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Smart+Watch',
  camera: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Camera',
  vr: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=VR+Headset',
  pccabinet: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=PC+Cabinet',
  speaker: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Speaker',
  laptop: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Laptop',
  gamecontroller: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Controller',
  keyboard: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Keyboard',
  bag: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Bag',
  gamingconsole: 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=Console',
};

export const getProductImage = (imageKey) => {
  return PRODUCT_IMAGES[imageKey] || 'https://via.placeholder.com/300x300/e2e8f0/1a202c?text=No+Image';
};

// Homepage featured products (subset)
export const FEATURED_PRODUCTS = [
  { title: 'Headphones', price: 2999, image: 'wheadphones' },
  { title: 'Smart Watch', price: 4500, image: 'smartwatch' },
  { title: 'Laptop', price: 55000, image: 'laptop' },
  { title: 'Gaming Console', price: 35000, image: 'gamingconsole' },
];
