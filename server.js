const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const { config } = require('./config/config');
const logger = require('./config/logger');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import Modular Routers
const userRoutes = require('./modules/user/userRoutes');
const catalogRoutes = require('./modules/catalog/catalogRoutes');
const cartRoutes = require('./modules/cart/cartRoutes');

const app = express();
const PORT = config.port;

// HTTP Request Logging using Morgan and Winston
app.use(morgan('short', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Apply General Rate Limiting to all requests
app.use(generalLimiter);

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON bodies with limit for base64 images
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from React production build (if built)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Register API Routes
app.use('/api', userRoutes);
app.use('/api', catalogRoutes);
app.use('/api', cartRoutes);

// Catch-all route to serve React SPA index.html for non-API requests
app.get('*all', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled Server Error: %o', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
});

// Start Server
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});