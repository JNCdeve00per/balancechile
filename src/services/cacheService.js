const redis = require('redis');
const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    this.redisClient = null;
    this.nodeCache = new NodeCache({ stdTTL: 3600 }); // 1 hour default TTL
    this.initRedis();
  }

  async initRedis() {
    try {
      // Only attempt Redis connection if explicitly enabled
      if (process.env.REDIS_URL && process.env.USE_REDIS !== 'false') {
        this.redisClient = redis.createClient({
          url: process.env.REDIS_URL,
          socket: {
            reconnectStrategy: false // Disable automatic reconnection
          }
        });
        
        this.redisClient.on('error', (err) => {
          console.warn('Redis Client Error:', err.message);
          if (this.redisClient) {
            this.redisClient.disconnect().catch(() => {});
            this.redisClient = null;
          }
          console.log('Falling back to in-memory cache');
        });

        await this.redisClient.connect();
        console.log('✅ Redis connected successfully');
      } else {
        console.log('ℹ️  Using in-memory cache (Redis disabled)');
      }
    } catch (error) {
      console.warn('Redis connection failed, using in-memory cache:', error.message);
      if (this.redisClient) {
        this.redisClient.disconnect().catch(() => {});
      }
      this.redisClient = null;
    }
  }

  async get(key) {
    try {
      if (this.redisClient && this.redisClient.isOpen) {
        const result = await this.redisClient.get(key);
        return result ? JSON.parse(result) : null;
      }
      return this.nodeCache.get(key) || null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (this.redisClient && this.redisClient.isOpen) {
        await this.redisClient.setEx(key, ttl, JSON.stringify(value));
      } else {
        this.nodeCache.set(key, value, ttl);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      if (this.redisClient && this.redisClient.isOpen) {
        await this.redisClient.del(key);
      } else {
        this.nodeCache.del(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async flush() {
    try {
      if (this.redisClient && this.redisClient.isOpen) {
        await this.redisClient.flushAll();
      } else {
        this.nodeCache.flushAll();
      }
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }
}

module.exports = new CacheService();

