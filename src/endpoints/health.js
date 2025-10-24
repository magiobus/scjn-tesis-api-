/**
 * Endpoint de health check
 */
const { ENDPOINTS } = require('../constants/endpoints');

/**
 * Verifica el estado del servicio SCJN
 * @param {HttpClient} httpClient - Cliente HTTP
 * @returns {Promise<Object>} Estado del servicio
 */
async function healthCheck(httpClient) {
  return httpClient.get(ENDPOINTS.HEALTH);
}

module.exports = {
  healthCheck
};
