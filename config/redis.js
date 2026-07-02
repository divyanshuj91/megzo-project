const { createClient } = require('redis');
const logger = require('./logger');
const { config } = require('./config');

let redisClient = null;
let isRedisConnected = false;

if (config.redis.url) {
    redisClient = createClient({
        url: config.redis.url,
        socket: {
            reconnectStrategy: (retries) => {
                if (retries > 5) {
                    logger.warn('Redis reconnection failed after 5 attempts. Disabling Redis client.');
                    return false; // Stop reconnecting
                }
                return Math.min(retries * 200, 2000); // Backoff strategy
            }
        }
    });

    redisClient.on('error', (err) => {
        logger.error('Redis connection error: %s', err.message);
        isRedisConnected = false;
    });

    redisClient.on('connect', () => {
        logger.info('Initiating connection to Redis...');
    });

    redisClient.on('ready', () => {
        logger.info('Redis connection established successfully.');
        isRedisConnected = true;
    });

    redisClient.connect().catch(err => {
        logger.warn('Failed to start Redis connection client. Server will bypass cache. %s', err.message);
        isRedisConnected = false;
    });
}

/**
 * Resilient GET from cache
 */
async function getCache(key) {
    if (!isRedisConnected || !redisClient) return null;
    try {
        const val = await redisClient.get(key);
        return val ? JSON.parse(val) : null;
    } catch (err) {
        logger.error('Redis GET exception on key "%s": %s', key, err.message);
        return null;
    }
}

/**
 * Resilient SET to cache
 */
async function setCache(key, value, ttlSeconds = 300) {
    if (!isRedisConnected || !redisClient) return false;
    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: ttlSeconds
        });
        return true;
    } catch (err) {
        logger.error('Redis SET exception on key "%s": %s', key, err.message);
        return false;
    }
}

/**
 * Invalidate cache key or keys matching pattern
 */
async function invalidateCache(keyPattern) {
    if (!isRedisConnected || !redisClient) return false;
    try {
        if (keyPattern.includes('*')) {
            const keys = await redisClient.keys(keyPattern);
            if (keys && keys.length > 0) {
                await redisClient.del(keys);
                logger.info('Deleted keys matching pattern "%s": %o', keyPattern, keys);
            }
        } else {
            await redisClient.del(keyPattern);
            logger.info('Deleted cache key "%s"', keyPattern);
        }
        return true;
    } catch (err) {
        logger.error('Redis delete exception on pattern "%s": %s', keyPattern, err.message);
        return false;
    }
}

module.exports = {
    redisClient,
    getCache,
    setCache,
    invalidateCache,
    getIsConnected: () => isRedisConnected
};
