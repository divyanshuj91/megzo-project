const { Client } = require('pg');

const pgConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root1234',
    port: parseInt(process.env.DB_PORT || '5432', 10)
};

async function setupDatabase() {
    let client;
    try {
        // Connect to default 'postgres' database first to create 'magikart'
        client = new Client({ ...pgConfig, database: 'postgres' });
        await client.connect();
        console.log('Connected to default PostgreSQL database.');

        // Check if 'magikart' database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'magikart'");
        if (res.rows.length === 0) {
            // Database doesn't exist, create it
            await client.query('CREATE DATABASE magikart');
            console.log('Database "magikart" created successfully.');
        } else {
            console.log('Database "magikart" already exists.');
        }
        await client.end();

        // Connect to the newly created/existing 'magikart' database
        client = new Client({ ...pgConfig, database: 'magikart' });
        await client.connect();
        console.log('Connected to "magikart" database.');

        // Create Tables
        console.log('Creating tables...');
        
        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'seller')),
                address TEXT,
                contact_number VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Categories Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                slug VARCHAR(100) NOT NULL UNIQUE,
                image_url VARCHAR(255)
            )
        `);

        // Products Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                original_price DECIMAL(10, 2),
                discount_percentage INT,
                image_url VARCHAR(255),
                rating DECIMAL(2, 1) DEFAULT 4.0,
                review_count INT DEFAULT 0,
                is_assured BOOLEAN DEFAULT FALSE
            )
        `);

        // Cart Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                product_id INT REFERENCES products(id) ON DELETE CASCADE,
                quantity INT DEFAULT 1
            )
        `);

        console.log('Tables created or verified.');

        // Seed Categories
        console.log('Seeding categories...');
        await client.query(
            `INSERT INTO categories (name, slug, image_url) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (name) DO NOTHING`,
            ['Electronics', 'electronics', 'images/laptop.png']
        );
        console.log('Categories seeded.');

        // Get Category ID for 'electronics'
        const catRes = await client.query("SELECT id FROM categories WHERE slug = 'electronics'");
        const electronicsId = catRes.rows[0].id;

        // Clear existing products & cart to avoid duplicates if re-running
        await client.query('DELETE FROM cart_items');
        await client.query('DELETE FROM products');

        // Seed Products
        console.log('Seeding products...');
        const products = [
            [electronicsId, 'Premium Smartphone', 'High-performance smartphone with advanced camera system and long battery life.', 69999, 79999, 12, 'images/smartphone.png', 4.8, 120, true],
            [electronicsId, 'Ultra-Slim Laptop', 'Lightweight and powerful laptop perfect for work and creativity.', 84999, 99999, 15, 'images/laptop.png', 4.7, 85, true],
            [electronicsId, 'Wireless Headphones', 'Noise-canceling over-ear headphones with immersive sound quality.', 14999, 19999, 25, 'images/headphones.png', 4.6, 200, true],
            [electronicsId, 'Smart Fitness Watch', 'Track your health and fitness goals with this advanced smartwatch.', 4999, 9999, 50, 'images/smartwatch.png', 4.5, 300, true],
            [electronicsId, 'Pro Tablet', 'Versatile tablet for productivity and entertainment on the go.', 35999, 45999, 21, 'images/tablet.png', 4.4, 150, true],
            [electronicsId, 'Gaming Console', 'Next-gen gaming console for the ultimate gaming experience.', 49990, 54990, 9, 'images/laptop.png', 4.9, 500, true],
            [electronicsId, '4K Smart TV', 'Experience cinematic visuals with this stunning 4K Smart TV.', 32999, 59999, 45, 'images/laptop.png', 4.3, 90, true],
            [electronicsId, 'Bluetooth Speaker', 'Portable speaker with deep bass and 24-hour battery life.', 2999, 4999, 40, 'images/headphones.png', 4.2, 110, true]
        ];

        for (const prod of products) {
            await client.query(
                `INSERT INTO products (category_id, title, description, price, original_price, discount_percentage, image_url, rating, review_count, is_assured) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                prod
            );
        }
        console.log('Products seeded.');
        console.log('Database initialization completed successfully.');

    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        if (client) {
            try {
                await client.end();
            } catch (err) {
                // Ignore end errors
            }
        }
    }
}

setupDatabase();
