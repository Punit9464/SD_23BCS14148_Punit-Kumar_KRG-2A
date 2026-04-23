const express = require('express');
const { createLogger } = require('./utils/logger');
const { initializeMetrics, getMetrics } = require('./utils/metrics');
const { startStatsPusher } = require('./services/statsPusher');
const healthRouter = require('./routes/health');
const processRouter = require('./routes/process');

const app = express();
const logger = createLogger('Backend-3');

// Configuration
const SERVER_ID = 'server-3';
const PORT = 8083;
const LB_URL = 'http://localhost:8080';

// Global state
global.serverId = SERVER_ID;
global.lbUrl = LB_URL;
global.metrics = initializeMetrics();

// Middleware
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/process', processRouter);

// Health check for all services
app.get('/status', (req, res) => {
  res.json({
    serverId: SERVER_ID,
    status: 'running',
    metrics: global.metrics,
    timestamp: Date.now()
  });
});

// Start server
async function startServer() {
  try {
    app.listen(PORT, () => {
      logger.success(`✅ Backend Server ${SERVER_ID} running on port ${PORT}`);
    });

    // Start stats pusher
    startStatsPusher(SERVER_ID, LB_URL);

  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

startServer();
