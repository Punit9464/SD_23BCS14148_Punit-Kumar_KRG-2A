const express = require('express');
const axios = require('axios');
const { createLogger } = require('./utils/logger');
const { initMemcachedClient } = require('./services/memcachedClient');
const { startHealthCheck } = require('./services/healthChecker');
const { WeightedRoundRobin } = require('./services/weightedRoundRobin');
const statsRouter = require('./routes/stats');
const routeRouter = require('./routes/route');

const app = express();
const logger = createLogger('LoadBalancer');

// Configuration
const LB_PORT = 8080;
const BACKEND_SERVERS = [
  { id: 'server-1', url: 'http://localhost:8081' },
  { id: 'server-2', url: 'http://localhost:8082' },
  { id: 'server-3', url: 'http://localhost:8083' }
];

// Middleware
app.use(express.json());

// Global state
global.backendServers = BACKEND_SERVERS;
global.memcachedClient = null;
global.wrr = new WeightedRoundRobin(BACKEND_SERVERS.map(s => s.id));
global.healthStatus = {};

// Initialize health status
BACKEND_SERVERS.forEach(server => {
  global.healthStatus[server.id] = true;
});

// Routes
app.use('/api/stats', statsRouter);
app.use('/route', routeRouter);

// Health check for LB itself
app.get('/health/lb', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    backends: global.healthStatus
  });
});

// Initialize services
async function initializeServices() {
  try {
    logger.info('Initializing Memcached client...');
    global.memcachedClient = initMemcachedClient();
    
    // Check if Memcached is available (with timeout)
    await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        logger.warn('⚠️  Memcached connection timeout - using in-memory fallback');
        resolve();
      }, 2000);
      
      if (global.memcachedClient.ping) {
        global.memcachedClient.ping(() => {
          clearTimeout(timeout);
          resolve();
        });
      } else {
        clearTimeout(timeout);
        resolve();
      }
    });
    
    logger.info('Starting health check system...');
    startHealthCheck(BACKEND_SERVERS);
    
    logger.success('✅ All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await initializeServices();
    
    app.listen(LB_PORT, () => {
      logger.info(`✅ Load Balancer running on port ${LB_PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  if (global.memcachedClient) {
    global.memcachedClient.end();
  }
  process.exit(0);
});

startServer();
