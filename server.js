const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON bodies with limit for base64 images
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from React production build
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// PostgreSQL Database Connection Pool
const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root1234',
    database: process.env.DB_DATABASE || 'magikart',
    port: parseInt(process.env.DB_PORT || '5432', 10)
});

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

db.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL. Automatically switching to Mock Database Fallback.');
        useMockDb = true;
        return;
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// --- ROUTES ---

// 1. Registration Route
app.post('/api/register', async (req, res) => {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (useMockDb) {
        const exists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = {
                id: mockUsers.length + 1,
                full_name: fullname,
                email: email,
                password: hashedPassword,
                role: role,
                address: '',
                contact_number: '',
                location: '',
                profile_picture: ''
            };
            mockUsers.push(newUser);
            return res.status(201).json({ message: 'User registered successfully (Mock DB)' });
        } catch (err) {
            return res.status(500).json({ message: 'Server error during hashing' });
        }
    }

    try {
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        db.query(checkQuery, [email], async (err, dbRes) => {
            if (err) {
                if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
                    useMockDb = true;
                    // Run fallback register flow
                    const exists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                    if (exists) return res.status(409).json({ message: 'Email already registered' });
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(password, saltRounds);
                    mockUsers.push({
                        id: mockUsers.length + 1,
                        full_name: fullname,
                        email: email,
                        password: hashedPassword,
                        role: role
                    });
                    return res.status(201).json({ message: 'User registered successfully (Mock DB)' });
                }
                return res.status(500).json({ error: err.message });
            }

            if (dbRes.rows.length > 0) {
                return res.status(409).json({ message: 'Email already registered' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertQuery = 'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4)';
            db.query(insertQuery, [fullname, email, hashedPassword, role], (err, dbRes2) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Login Route
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (useMockDb) {
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        bcrypt.compare(password, user.password).then(match => {
            if (!match) return res.status(401).json({ message: 'Invalid email or password' });
            if (user.role !== role) return res.status(403).json({ message: `Please login as a ${user.role}` });
            
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role,
                    address: user.address,
                    contact_number: user.contact_number,
                    location: user.location,
                    profile_picture: user.profile_picture
                }
            });
        }).catch(err => res.status(500).json({ message: 'Login verification failed' }));
        return;
    }

    const query = 'SELECT * FROM users WHERE email = $1';
    db.query(query, [email], async (err, dbRes) => {
        if (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
                useMockDb = true;
                const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                if (!user) return res.status(401).json({ message: 'Invalid email or password' });
                const match = await bcrypt.compare(password, user.password);
                if (!match) return res.status(401).json({ message: 'Invalid email or password' });
                if (user.role !== role) return res.status(403).json({ message: `Please login as a ${user.role}` });
                return res.json({
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        name: user.full_name,
                        email: user.email,
                        role: user.role,
                        address: user.address,
                        contact_number: user.contact_number,
                        location: user.location,
                        profile_picture: user.profile_picture
                    }
                });
            }
            return res.status(500).json({ error: err.message });
        }

        if (dbRes.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = dbRes.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: `Please login as a ${user.role}` });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role,
                address: user.address,
                contact_number: user.contact_number,
                location: user.location,
                profile_picture: user.profile_picture
            }
        });
    });
});

// 3. Get Categories
app.get('/api/categories', (req, res) => {
    if (useMockDb) {
        return res.json(mockCategories);
    }
    db.query('SELECT * FROM categories', (err, dbRes) => {
        if (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
                useMockDb = true;
                return res.json(mockCategories);
            }
            return res.status(500).json({ error: err.message });
        }
        res.json(dbRes.rows);
    });
});

