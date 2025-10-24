/**
 * Rate limiter para controlar concurrencia y velocidad de requests
 */
const pLimit = require('p-limit');

class RateLimiter {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 3;
    this.delayBetweenRequests = options.delayBetweenRequests || 100; // ms
    this.limiter = pLimit(this.maxConcurrent);
  }

  /**
   * Ejecuta una función con rate limiting
   */
  async run(fn) {
    return this.limiter(async () => {
      const result = await fn();

      // Delay entre requests
      if (this.delayBetweenRequests > 0) {
        await this.delay(this.delayBetweenRequests);
      }

      return result;
    });
  }

  /**
   * Ejecuta múltiples funciones en paralelo con rate limiting
   */
  async runAll(functions) {
    return Promise.all(
      functions.map(fn => this.run(fn))
    );
  }

  /**
   * Helper para crear delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Actualiza la configuración del rate limiter
   */
  setConfig(options) {
    if (options.maxConcurrent !== undefined) {
      this.maxConcurrent = options.maxConcurrent;
      this.limiter = pLimit(this.maxConcurrent);
    }
    if (options.delayBetweenRequests !== undefined) {
      this.delayBetweenRequests = options.delayBetweenRequests;
    }
  }
}

module.exports = RateLimiter;
