const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('.')); // Serve static files from root

// Database Connection
// NOTE: Replace these values with your actual MySQL database credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Default XAMPP/MySQL user
    password: 'root1234',      // Default XAMPP password is empty
    database: 'magikart'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// --- ROUTES ---

// 1. Registration Route
app.post('/api/register', async (req, res) => {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkQuery, [email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(409).json({ message: 'Email already registered' });
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user
            const insertQuery = 'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [fullname, email, hashedPassword, role], (err, result) => {
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

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Verify Password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify Role (Optional: Check if the user is logging in with the correct role)
        if (user.role !== role) {
            return res.status(403).json({ message: `Please login as a ${user.role}` });
        }

        // Login Successful
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role,
                address: user.address,
                contact_number: user.contact_number
            }
        });
    });
});

// 3. Get Categories
app.get('/api/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Get Products (with optional category filter)
app.get('/api/products', (req, res) => {
    const { category_id } = req.query;
    let query = 'SELECT * FROM products';
    let params = [];

    if (category_id) {
        query += ' WHERE category_id = ?';
        params.push(category_id);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. Get Single Product
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(results[0]);
    });
});

// 6. Get Cart
app.get('/api/cart', (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'User ID required' });

    const query = `
        SELECT c.id, c.quantity, p.* 
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `;
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 7. Add to Cart
app.post('/api/cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id) return res.status(400).json({ message: 'User ID and Product ID required' });

    // Check if item exists
    const checkQuery = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
    db.query(checkQuery, [user_id, product_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            // Update quantity
            const newQuantity = results[0].quantity + (quantity || 1);
            db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, results[0].id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Cart updated' });
            });
        } else {
            // Insert new item
            db.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity || 1], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Added to cart' });
            });
        }
    });
});

// 8. Remove from Cart
app.delete('/api/cart/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cart_items WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removed from cart' });
    });
});

// 9. Update User Profile (Address & Contact)
app.put('/api/users/:id/profile', (req, res) => {
    const { id } = req.params;
    const { address, contact_number } = req.body;

    if (!address && !contact_number) {
        return res.status(400).json({ message: 'At least one field (address or contact_number) is required' });
    }

    // Validate contact number format if provided (more flexible - allow any format with minimum length)
    if (contact_number && contact_number.trim().length < 10) {
        return res.status(400).json({ message: 'Contact number must be at least 10 characters' });
    }

    let updateFields = [];
    let params = [];

    if (address !== undefined) {
        updateFields.push('address = ?');
        params.push(address);
    }

    if (contact_number !== undefined) {
        updateFields.push('contact_number = ?');
        params.push(contact_number);
    }

    params.push(id);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch updated user data
        db.query('SELECT id, full_name, email, role, address, contact_number FROM users WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                message: 'Profile updated successfully',
                user: results[0]
            });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});