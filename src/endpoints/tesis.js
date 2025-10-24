/**
 * Endpoint para obtener tesis individuales
 */
const { ENDPOINTS, HOST_NAME } = require('../constants/endpoints');

/**
 * Obtiene una tesis por su número IUS
 *
 * IMPORTANTE: El API de SCJN no tiene un endpoint directo para obtener tesis individuales.
 * Esta función usa el endpoint de búsqueda con filtro por IUS.
 *
 * @param {HttpClient} httpClient - Cliente HTTP
 * @param {number} ius - Número IUS de la tesis (ej: 2031337)
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Datos completos de la tesis
 */
async function getTesis(httpClient, ius, options = {}) {
  const { DEFAULT_APP_ID } = require('../constants/classifiers');

  // El API no tiene endpoint /tesis/{id}, debemos usar búsqueda por IUS
  const payload = {
    classifiers: [],
    searchTerms: [],
    bFacet: false,
    ius: [ius],
    idApp: DEFAULT_APP_ID,
    lbSearch: [],
    filterExpression: ''
  };

  const url = `${ENDPOINTS.SEARCH}?size=1&page=0`;
  const response = await httpClient.post(url, payload);

  // Verificar que se encontró la tesis
  if (!response.documents || response.documents.length === 0) {
    throw new Error(`Tesis con IUS ${ius} no encontrada`);
  }

  return response.documents[0];
}

/**
 * Obtiene múltiples tesis por sus números IUS
 * @param {HttpClient} httpClient - Cliente HTTP
 * @param {Array<number>} iusNumbers - Array de números IUS (NO document IDs)
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Array>} Array de tesis
 */
async function getMultipleTesis(httpClient, iusNumbers, options = {}) {
  const promises = iusNumbers.map(ius => getTesis(httpClient, ius, options));
  return Promise.all(promises);
}

module.exports = {
  getTesis,
  getMultipleTesis
};
