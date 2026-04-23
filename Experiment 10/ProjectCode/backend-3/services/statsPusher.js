const axios = require('axios');
const { createLogger } = require('../utils/logger');
const { getMetrics } = require('../utils/metrics');

const logger = createLogger('StatsPusher');

const STATS_PUSH_INTERVAL = 3000; // 3 seconds

const pushStats = async (serverId, lbUrl) => {
  try {
    const metrics = getMetrics();

    const statsPayload = {
      serverId,
      cpuUsage: metrics.cpuUsage,
      memoryUsage: metrics.memoryUsage,
      activeConnections: metrics.activeConnections,
      timestamp: Date.now()
    };

    logger.debug('Pushing stats to Load Balancer', statsPayload);

    const response = await axios.post(
      `${lbUrl}/api/stats`,
      statsPayload,
      { timeout: 5000 }
    );

    logger.success('Stats pushed successfully', {
      serverId,
      status: response.status,
      stats: statsPayload
    });

    return true;
  } catch (error) {
    logger.error(`Failed to push stats to ${lbUrl}`, error.message);
    return false;
  }
};

const startStatsPusher = (serverId, lbUrl) => {
  logger.info(`Starting stats pusher for ${serverId}`);

  // Push stats immediately
  pushStats(serverId, lbUrl);

  // Then push periodically
  setInterval(() => {
    pushStats(serverId, lbUrl);
  }, STATS_PUSH_INTERVAL);
};

module.exports = { startStatsPusher, pushStats };
