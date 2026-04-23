const express = require('express');
const { createLogger } = require('../utils/logger');
const { getMetrics } = require('../utils/metrics');

const router = express.Router();
const logger = createLogger('HealthRouter');

// GET /health - Return server health status and stats
router.get('/', (req, res) => {
  try {
    const metrics = getMetrics();

    const healthData = {
      serverId: global.serverId,
      cpuUsage: metrics.cpuUsage,
      memoryUsage: metrics.memoryUsage,
      activeConnections: metrics.activeConnections,
      timestamp: Date.now(),
      totalRequests: metrics.totalRequests,
      totalErrors: metrics.totalErrors
    };

    logger.debug('Health check requested', healthData);

    res.json(healthData);
  } catch (error) {
    logger.error('Error in health check', error);
    res.status(500).json({
      error: 'Health check failed',
      message: error.message
    });
  }
});

module.exports = router;
