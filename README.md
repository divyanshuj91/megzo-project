# MEGZO - Online Shopping Site


A full-featured e-commerce web application built with a modern frontend and a robust Node.js backend.

*This was my skillx project for college and this is my first full stack project on github*

## Features

- **User Authentication**: Secure signup and login functionality with role-based access (Customer/Seller).
- **Product Listing**: Browse products with filtering by category.
- **Shopping Cart**: Add items to cart, view cart, and remove items.
- **User Profile**: Manage address and contact details.
- **Responsive Design**: Modern UI with glassmorphism effects.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: bcrypt for password hashing

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (or XAMPP/WAMP for local development)

## Installation

1.  **Clone the repository** (or download the source code).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Database Setup**:
    - Ensure your MySQL server is running.
    - Configure the database credentials in `server.js` and `setup_db.js` if they differ from the defaults (User: `root`, Password: `root1234`).
    - Run the setup script to create the database and seed initial data:
      ```bash
      node setup_db.js
      ```

## Usage

1.  **Start the server**:
    ```bash
    node server.js
    ```
2.  **Open the application**:
    - Open your browser and navigate to `http://localhost:3000/homepage.html`.

## API Endpoints

### Authentication
- `POST /api/register`: Register a new user.
- `POST /api/login`: Login an existing user.

### Products
- `GET /api/categories`: Get all product categories.
- `GET /api/products`: Get all products (supports `category_id` query param).
- `GET /api/products/:id`: Get details of a single product.

### Cart
- `GET /api/cart?user_id={id}`: Get cart items for a user.
- `POST /api/cart`: Add an item to the cart.
- `DELETE /api/cart/:id`: Remove an item from the cart.

### User Profile
- `PUT /api/users/:id/profile`: Update user address and contact number.

## Project Structure

- `server.js`: Main backend server entry point.
- `setup_db.js`: Script to initialize database schema and seed data.
- `homepage.html/js/css`: Homepage implementation.
- `product_listing.html/js/css`: Product listing page implementation.
- `mycart.html/js/css`: Shopping cart page implementation.
- `login.html`, `signup.html`: Authentication pages.
