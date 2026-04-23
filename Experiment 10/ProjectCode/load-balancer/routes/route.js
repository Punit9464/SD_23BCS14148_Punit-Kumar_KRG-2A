const express = require('express');
const axios = require('axios');
const { createLogger } = require('../utils/logger');
const { getMemcachedValue } = require('../services/memcachedClient');

const router = express.Router();
const logger = createLogger('RouteRouter');

const REQUEST_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 2;

// GET /route - Route request to backend using WRR
router.get('/', async (req, res) => {
  try {
    let retryCount = 0;
    let lastError = null;

    while (retryCount < MAX_RETRIES) {
      try {
        // Select server using Weighted Round Robin
        const selectedServer = global.wrr.selectServer(global.healthStatus);

        if (!selectedServer) {
          logger.error('No healthy servers available for routing');
          return res.status(503).json({
            error: 'Service Unavailable',
            message: 'No healthy backend servers available'
          });
        }

        // Get server URL
        const serverUrl = global.backendServers.find(s => s.id === selectedServer).url;

        logger.info('Routing request', {
          selectedServer,
          serverUrl,
          retryCount
        });

        // Log current metrics
        let currentStats = {};
        try {
          currentStats = await getMemcachedValue(global.memcachedClient, 'servers') || {};
        } catch (error) {
          logger.debug('Could not retrieve current stats', error.message);
        }

        logger.debug('Current snapshot', {
          selectedServer,
          stats: currentStats[selectedServer],
          weights: global.wrr.weights,
          healthStatus: global.healthStatus
        });

        // Forward request to backend
        try {
          const response = await axios.get(`${serverUrl}/process`, {
            timeout: REQUEST_TIMEOUT
          });

          logger.success('Request processed successfully', {
            selectedServer,
            statusCode: response.status,
            responseData: response.data
          });

          return res.json({
            server: selectedServer,
            data: response.data,
            timestamp: Date.now()
          });
        } catch (forwardError) {
          logger.warn(`Forward request failed to ${selectedServer}`, forwardError.message);
          lastError = forwardError;
          retryCount++;

          if (retryCount < MAX_RETRIES) {
            logger.info(`Retrying with next server (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            continue;
          }
        }
      } catch (error) {
        logger.error('Error during request routing', error);
        lastError = error;
        retryCount++;
      }
    }

    // All retries exhausted
    logger.error('All retry attempts exhausted', lastError);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Unable to process request after retries',
      lastError: lastError.message
    });
  } catch (error) {
    logger.error('Unexpected error in route handler', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;
