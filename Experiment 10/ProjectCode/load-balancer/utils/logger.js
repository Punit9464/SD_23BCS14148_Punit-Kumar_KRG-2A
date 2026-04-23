const createLogger = (serviceName) => {
  const timestamp = () => new Date().toISOString();
  
  return {
    info: (message, data = '') => {
      console.log(`[${timestamp()}] [${serviceName}] ℹ️  ${message}`, data ? JSON.stringify(data) : '');
    },
    error: (message, error = '') => {
      console.error(`[${timestamp()}] [${serviceName}] ❌ ${message}`, error ? error.message || JSON.stringify(error) : '');
    },
    warn: (message, data = '') => {
      console.warn(`[${timestamp()}] [${serviceName}] ⚠️  ${message}`, data ? JSON.stringify(data) : '');
    },
    debug: (message, data = '') => {
      if (process.env.DEBUG) {
        console.log(`[${timestamp()}] [${serviceName}] 🐛 ${message}`, data ? JSON.stringify(data) : '');
      }
    },
    success: (message, data = '') => {
      console.log(`[${timestamp()}] [${serviceName}] ✅ ${message}`, data ? JSON.stringify(data) : '');
    }
  };
};

module.exports = { createLogger };
