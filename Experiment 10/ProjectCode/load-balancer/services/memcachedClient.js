const Memcached = require('memcached');
const { createLogger } = require('../utils/logger');

const logger = createLogger('MemcachedClient');

// Fallback in-memory cache (when Memcached is unavailable)
const fallbackCache = new Map();
let isMemcachedAvailable = false;

const initMemcachedClient = () => {
  const client = new Memcached(['localhost:11211']);
  
  client.on('issue', (issue) => {
    logger.warn('Memcached issue detected - using in-memory fallback', issue.message);
    isMemcachedAvailable = false;
  });
  
  client.on('failure', (failure) => {
    logger.error('Memcached failure - using in-memory fallback', failure.message);
    isMemcachedAvailable = false;
  });
  
  // Check if Memcached is available
  const ping = (callback) => {
    client.version((err, data) => {
      if (err) {
        isMemcachedAvailable = false;
        logger.info('⚠️  Memcached not available - using in-memory cache fallback');
        callback();
      } else {
        isMemcachedAvailable = true;
        logger.success('✅ Memcached connected successfully');
        callback();
      }
    });
  };
  
  client.ping = ping;
  
  return client;
};

// Promisify Memcached operations with fallback
const getMemcachedValue = (client, key) => {
  return new Promise((resolve, reject) => {
    if (!isMemcachedAvailable) {
      // Use in-memory fallback
      const value = fallbackCache.get(key);
      setTimeout(() => resolve(value || null), 0);
      return;
    }
    
    client.get(key, (err, data) => {
      if (err) {
        logger.debug('Memcached get failed, using fallback', err.message);
        const value = fallbackCache.get(key);
        resolve(value || null);
      } else {
        resolve(data);
      }
    });
  });
};

const setMemcachedValue = (client, key, value, lifetime = 60) => {
  return new Promise((resolve, reject) => {
    // Always store in fallback cache
    fallbackCache.set(key, value);
    
    if (!isMemcachedAvailable) {
      // Just use in-memory cache
      setTimeout(() => resolve(true), 0);
      return;
    }
    
    client.set(key, value, lifetime, (err) => {
      if (err) {
        logger.debug('Memcached set failed, using fallback', err.message);
        resolve(true);
      } else {
        resolve(true);
      }
    });
  });
};

const deleteMemcachedValue = (client, key) => {
  return new Promise((resolve, reject) => {
    fallbackCache.delete(key);
    
    if (!isMemcachedAvailable) {
      setTimeout(() => resolve(true), 0);
      return;
    }
    
    client.del(key, (err) => {
      if (err) {
        logger.debug('Memcached delete failed', err.message);
        resolve(true);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  initMemcachedClient,
  getMemcachedValue,
  setMemcachedValue,
  deleteMemcachedValue,
  isMemcachedHealthy: () => isMemcachedAvailable
};