// 4. Get Products (with optional category filter)
app.get('/api/products', (req, res) => {
    const { category_id } = req.query;
    if (useMockDb) {
        if (category_id) {
            return res.json(mockProducts.filter(p => p.category_id == category_id));
        }
        return res.json(mockProducts);
    }

    let query = 'SELECT * FROM products';
    let params = [];

    if (category_id) {
        query += ' WHERE category_id = $1';
        params.push(category_id);
    }

    db.query(query, params, (err, dbRes) => {
        if (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
                useMockDb = true;
                if (category_id) {
                    return res.json(mockProducts.filter(p => p.category_id == category_id));
                }
                return res.json(mockProducts);
            }
            return res.status(500).json({ error: err.message });
        }
        res.json(dbRes.rows);
    });
});

// 5. Get Single Product
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    if (useMockDb) {
        const prod = mockProducts.find(p => p.id == id);
        if (!prod) return res.status(404).json({ message: 'Product not found' });
        return res.json(prod);
    }

    db.query('SELECT * FROM products WHERE id = $1', [id], (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (dbRes.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(dbRes.rows[0]);
    });
});

// 6. Get Cart
app.get('/api/cart', (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'User ID required' });

    if (useMockDb) {
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

// 7. Add to Cart
app.post('/api/cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id) return res.status(400).json({ message: 'User ID and Product ID required' });

    if (useMockDb) {
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

// 8. Remove from Cart
app.delete('/api/cart/:id', (req, res) => {
    const { id } = req.params;
    if (useMockDb) {
        mockCartItems = mockCartItems.filter(item => item.id != id);
        return res.json({ message: 'Item removed from cart' });
    }
    db.query('DELETE FROM cart_items WHERE id = $1', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removed from cart' });
    });
});

// 9. Update User Profile (Name, Address, Contact, Location & Picture)
app.put('/api/users/:id/profile', (req, res) => {
    const { id } = req.params;
    const { name, address, contact_number, location, profile_picture } = req.body;

    if (!name && !address && !contact_number && !location && !profile_picture) {
        return res.status(400).json({ message: 'At least one field is required to update profile' });
    }

    if (contact_number && contact_number.trim().length < 10) {
        return res.status(400).json({ message: 'Contact number must be at least 10 characters' });
    }

    if (useMockDb) {
        const user = mockUsers.find(u => u.id == id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (name !== undefined) user.full_name = name;
        if (address !== undefined) user.address = address;
        if (contact_number !== undefined) user.contact_number = contact_number;
        if (location !== undefined) user.location = location;
        if (profile_picture !== undefined) user.profile_picture = profile_picture;

        return res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role,
                address: user.address,
                contact_number: user.contact_number,
                location: user.location,
                profile_picture: user.profile_picture
            }
        });
    }

    let updateFields = [];
    let params = [];
    let paramIndex = 1;

    if (name !== undefined) {
        updateFields.push(`full_name = $${paramIndex++}`);
        params.push(name);
    }

    if (address !== undefined) {
        updateFields.push(`address = $${paramIndex++}`);
        params.push(address);
    }

    if (contact_number !== undefined) {
        updateFields.push(`contact_number = $${paramIndex++}`);
        params.push(contact_number);
    }

    if (location !== undefined) {
        updateFields.push(`location = $${paramIndex++}`);
        params.push(location);
    }

    if (profile_picture !== undefined) {
        updateFields.push(`profile_picture = $${paramIndex++}`);
        params.push(profile_picture);
    }

    params.push(id);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;

    db.query(query, params, (err, dbRes) => {
        if (err) return res.status(500).json({ error: err.message });

        if (dbRes.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        db.query('SELECT id, full_name, email, role, address, contact_number, location, profile_picture FROM users WHERE id = $1', [id], (err, dbRes2) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const user = dbRes2.rows[0];
            res.json({
                message: 'Profile updated successfully',
                user: {
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role,
                    address: user.address,
                    contact_number: user.contact_number,
                    location: user.location,
                    profile_picture: user.profile_picture
                }
            });
        });
    });
});

// Catch-all route to serve React SPA index.html for non-API requests
app.get('*all', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});