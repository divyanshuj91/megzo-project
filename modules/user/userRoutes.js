const express = require('express');
const bcrypt = require('bcrypt');
const { db, getUseMockDb, setUseMockDb, mockUsers } = require('../../config/config');
const { authLimiter } = require('../../middleware/rateLimiter');
const logger = require('../../config/logger');

const router = express.Router();

// 1. Registration Route (protected with auth rate limiting)
router.post('/register', authLimiter, async (req, res) => {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (getUseMockDb()) {
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
                    setUseMockDb(true);
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

// 2. Login Route (protected with auth rate limiting)
router.post('/login', authLimiter, (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (getUseMockDb()) {
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
                setUseMockDb(true);
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

// 3. Update User Profile
router.put('/users/:id/profile', (req, res) => {
    const { id } = req.params;
    const { name, address, contact_number, location, profile_picture } = req.body;

    if (!name && !address && !contact_number && !location && !profile_picture) {
        return res.status(400).json({ message: 'At least one field is required to update profile' });
    }

    if (contact_number && contact_number.trim().length < 10) {
        return res.status(400).json({ message: 'Contact number must be at least 10 characters' });
    }

    if (getUseMockDb()) {
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

module.exports = router;
