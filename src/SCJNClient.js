/**
 * Cliente principal para el API de SCJN
 */
const HttpClient = require('./utils/http');
const RateLimiter = require('./utils/rate-limiter');
const Paginator = require('./utils/paginator');
const { search } = require('./endpoints/search');
const { getTesis, getMultipleTesis } = require('./endpoints/tesis');
const { healthCheck } = require('./endpoints/health');

class SCJNClient {
  /**
   * Crea una nueva instancia del cliente SCJN
   * @param {Object} options - Opciones de configuración
   * @param {number} options.timeout - Timeout para requests (default: 30000ms)
   * @param {number} options.retries - Número de reintentos (default: 3)
   * @param {number} options.maxConcurrent - Requests concurrentes máximos (default: 3)
   * @param {number} options.delayBetweenRequests - Delay entre requests en ms (default: 100)
   * @param {boolean} options.debug - Habilitar modo debug (default: false)
   */
  constructor(options = {}) {
    this.httpClient = new HttpClient({
      timeout: options.timeout,
      retries: options.retries,
      debug: options.debug
    });

    this.rateLimiter = new RateLimiter({
      maxConcurrent: options.maxConcurrent,
      delayBetweenRequests: options.delayBetweenRequests
    });

    this.paginator = new Paginator(
      (filters) => this.search(filters),
      this.rateLimiter
    );
  }

  /**
   * Busca tesis según filtros
   * @param {Object} options - Opciones de búsqueda
   * @param {Array<string>} options.epocas - Épocas a buscar (['12a', '11a', etc.])
   * @param {Array<string>} options.instancias - Instancias a buscar
   * @param {string} options.tipoDocumento - Tipo de documento ('Tesis' o 'Jurisprudencia')
   * @param {Array<string>|string} options.searchTerms - Términos de búsqueda
   * @param {number} options.size - Resultados por página (default: 100)
   * @param {number} options.page - Número de página (default: 0)
   * @returns {Promise<Object>} Resultados de búsqueda
   *
   * @example
   * const results = await client.search({
   *   epocas: ['12a', '11a'],
   *   instancias: ['Primera Sala'],
   *   searchTerms: 'amparo',
   *   size: 50
   * });
   */
  async search(options = {}) {
    return search(this.httpClient, options);
  }

  /**
   * Obtiene una tesis por su ID
   * @param {string|number} id - ID de la tesis
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} Datos completos de la tesis
   *
   * @example
   * const tesis = await client.getTesis(159805);
   */
  async getTesis(id, options = {}) {
    return getTesis(this.httpClient, id, options);
  }

  /**
   * Obtiene múltiples tesis por sus IDs
   * @param {Array<string|number>} ids - Array de IDs
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Array>} Array de tesis
   *
   * @example
   * const tesisList = await client.getMultipleTesis([159805, 159806]);
   */
  async getMultipleTesis(ids, options = {}) {
    return getMultipleTesis(this.httpClient, ids, options);
  }

  /**
   * Verifica el estado del servicio
   * @returns {Promise<Object>} Estado del servicio
   *
   * @example
   * const health = await client.healthCheck();
   * console.log(health.status); // 'UP'
   */
  async healthCheck() {
    return healthCheck(this.httpClient);
  }

  /**
   * Obtiene todos los IDs de tesis según filtros
   * @param {Object} filters - Filtros de búsqueda (mismo formato que search())
   * @param {Object} options - Opciones de paginación
   * @param {Function} options.onProgress - Callback (current, total, page, totalPages)
   * @param {number} options.maxConcurrent - Requests concurrentes (default: 3)
   * @param {number} options.pageSize - Tamaño de página (default: 100)
   * @returns {Promise<Array>} Array de {id, ius, rubro}
   *
   * @example
   * const allIds = await client.getAllTesisIds(
   *   { epocas: ['12a'] },
   *   {
   *     onProgress: (current, total) => {
   *       console.log(`${current}/${total}`);
   *     }
   *   }
   * );
   */
  async getAllTesisIds(filters = {}, options = {}) {
    return this.paginator.getAllTesisIds(filters, options);
  }

  /**
   * Obtiene solo los números IUS de todas las tesis
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación
   * @returns {Promise<Array<number>>} Array de números IUS
   *
   * @example
   * const allIUS = await client.getAllIUS({ epocas: ['12a'] });
   */
  async getAllIUS(filters = {}, options = {}) {
    return this.paginator.getAllIUS(filters, options);
  }

  /**
   * Habilita o deshabilita el modo debug
   * @param {boolean} enabled - true para habilitar
   */
  setDebug(enabled) {
    this.httpClient.setDebug(enabled);
  }
}

module.exports = SCJNClient;
