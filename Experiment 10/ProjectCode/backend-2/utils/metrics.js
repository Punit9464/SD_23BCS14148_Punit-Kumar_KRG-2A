const os = require('os');

const initializeMetrics = () => {
  return {
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    totalRequests: 0,
    totalErrors: 0,
    startTime: Date.now()
  };
};

const getMetrics = () => {
  const metrics = global.metrics;

  // Simulate CPU usage (random between 20-90)
  metrics.cpuUsage = Math.floor(Math.random() * 70) + 20;

  // Simulate memory usage (random between 30-80)
  metrics.memoryUsage = Math.floor(Math.random() * 50) + 30;

  return metrics;
};

const incrementActiveConnections = () => {
  if (global.metrics) {
    global.metrics.activeConnections++;
  }
};

const decrementActiveConnections = () => {
  if (global.metrics) {
    global.metrics.activeConnections = Math.max(0, global.metrics.activeConnections - 1);
  }
};

const incrementTotalRequests = () => {
  if (global.metrics) {
    global.metrics.totalRequests++;
  }
};

const incrementTotalErrors = () => {
  if (global.metrics) {
    global.metrics.totalErrors++;
  }
};

module.exports = {
  initializeMetrics,
  getMetrics,
  incrementActiveConnections,
  decrementActiveConnections,
  incrementTotalRequests,
  incrementTotalErrors
};
