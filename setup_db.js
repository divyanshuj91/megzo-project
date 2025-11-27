const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    multipleStatements: true
};

async function setupDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server.');

        // Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS magikart`);
        console.log('Database "magikart" created or already exists.');

        await connection.query(`USE magikart`);

        // Create Tables
        const createTablesSql = `
            -- Users Table
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('customer', 'seller') DEFAULT 'customer',
                address TEXT,
                contact_number VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Categories Table
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                slug VARCHAR(100) NOT NULL UNIQUE,
                image_url VARCHAR(255)
            );

            -- Products Table
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                original_price DECIMAL(10, 2),
                discount_percentage INT,
                image_url VARCHAR(255),
                rating DECIMAL(2, 1) DEFAULT 4.0,
                review_count INT DEFAULT 0,
                is_assured BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            );

            -- Cart Table
            CREATE TABLE IF NOT EXISTS cart_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                product_id INT,
                quantity INT DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
        `;

        // Seed Categories
        const categories = [
            ['Electronics', 'electronics', 'images/laptop.png']
        ];

        for (const cat of categories) {
            await connection.query(
                `INSERT IGNORE INTO categories (name, slug, image_url) VALUES (?, ?, ?)`,
                cat
            );
        }
        console.log('Categories seeded.');

        // Get Category IDs
        const [catRows] = await connection.query('SELECT id, slug FROM categories');
        const catMap = {};
        catRows.forEach(row => catMap[row.slug] = row.id);

        // Seed Products
        const products = [
            [catMap['electronics'], 'Premium Smartphone', 'High-performance smartphone with advanced camera system and long battery life.', 69999, 79999, 12, 'images/smartphone.png', 4.8, 120, true],
            [catMap['electronics'], 'Ultra-Slim Laptop', 'Lightweight and powerful laptop perfect for work and creativity.', 84999, 99999, 15, 'images/laptop.png', 4.7, 85, true],
            [catMap['electronics'], 'Wireless Headphones', 'Noise-canceling over-ear headphones with immersive sound quality.', 14999, 19999, 25, 'images/headphones.png', 4.6, 200, true],
            [catMap['electronics'], 'Smart Fitness Watch', 'Track your health and fitness goals with this advanced smartwatch.', 4999, 9999, 50, 'images/smartwatch.png', 4.5, 300, true],
            [catMap['electronics'], 'Pro Tablet', 'Versatile tablet for productivity and entertainment on the go.', 35999, 45999, 21, 'images/tablet.png', 4.4, 150, true],
            [catMap['electronics'], 'Gaming Console', 'Next-gen gaming console for the ultimate gaming experience.', 49990, 54990, 9, 'images/laptop.png', 4.9, 500, true],
            [catMap['electronics'], '4K Smart TV', 'Experience cinematic visuals with this stunning 4K Smart TV.', 32999, 59999, 45, 'images/laptop.png', 4.3, 90, true],
            [catMap['electronics'], 'Bluetooth Speaker', 'Portable speaker with deep bass and 24-hour battery life.', 2999, 4999, 40, 'images/headphones.png', 4.2, 110, true]
            [catMap['electronics'], 'Premium Smartphone', 'High-performance smartphone with advanced camera system and long battery life.', 69999, 79999, 12, 'images/smartphone.png', 4.8, 120, true],
            [catMap['electronics'], 'Ultra-Slim Laptop', 'Lightweight and powerful laptop perfect for work and creativity.', 84999, 99999, 15, 'images/laptop.png', 4.7, 85, true],
            [catMap['electronics'], 'Wireless Headphones', 'Noise-canceling over-ear headphones with immersive sound quality.', 14999, 19999, 25, 'images/headphones.png', 4.6, 200, true],
            [catMap['electronics'], 'Smart Fitness Watch', 'Track your health and fitness goals with this advanced smartwatch.', 4999, 9999, 50, 'images/smartwatch.png', 4.5, 300, true],
            [catMap['electronics'], 'Pro Tablet', 'Versatile tablet for productivity and entertainment on the go.', 35999, 45999, 21, 'images/smartphone.png', 4.4, 150, true],
            [catMap['electronics'], 'Gaming Console', 'Next-gen gaming console for the ultimate gaming experience.', 49990, 54990, 9, 'images/laptop.png', 4.9, 500, true],
            [catMap['electronics'], '4K Smart TV', 'Experience cinematic visuals with this stunning 4K Smart TV.', 32999, 59999, 45, 'images/laptop.png', 4.3, 90, true],
            [catMap['electronics'], 'Bluetooth Speaker', 'Portable speaker with deep bass and 24-hour battery life.', 2999, 4999, 40, 'images/headphones.png', 4.2, 110, true]
        ];

        // Clear existing products to avoid duplicates if re-running
        await connection.query('DELETE FROM cart_items');
        await connection.query('DELETE FROM products');
        // Also clear categories except Electronics if needed, but for now just keeping it simple
        // We might want to remove other categories if they exist
        await connection.query("DELETE FROM categories WHERE slug != 'electronics'");

        for (const prod of products) {
            await connection.query(
                `INSERT INTO products (category_id, title, description, price, original_price, discount_percentage, image_url, rating, review_count, is_assured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                prod
            );
        }
        console.log('Products seeded.');

    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
