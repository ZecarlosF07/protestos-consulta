/**
 * @typedef {Object} MetricasGlobales
 * @property {number} totalConsultas - Total de consultas realizadas
 * @property {number} consultasHoy - Consultas realizadas hoy
 * @property {number} totalSolicitudes - Total de solicitudes de levantamiento
 * @property {number} solicitudesPendientes - Solicitudes en estado registrada o en_revision
 */

/**
 * @typedef {Object} ConsultasPorEntidad
 * @property {string} entidad_nombre - Nombre de la entidad financiera
 * @property {number} total - Total de consultas
 */

/**
 * @typedef {Object} ConsultasPorAnalista
 * @property {string} analista_nombre - Nombre del analista
 * @property {string} entidad_nombre - Nombre de la entidad financiera
 * @property {number} total - Total de consultas
 */

/**
 * @typedef {Object} RegistroAuditoria
 * @property {string} id
 * @property {string} usuario_id
 * @property {string} accion
 * @property {string} descripcion
 * @property {string} entidad_afectada
 * @property {Object} metadata
 * @property {string} created_at
 * @property {{ nombre_completo: string }} usuario
 */

export { }
