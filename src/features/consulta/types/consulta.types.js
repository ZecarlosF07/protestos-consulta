/**
 * @typedef {Object} Protesto
 * @property {string} id
 * @property {string} secuencia
 * @property {string} tipo_documento
 * @property {string} numero_documento
 * @property {string} nombre_persona
 * @property {string} entidad_financiadora
 * @property {string} entidad_fuente
 * @property {number} monto
 * @property {string} fecha_protesto
 * @property {number|null} tarifa_levantamiento
 * @property {'vigente'|'en_proceso'|'levantado'} estado
 */

/**
 * @typedef {Object} RegistroConsulta
 * @property {string} usuario_id
 * @property {string} entidad_financiera_id
 * @property {'DNI'|'RUC'} tipo_documento
 * @property {string} numero_documento
 * @property {number} resultados_encontrados
 */

/**
 * @typedef {Object} ResultadoConsulta
 * @property {Protesto[]} protestos
 * @property {number} total
 * @property {'DNI'|'RUC'} tipo_documento
 * @property {string} numero_documento
 */

export default {}
