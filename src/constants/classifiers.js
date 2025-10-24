/**
 * Mapeo de clasificadores legibles a códigos del API
 */

const EPOCAS = {
  '12a': '210',
  '11a': '200',
  '10a': '100',
  '9a': '5'
};

const EPOCAS_NOMBRES = {
  '12a': 'Duodécima Época',
  '11a': 'Undécima Época',
  '10a': 'Décima Época',
  '9a': 'Novena Época'
};

const INSTANCIAS = {
  'Primera Sala': '1',
  'Segunda Sala': '2',
  'Pleno': '6',
  'Tribunales Colegiados': '60',
  'Plenos de Circuito': '7',
  'Tribunales de Circuito': '70',
  'Juzgados de Distrito': '80',
  'Plenos Regionales': '50'
};

const TIPO_DOCUMENTO = {
  'Tesis': '1',
  'Jurisprudencia': '2'
};

const DEFAULT_APP_ID = 'SJFAPP2020';

/**
 * Convierte nombres legibles de épocas a códigos
 * @param {Array<string>} epocas - Array de épocas ('12a', '11a', etc.)
 * @returns {Array<string>} Array de códigos
 */
function convertirEpocas(epocas) {
  if (!Array.isArray(epocas)) {
    epocas = [epocas];
  }
  return epocas.map(epoca => EPOCAS[epoca] || epoca);
}

/**
 * Convierte nombres legibles de instancias a códigos
 * @param {Array<string>} instancias - Array de nombres de instancias
 * @returns {Array<string>} Array de códigos
 */
function convertirInstancias(instancias) {
  if (!Array.isArray(instancias)) {
    instancias = [instancias];
  }
  return instancias.map(instancia => INSTANCIAS[instancia] || instancia);
}

/**
 * Convierte nombre de tipo de documento a código
 * @param {string} tipo - 'Tesis' o 'Jurisprudencia'
 * @returns {string} Código del tipo
 */
function convertirTipoDocumento(tipo) {
  return TIPO_DOCUMENTO[tipo] || '1';
}

/**
 * Genera labels descriptivos para búsqueda
 * @param {Array<string>} epocas - Array de épocas
 * @param {Array<string>} instancias - Array de instancias
 * @returns {Array<string>} Array de labels
 */
function generarLabels(epocas, instancias) {
  const labels = [];

  epocas.forEach(epoca => {
    const nombreEpoca = EPOCAS_NOMBRES[epoca] || epoca;
    if (instancias && instancias.length > 0) {
      instancias.forEach(instancia => {
        labels.push(`${nombreEpoca} - ${instancia}`);
      });
    } else {
      labels.push(`${nombreEpoca} - Todas las Instancias`);
    }
  });

  return labels;
}

module.exports = {
  EPOCAS,
  EPOCAS_NOMBRES,
  INSTANCIAS,
  TIPO_DOCUMENTO,
  DEFAULT_APP_ID,
  convertirEpocas,
  convertirInstancias,
  convertirTipoDocumento,
  generarLabels
};
