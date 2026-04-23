const Memcached = require('memcached');
const { createLogger } = require('../utils/logger');

const logger = createLogger('MemcachedClient');

const initMemcachedClient = () => {
  const client = new Memcached(['localhost:11211']);
  
  client.on('issue', (issue) => {
    logger.warn('Memcached issue', issue);
  });
  
  client.on('failure', (failure) => {
    logger.error('Memcached failure', failure);
  });
  
  return client;
};

// Promisify Memcached operations
const getMemcachedValue = (client, key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const setMemcachedValue = (client, key, value, lifetime = 60) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, lifetime, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const deleteMemcachedValue = (client, key) => {
  return new Promise((resolve, reject) => {
    client.del(key, (err) => {
      if (err) {
        reject(err);
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
  deleteMemcachedValue
};
