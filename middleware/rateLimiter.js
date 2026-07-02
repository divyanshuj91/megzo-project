const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300, // Limit each IP to 300 requests per minute
    message: {
        message: 'Too many requests from this IP, please try again after a minute'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15, // Limit each IP to 15 authentication/registration attempts per minute
    message: {
        message: 'Too many authentication attempts. Please try again after a minute'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    generalLimiter,
    authLimiter
};
