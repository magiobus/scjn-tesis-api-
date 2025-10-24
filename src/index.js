/**
 * scjn-tesis-api - Cliente Node.js para el API de tesis de la SCJN
 * @author Magio Bustillos
 * @license MIT
 */

const SCJNClient = require('./SCJNClient');
const { EPOCAS, INSTANCIAS, TIPO_DOCUMENTO } = require('./constants/classifiers');

// Export principal
module.exports = SCJNClient;

// Exports adicionales para conveniencia
module.exports.SCJNClient = SCJNClient;
module.exports.EPOCAS = EPOCAS;
module.exports.INSTANCIAS = INSTANCIAS;
module.exports.TIPO_DOCUMENTO = TIPO_DOCUMENTO;
