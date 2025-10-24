/**
 * Endpoint para obtener tesis individuales
 */
const { ENDPOINTS, HOST_NAME } = require('../constants/endpoints');

/**
 * Obtiene una tesis por su ID
 * @param {HttpClient} httpClient - Cliente HTTP
 * @param {string|number} id - ID de la tesis
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Datos de la tesis
 */
async function getTesis(httpClient, id, options = {}) {
  const { hostName = HOST_NAME } = options;

  // El API usa el IUS number, no el ID del documento
  const url = `${ENDPOINTS.GET_TESIS(id)}?hostName=${hostName}`;

  return httpClient.get(url);
}

/**
 * Obtiene múltiples tesis por sus IDs
 * @param {HttpClient} httpClient - Cliente HTTP
 * @param {Array<string|number>} ids - Array de IDs
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Array>} Array de tesis
 */
async function getMultipleTesis(httpClient, ids, options = {}) {
  const promises = ids.map(id => getTesis(httpClient, id, options));
  return Promise.all(promises);
}

module.exports = {
  getTesis,
  getMultipleTesis
};
