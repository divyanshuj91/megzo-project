const express = require('express');
const { db, getUseMockDb, setUseMockDb, mockCategories, mockProducts } = require('../../config/config');
const { getCache, setCache, invalidateCache } = require('../../config/redis');
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

// 4. Create Product (Seller only)
router.post('/products', async (req, res) => {
    const { category_id, title, description, price, original_price, discount_percentage, image_url, seller_id } = req.body;

    if (!title || !price || !category_id) {
        return res.status(400).json({ message: 'Title, price, and category_id are required' });
    }

    if (getUseMockDb()) {
        const newProduct = {
            id: mockProducts.length + 1,
            category_id: parseInt(category_id),
            title,
            description,
            price: parseFloat(price),
            original_price: original_price ? parseFloat(original_price) : null,
            discount_percentage: discount_percentage ? parseInt(discount_percentage) : null,
            image_url: image_url || 'https://via.placeholder.com/300?text=No+Image',
            rating: 4.0,
            review_count: 0,
            is_assured: false,
            seller_id: seller_id ? parseInt(seller_id) : null
        };
        mockProducts.push(newProduct);
        await invalidateCache('catalog:products:*');
        return res.status(201).json({ message: 'Product created successfully', product: newProduct });
    }

    const query = `
        INSERT INTO products (category_id, title, description, price, original_price, discount_percentage, image_url, seller_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const params = [category_id, title, description, price, original_price, discount_percentage, image_url, seller_id];

    db.query(query, params, async (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });
        await invalidateCache('catalog:products:*');
        res.status(201).json({ message: 'Product created successfully', product: dbRes.rows[0] });
    });
});

// 5. Update Product (Seller only)
router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { category_id, title, description, price, original_price, discount_percentage, image_url } = req.body;

    if (getUseMockDb()) {
        const product = mockProducts.find(p => p.id == id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (category_id !== undefined) product.category_id = parseInt(category_id);
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (original_price !== undefined) product.original_price = parseFloat(original_price);
        if (discount_percentage !== undefined) product.discount_percentage = parseInt(discount_percentage);
        if (image_url !== undefined) product.image_url = image_url;

        await invalidateCache(`catalog:product:${id}`);
        await invalidateCache('catalog:products:*');
        return res.json({ message: 'Product updated successfully', product });
    }

    let updateFields = [];
    let params = [];
    let paramIndex = 1;

    if (category_id !== undefined) {
        updateFields.push(`category_id = $${paramIndex++}`);
        params.push(category_id);
    }
    if (title !== undefined) {
        updateFields.push(`title = $${paramIndex++}`);
        params.push(title);
    }
    if (description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        params.push(description);
    }
    if (price !== undefined) {
        updateFields.push(`price = $${paramIndex++}`);
        params.push(price);
    }
    if (original_price !== undefined) {
        updateFields.push(`original_price = $${paramIndex++}`);
        params.push(original_price);
    }
    if (discount_percentage !== undefined) {
        updateFields.push(`discount_percentage = $${paramIndex++}`);
        params.push(discount_percentage);
    }
    if (image_url !== undefined) {
        updateFields.push(`image_url = $${paramIndex++}`);
        params.push(image_url);
    }

    params.push(id);
    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    db.query(query, params, async (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (dbRes.rowCount === 0) return res.status(404).json({ message: 'Product not found' });

        await invalidateCache(`catalog:product:${id}`);
        await invalidateCache('catalog:products:*');
        res.json({ message: 'Product updated successfully', product: dbRes.rows[0] });
    });
});

// 6. Delete Product (Seller only)
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    if (getUseMockDb()) {
        const index = mockProducts.findIndex(p => p.id == id);
        if (index === -1) return res.status(404).json({ message: 'Product not found' });
        mockProducts.splice(index, 1);

        await invalidateCache(`catalog:product:${id}`);
        await invalidateCache('catalog:products:*');
        return res.json({ message: 'Product deleted successfully' });
    }

    db.query('DELETE FROM products WHERE id = $1', [id], async (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (dbRes.rowCount === 0) return res.status(404).json({ message: 'Product not found' });

        await invalidateCache(`catalog:product:${id}`);
        await invalidateCache('catalog:products:*');
        res.json({ message: 'Product deleted successfully' });
    });
});

// 7. Get Seller Products
router.get('/seller/products', async (req, res) => {
    const { seller_id } = req.query;
    if (!seller_id) return res.status(400).json({ message: 'Seller ID required' });

    if (getUseMockDb()) {
        const sellerProducts = mockProducts.filter(p => p.seller_id == seller_id);
        return res.json(sellerProducts);
    }

    const query = 'SELECT * FROM products WHERE seller_id = $1';
    db.query(query, [seller_id], (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(dbRes.rows);
    });
});

module.exports = router;
