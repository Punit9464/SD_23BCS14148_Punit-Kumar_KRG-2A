const { createLogger } = require('../utils/logger');

const logger = createLogger('WeightedRoundRobin');

class WeightedRoundRobin {
  constructor(serverIds) {
    this.serverIds = serverIds;
    this.weights = {};
    this.currentIndex = 0;
    this.currentWeight = 0;
    this.gcdWeight = 1;
    
    // Initialize weights
    serverIds.forEach(id => {
      this.weights[id] = 1;
    });
  }

  // Calculate GCD for normalizing weights
  gcd(a, b) {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  // Calculate GCD across multiple numbers
  gcdArray(arr) {
    if (arr.length === 0) return 1;
    return arr.reduce((acc, val) => this.gcd(acc, val));
  }

  // Calculate scores and weights based on server stats
  updateWeights(serverStats, healthStatus) {
    const healthyServers = this.serverIds.filter(id => healthStatus[id]);
    
    if (healthyServers.length === 0) {
      logger.warn('No healthy servers available');
      return;
    }

    const scores = {};
    const rawWeights = {};

    // Calculate scores for each server
    healthyServers.forEach(serverId => {
      const stats = serverStats[serverId];
      
      if (stats) {
        const score = 
          0.5 * stats.activeConnections + 
          0.3 * stats.cpuUsage + 
          0.2 * stats.memoryUsage;

        // Weight is inverse of score (lower load = higher weight)
        rawWeights[serverId] = 1 / (1 + score);
      } else {
        rawWeights[serverId] = 1;
      }
      scores[serverId] = scores[serverId] || {};
    });

    // Normalize weights
    const totalWeight = Object.values(rawWeights).reduce((a, b) => a + b, 0);
    const normalizedWeights = {};
    
    healthyServers.forEach(id => {
      normalizedWeights[id] = totalWeight > 0 
        ? (rawWeights[id] / totalWeight) * healthyServers.length 
        : 1;
    });

    // Convert to integers for proper WRR
    const multipleFactor = 100;
    const intWeights = {};
    healthyServers.forEach(id => {
      intWeights[id] = Math.round(normalizedWeights[id] * multipleFactor);
    });

    // Calculate GCD
    const weightValues = Object.values(intWeights);
    this.gcdWeight = this.gcdArray(weightValues);

    // Store normalized weights
    this.weights = {};
    healthyServers.forEach(id => {
      this.weights[id] = intWeights[id] / this.gcdWeight;
    });

    logger.debug('Weights updated', {
      rawWeights,
      normalizedWeights,
      intWeights,
      gcdWeight: this.gcdWeight,
      finalWeights: this.weights
    });
  }

  // Select next server using Weighted Round Robin
  selectServer(healthStatus) {
    const healthyServers = this.serverIds.filter(id => healthStatus[id]);
    
    if (healthyServers.length === 0) {
      logger.error('No healthy servers available for selection');
      return null;
    }

    // If only one healthy server, return it
    if (healthyServers.length === 1) {
      return healthyServers[0];
    }

    const maxWeight = Math.max(...healthyServers.map(id => this.weights[id] || 1));

    while (true) {
      this.currentIndex = (this.currentIndex + 1) % healthyServers.length;

      if (this.currentIndex === 0) {
        this.currentWeight = this.currentWeight - 1;
        if (this.currentWeight <= 0) {
          this.currentWeight = maxWeight;
        }
      }

      const selectedServer = healthyServers[this.currentIndex];
      const weight = this.weights[selectedServer] || 1;

      if (weight >= this.currentWeight) {
        logger.debug('Server selected', {
          serverId: selectedServer,
          weight,
          currentWeight: this.currentWeight,
          healthyServers
        });
        return selectedServer;
      }
    }
  }

  reset() {
    this.currentIndex = 0;
    this.currentWeight = 0;
  }
}

module.exports = { WeightedRoundRobin };
