const { Pool } = require('pg');
const logger = require('./logger');

const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'root1234',
        database: process.env.DB_DATABASE || 'magikart',
        port: parseInt(process.env.DB_PORT || '5432', 10)
    },
    redis: {
        url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
    },
    port: process.env.PORT || 3000
};

// Initialize PostgreSQL Connection Pool
const dbPool = new Pool(config.db);

let useMockDb = false;

// Mock Database arrays for fallback
let mockUsers = [];
let mockCartItems = [];
const mockCategories = [
    { id: 1, name: 'Electronics', slug: 'electronics', image_url: 'images/laptop.png' },
    { id: 2, name: 'Accessories', slug: 'accessories', image_url: 'images/smartwatch.png' },
    { id: 3, name: 'Gaming', slug: 'gaming', image_url: 'images/gamingconsole.png' }
];
const mockProducts = [
    { id: 1, category_id: 1, category_name: 'Electronics', title: 'Premium Smartphone', description: 'High-performance smartphone with advanced camera system.', price: 69999, original_price: 79999, discount_percentage: 12, image_url: 'images/smartphone.png', rating: 4.8, review_count: 120, is_assured: true },
    { id: 2, category_id: 1, category_name: 'Electronics', title: 'Ultra-Slim Laptop', description: 'Lightweight and powerful laptop perfect for work.', price: 84999, original_price: 99999, discount_percentage: 15, image_url: 'images/laptop.png', rating: 4.7, review_count: 85, is_assured: true },
    { id: 3, category_id: 1, category_name: 'Electronics', title: 'Wireless Headphones', description: 'Noise-canceling over-ear headphones with immersive sound.', price: 14999, original_price: 19999, discount_percentage: 25, image_url: 'images/headphones.png', rating: 4.6, review_count: 200, is_assured: true },
    { id: 4, category_id: 2, category_name: 'Accessories', title: 'Smart Fitness Watch', description: 'Track your health and fitness goals.', price: 4999, original_price: 9999, discount_percentage: 50, image_url: 'images/smartwatch.png', rating: 4.5, review_count: 300, is_assured: true },
    { id: 5, category_id: 1, category_name: 'Electronics', title: 'Pro Tablet', description: 'Versatile tablet for productivity.', price: 35999, original_price: 45999, discount_percentage: 21, image_url: 'images/tablet.png', rating: 4.4, review_count: 150, is_assured: true },
    { id: 6, category_id: 1, category_name: 'Electronics', title: 'Gaming Console', description: 'Next-gen gaming console for the ultimate experience.', price: 49990, original_price: 54990, discount_percentage: 9, image_url: 'images/laptop.png', rating: 4.9, review_count: 500, is_assured: true },
    { id: 7, category_id: 1, category_name: 'Electronics', title: '4K Smart TV', description: 'Experience cinematic visuals.', price: 32999, original_price: 59999, discount_percentage: 45, image_url: 'images/laptop.png', rating: 4.3, review_count: 90, is_assured: true },
    { id: 8, category_id: 1, category_name: 'Electronics', title: 'Bluetooth Speaker', description: 'Portable speaker with deep bass.', price: 2999, original_price: 4999, discount_percentage: 40, image_url: 'images/headphones.png', rating: 4.2, review_count: 110, is_assured: true }
];

dbPool.connect((err, client, release) => {
    if (err) {
        logger.error('Error connecting to PostgreSQL. Automatically switching to Mock Database Fallback.');
        useMockDb = true;
        return;
    }
    logger.info('Connected to PostgreSQL database');
    release();
});

module.exports = {
    config,
    db: dbPool,
    getUseMockDb: () => useMockDb,
    setUseMockDb: (val) => { useMockDb = val; },
    mockUsers,
    mockCartItems,
    mockCategories,
    mockProducts
};
