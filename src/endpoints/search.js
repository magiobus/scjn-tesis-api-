/**
 * Endpoint de búsqueda de tesis
 */
const {
  convertirEpocas,
  convertirInstancias,
  convertirTipoDocumento,
  generarLabels,
  DEFAULT_APP_ID
} = require('../constants/classifiers');
const { ENDPOINTS } = require('../constants/endpoints');

/**
 * Construye el payload de búsqueda
 */
function buildSearchPayload(options = {}) {
  const {
    epocas = ['12a', '11a', '10a', '9a'],
    instancias = [],
    tipoDocumento = 'Tesis',
    searchTerms = [],
    ius = [],
    filterExpression = '',
    bFacet = true,
    idApp = DEFAULT_APP_ID
  } = options;

  // Convertir épocas a códigos
  const epocasCodigos = convertirEpocas(epocas);

  // Convertir instancias a códigos (si se especifican)
  const instanciasCodigos = instancias.length > 0
    ? convertirInstancias(instancias)
    : ['6', '60', '7', '70', '80', '1', '2', '50']; // Todas por defecto

  // Convertir tipo de documento
  const tipoCodigo = convertirTipoDocumento(tipoDocumento);

  // Generar labels
  const lbSearch = generarLabels(epocas, instancias.length > 0 ? instancias : null);

  // Construir classifiers
  const classifiers = [
    {
      name: 'idEpoca',
      value: epocasCodigos,
      allSelected: false,
      visible: false,
      isMatrix: false
    },
    {
      name: 'numInstancia',
      value: instanciasCodigos,
      allSelected: false,
      visible: false,
      isMatrix: false
    },
    {
      name: 'tipoDocumento',
      value: [tipoCodigo],
      allSelected: false,
      visible: false,
      isMatrix: false
    }
  ];

  return {
    classifiers,
    searchTerms: Array.isArray(searchTerms) ? searchTerms : [searchTerms],
    bFacet,
    ius: Array.isArray(ius) ? ius : [],
    idApp,
    lbSearch,
    filterExpression
  };
}

/**
 * Realiza búsqueda de tesis
 */
async function search(httpClient, options = {}) {
  const {
    size = 100,
    page = 0,
    ...searchOptions
  } = options;

  const payload = buildSearchPayload(searchOptions);

  const url = `${ENDPOINTS.SEARCH}?size=${size}&page=${page}`;

  const response = await httpClient.post(url, payload);

  // Normalizar respuesta: mapear 'total' a 'totalElements' y 'totalPage' a 'totalPages'
  // para mantener compatibilidad con la API documentada
  return {
    ...response,
    totalElements: response.total || 0,
    totalPages: response.totalPage || 0
  };
}

module.exports = {
  search,
  buildSearchPayload
};
