const axios = require('axios');
const { createLogger } = require('../utils/logger');
const { getMemcachedValue } = require('./memcachedClient');

const logger = createLogger('HealthChecker');

const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds
const HEALTH_CHECK_TIMEOUT = 3000; // 3 seconds
const MAX_STALE_DURATION = 10000; // 10 seconds

const performHealthCheck = async (server) => {
  try {
    const response = await axios.get(`${server.url}/health`, {
      timeout: HEALTH_CHECK_TIMEOUT
    });

    logger.debug(`Health check passed for ${server.id}`, {
      status: response.status,
      data: response.data
    });

    return {
      healthy: true,
      timestamp: Date.now(),
      data: response.data
    };
  } catch (error) {
    logger.warn(`Health check failed for ${server.id}`, error.message);
    return {
      healthy: false,
      timestamp: Date.now(),
      error: error.message
    };
  }
};

const checkServerStats = async (serverId) => {
  try {
    const stats = await getMemcachedValue(global.memcachedClient, 'servers');
    
    if (!stats || !stats[serverId]) {
      return { stale: true, lastUpdated: 0 };
    }

    const timeSinceLastUpdate = Date.now() - stats[serverId].lastUpdated;
    const isStale = timeSinceLastUpdate > MAX_STALE_DURATION;

    return {
      stale: isStale,
      lastUpdated: stats[serverId].lastUpdated,
      timeSinceLastUpdate
    };
  } catch (error) {
    logger.error(`Failed to check stats for ${serverId}`, error);
    return { stale: true, lastUpdated: 0 };
  }
};

const startHealthCheck = (servers) => {
  const healthCheckLoop = async () => {
    logger.debug('Starting health check cycle...');

    for (const server of servers) {
      try {
        // Perform HTTP health check
        const healthResult = await performHealthCheck(server);
        
        // Check if stats are stale
        const statsCheck = await checkServerStats(server.id);

        // Determine overall health
        const isHealthy = healthResult.healthy && !statsCheck.stale;

        // Update health status
        const wasHealthy = global.healthStatus[server.id];
        global.healthStatus[server.id] = isHealthy;

        // Log status changes
        if (wasHealthy !== isHealthy) {
          const status = isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY';
          logger.info(`${server.id} status changed to ${status}`, {
            httpHealthy: healthResult.healthy,
            statsStale: statsCheck.stale,
            timeSinceLastUpdate: statsCheck.timeSinceLastUpdate
          });
        }

        logger.debug(`${server.id} health status`, {
          healthy: isHealthy,
          httpHealthy: healthResult.healthy,
          statsStale: statsCheck.stale,
          lastUpdated: statsCheck.lastUpdated
        });
      } catch (error) {
        logger.error(`Unexpected error during health check for ${server.id}`, error);
        global.healthStatus[server.id] = false;
      }
    }

    logger.debug('Health check cycle completed', global.healthStatus);
  };

  // Run initial health check immediately
  healthCheckLoop();

  // Then run periodically
  setInterval(healthCheckLoop, HEALTH_CHECK_INTERVAL);
};

module.exports = { startHealthCheck };
