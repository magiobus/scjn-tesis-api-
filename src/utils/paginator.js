/**
 * Sistema de paginación automática para extraer todos los IDs
 */

class Paginator {
  constructor(searchFn, rateLimiter) {
    this.searchFn = searchFn;
    this.rateLimiter = rateLimiter;
  }

  /**
   * Extrae todos los IDs de tesis basados en filtros
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación
   * @param {Function} options.onProgress - Callback de progreso (current, total, page)
   * @param {number} options.maxConcurrent - Máximo de requests concurrentes
   * @param {number} options.pageSize - Tamaño de cada página
   * @returns {Promise<Array>} Array de objetos {id, ius}
   */
  async getAllTesisIds(filters = {}, options = {}) {
    const {
      onProgress = null,
      maxConcurrent = 3,
      pageSize = 100
    } = options;

    // Configurar rate limiter
    if (this.rateLimiter) {
      this.rateLimiter.setConfig({ maxConcurrent });
    }

    // 1. Hacer request inicial para obtener total
    const firstPage = await this.searchFn({
      ...filters,
      size: 1,
      page: 0
    });

    const totalElements = firstPage.totalElements || 0;
    const totalPages = Math.ceil(totalElements / pageSize);

    if (onProgress) {
      onProgress(0, totalElements, 0, totalPages);
    }

    // 2. Crear array de funciones para todas las páginas
    const pageFunctions = [];
    for (let page = 0; page < totalPages; page++) {
      pageFunctions.push(async () => {
        const result = await this.searchFn({
          ...filters,
          size: pageSize,
          page: page
        });

        // Extraer IDs y IUS
        const ids = (result.documents || []).map(doc => ({
          id: doc.id,
          ius: doc.ius,
          rubro: doc.rubro
        }));

        // Callback de progreso
        if (onProgress) {
          const currentElement = (page + 1) * pageSize;
          onProgress(
            Math.min(currentElement, totalElements),
            totalElements,
            page + 1,
            totalPages
          );
        }

        return ids;
      });
    }

    // 3. Ejecutar todas las páginas con rate limiting
    let allResults;
    if (this.rateLimiter) {
      allResults = await this.rateLimiter.runAll(pageFunctions);
    } else {
      allResults = await Promise.all(pageFunctions.map(fn => fn()));
    }

    // 4. Aplanar resultados
    return allResults.flat();
  }

  /**
   * Extrae solo los números IUS (más ligero)
   */
  async getAllIUS(filters = {}, options = {}) {
    const allTesis = await this.getAllTesisIds(filters, options);
    return allTesis.map(t => t.ius);
  }
}

module.exports = Paginator;
