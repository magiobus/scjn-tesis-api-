/**
 * Cliente HTTP con retry logic y manejo de errores
 */
const axios = require('axios');
const pRetry = require('p-retry');

class HttpClient {
  constructor(options = {}) {
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.debug = options.debug || false;

    this.client = axios.create({
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'scjn-tesis-api/1.0.0'
      }
    });
  }

  /**
   * Realiza una petición GET con retry logic
   */
  async get(url, config = {}) {
    return this._request(() => this.client.get(url, config));
  }

  /**
   * Realiza una petición POST con retry logic
   */
  async post(url, data, config = {}) {
    return this._request(() => this.client.post(url, data, config));
  }

  /**
   * Wrapper para requests con retry logic
   */
  async _request(requestFn) {
    return pRetry(
      async () => {
        try {
          const response = await requestFn();

          if (this.debug) {
            console.log('✅ Request exitoso:', response.config.url);
          }

          return response.data;
        } catch (error) {
          if (this.debug) {
            console.error('❌ Request falló:', error.message);
          }

          // Si es un error 4xx, no reintentar
          if (error.response && error.response.status >= 400 && error.response.status < 500) {
            throw new pRetry.AbortError(error.message);
          }

          throw error;
        }
      },
      {
        retries: this.retries,
        minTimeout: this.retryDelay,
        onFailedAttempt: error => {
          if (this.debug) {
            console.log(
              `Intento ${error.attemptNumber} falló. ${error.retriesLeft} intentos restantes.`
            );
          }
        }
      }
    );
  }

  /**
   * Establece el modo debug
   */
  setDebug(enabled) {
    this.debug = enabled;
  }
}

module.exports = HttpClient;
