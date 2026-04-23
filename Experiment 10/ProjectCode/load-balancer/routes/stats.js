const express = require('express');
const { createLogger } = require('../utils/logger');
const { getMemcachedValue, setMemcachedValue } = require('../services/memcachedClient');

const router = express.Router();
const logger = createLogger('StatsRouter');

// POST /api/stats - Receive stats from backend servers
router.post('/', async (req, res) => {
  try {
    const { serverId, cpuUsage, memoryUsage, activeConnections, timestamp } = req.body;

    // Validate required fields
    if (!serverId) {
      return res.status(400).json({ error: 'serverId is required' });
    }

    logger.debug('Received stats from backend', {
      serverId,
      cpuUsage,
      memoryUsage,
      activeConnections,
      timestamp
    });

    // Get existing stats from Memcached
    let allStats = {};
    try {
      const existingStats = await getMemcachedValue(global.memcachedClient, 'servers');
      if (existingStats) {
        allStats = existingStats;
      }
    } catch (error) {
      logger.warn('Failed to retrieve existing stats from Memcached', error.message);
    }

    // Update stats for this server
    allStats[serverId] = {
      cpuUsage: cpuUsage || 0,
      memoryUsage: memoryUsage || 0,
      activeConnections: activeConnections || 0,
      lastUpdated: timestamp || Date.now()
    };

    // Store updated stats in Memcached (60 second expiration)
    try {
      await setMemcachedValue(global.memcachedClient, 'servers', allStats, 60);
      
      logger.debug('Stats stored in Memcached', allStats);

      // Update WRR weights with new stats
      global.wrr.updateWeights(allStats, global.healthStatus);

      res.json({
        success: true,
        message: 'Stats received and stored'
      });
    } catch (error) {
      logger.error('Failed to store stats in Memcached', error);
      res.status(500).json({
        error: 'Failed to store stats',
        message: error.message
      });
    }
  } catch (error) {
    logger.error('Error processing stats', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/stats - Get current stats snapshot
router.get('/', async (req, res) => {
  try {
    let stats = {};
    try {
      stats = await getMemcachedValue(global.memcachedClient, 'servers') || {};
    } catch (error) {
      logger.warn('Failed to retrieve stats from Memcached', error.message);
    }

    res.json({
      stats,
      weights: global.wrr.weights,
      healthStatus: global.healthStatus,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Error retrieving stats', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
