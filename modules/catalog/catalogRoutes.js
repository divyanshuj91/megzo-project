const express = require('express');
const { db, getUseMockDb, setUseMockDb, mockCategories, mockProducts } = require('../../config/config');
const { getCache, setCache } = require('../../config/redis');
const logger = require('../../config/logger');

const router = express.Router();

// 1. Get Categories (using Redis cache)
router.get('/categories', async (req, res) => {
    const cacheKey = 'catalog:categories';
    
    // Attempt cache retrieval
    const cachedCategories = await getCache(cacheKey);
    if (cachedCategories) {
        logger.info('Cache hit for categories list.');
        return res.json(cachedCategories);
    }

    logger.info('Cache miss for categories list. Fetching from database...');

    if (getUseMockDb()) {
        await setCache(cacheKey, mockCategories, 300);
        return res.json(mockCategories);
    }

    db.query('SELECT * FROM categories', async (err, dbRes) => {
        if (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
                setUseMockDb(true);
                await setCache(cacheKey, mockCategories, 300);
                return res.json(mockCategories);
            }
            return res.status(500).json({ error: err.message });
        }
        
        const categories = dbRes.rows;
        await setCache(cacheKey, categories, 300);
        res.json(categories);
    });
});

// 2. Get Products (with optional category filter, using Redis cache)
router.get('/products', async (req, res) => {
    const { category_id } = req.query;
    const cacheKey = category_id ? `catalog:products:category:${category_id}` : 'catalog:products:all';

    // Attempt cache retrieval
    const cachedProducts = await getCache(cacheKey);
    if (cachedProducts) {
        logger.info('Cache hit for products with key: %s', cacheKey);
        return res.json(cachedProducts);
    }

    logger.info('Cache miss for products with key: %s. Fetching from database...', cacheKey);

    if (getUseMockDb()) {
        let products = mockProducts;
        if (category_id) {
            products = mockProducts.filter(p => p.category_id == category_id);
        }
        await setCache(cacheKey, products, 300);
        return res.json(products);
    }

    let query = 'SELECT * FROM products';
    let params = [];

    if (category_id) {
        query += ' WHERE category_id = $1';
        params.push(category_id);
    }

    db.query(query, params, async (err, dbRes) => {
        if (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
                setUseMockDb(true);
                let products = mockProducts;
                if (category_id) {
                    products = mockProducts.filter(p => p.category_id == category_id);
                }
                await setCache(cacheKey, products, 300);
                return res.json(products);
            }
            return res.status(500).json({ error: err.message });
        }
        
        const products = dbRes.rows;
        await setCache(cacheKey, products, 300);
        res.json(products);
    });
});

// 3. Get Single Product (using Redis cache)
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `catalog:product:${id}`;

    // Attempt cache retrieval
    const cachedProduct = await getCache(cacheKey);
    if (cachedProduct) {
        logger.info('Cache hit for product details id: %s', id);
        return res.json(cachedProduct);
    }

    logger.info('Cache miss for product details id: %s. Fetching from database...', id);

    if (getUseMockDb()) {
        const prod = mockProducts.find(p => p.id == id);
        if (!prod) return res.status(404).json({ message: 'Product not found' });
        await setCache(cacheKey, prod, 300);
        return res.json(prod);
    }

    db.query('SELECT * FROM products WHERE id = $1', [id], async (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (dbRes.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        
        const prod = dbRes.rows[0];
        await setCache(cacheKey, prod, 300);
        res.json(prod);
    });
});

module.exports = router;
