/**
 * URLs base del API de SCJN
 */
const BASE_URL = 'https://sjf2.scjn.gob.mx/services/sjftesismicroservice/api/public';
const HOST_NAME = 'https://sjf2.scjn.gob.mx';

module.exports = {
  BASE_URL,
  HOST_NAME,
  ENDPOINTS: {
    SEARCH: `${BASE_URL}/tesis`,
    GET_TESIS: (id) => `${BASE_URL}/tesis/${id}`,
    HEALTH: `${BASE_URL}/health`,
    QUERY_FIELD: (appId) => `${BASE_URL}/query-field/${appId}`
  }
};
