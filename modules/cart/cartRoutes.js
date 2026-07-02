const express = require('express');
const { db, getUseMockDb, mockCartItems, mockProducts } = require('../../config/config');
const logger = require('../../config/logger');

const router = express.Router();

// 1. Get Cart Items
router.get('/cart', (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'User ID required' });

    if (getUseMockDb()) {
        const userCart = mockCartItems.filter(item => item.user_id == user_id).map(item => {
            const product = mockProducts.find(p => p.id == item.product_id);
            return {
                id: item.id,
                quantity: item.quantity,
                ...product
            };
        });
        return res.json(userCart);
    }

    const query = `
        SELECT c.id, c.quantity, p.* 
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = $1
    `;
    db.query(query, [user_id], (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(dbRes.rows);
    });
});

// 2. Add to Cart / Update Cart
router.post('/cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id) return res.status(400).json({ message: 'User ID and Product ID required' });

    if (getUseMockDb()) {
        const existing = mockCartItems.find(item => item.user_id == user_id && item.product_id == product_id);
        if (existing) {
            existing.quantity += (quantity || 1);
        } else {
            mockCartItems.push({
                id: mockCartItems.length + 1,
                user_id: user_id,
                product_id: product_id,
                quantity: quantity || 1
            });
        }
        return res.json({ message: 'Added to cart' });
    }

    const checkQuery = 'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2';
    db.query(checkQuery, [user_id, product_id], (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });

        if (dbRes.rows.length > 0) {
            const newQuantity = dbRes.rows[0].quantity + (quantity || 1);
            db.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [newQuantity, dbRes.rows[0].id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Cart updated' });
            });
        } else {
            db.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)', [user_id, product_id, quantity || 1], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Added to cart' });
            });
        }
    });
});

// 3. Remove from Cart
router.delete('/cart/:id', (req, res) => {
    const { id } = req.params;
    
    if (getUseMockDb()) {
        const index = mockCartItems.findIndex(item => item.id == id);
        if (index !== -1) {
            mockCartItems.splice(index, 1);
        }
        return res.json({ message: 'Item removed from cart' });
    }
    
    db.query('DELETE FROM cart_items WHERE id = $1', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removed from cart' });
    });
});

module.exports = router;
