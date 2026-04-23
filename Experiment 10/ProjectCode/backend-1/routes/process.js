const express = require('express');
const { createLogger } = require('../utils/logger');
const {
  incrementActiveConnections,
  decrementActiveConnections,
  incrementTotalRequests,
  incrementTotalErrors,
  getMetrics
} = require('../utils/metrics');

const router = express.Router();
const logger = createLogger('ProcessRouter');

// Simulate processing time with random delay
const simulateProcessing = () => {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 400) + 100; // 100-500ms
    setTimeout(resolve, delay);
  });
};

// GET /process - Process a request
router.get('/', async (req, res) => {
  let startTime = Date.now();
  
  try {
    // Increment active connections
    incrementActiveConnections();
    incrementTotalRequests();

    const metrics = getMetrics();

    logger.info('Processing request', {
      serverId: global.serverId,
      activeConnections: metrics.activeConnections
    });

    // Simulate processing
    await simulateProcessing();

    const processingTime = Date.now() - startTime;

    // Decrement active connections
    decrementActiveConnections();

    const responseData = {
      serverId: global.serverId,
      message: `Request processed successfully by ${global.serverId}`,
      processingTime,
      timestamp: Date.now(),
      metrics: {
        cpuUsage: metrics.cpuUsage,
        memoryUsage: metrics.memoryUsage,
        activeConnections: metrics.activeConnections - 1 // Already decremented
      }
    };

    logger.success('Request completed', {
      serverId: global.serverId,
      processingTime,
      activeConnections: metrics.activeConnections
    });

    res.json(responseData);
  } catch (error) {
    incrementTotalErrors();
    decrementActiveConnections();

    logger.error('Error processing request', error);
    res.status(500).json({
      error: 'Processing failed',
      message: error.message,
      serverId: global.serverId
    });
  }
});

module.exports = router;
