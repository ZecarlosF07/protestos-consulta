/**
 * @typedef {'procesando'|'completada'|'completada_con_errores'|'fallida'} EstadoImportacion
 */

/**
 * @typedef {Object} ImportacionResumen
 * @property {number} totalRegistros
 * @property {number} registrosExitosos
 * @property {number} registrosError
 */

/**
 * @typedef {Object} ErrorImportacionFila
 * @property {number} fila
 * @property {string} mensaje
 * @property {string|null} secuencia
 */

/**
 * @typedef {Object} FilaProtestoNormalizada
 * @property {number} fila
 * @property {string} secuencia
 * @property {string} tipo_documento
 * @property {string} numero_documento
 * @property {string} nombre_persona
 * @property {string} entidad_financiadora
 * @property {string} entidad_fuente
 * @property {number} monto
 * @property {string} fecha_protesto
 * @property {number|null} tarifa_levantamiento
 */

export const IMPORTACION_ESTADO = {
    PROCESANDO: 'procesando',
    COMPLETADA: 'completada',
    COMPLETADA_CON_ERRORES: 'completada_con_errores',
    FALLIDA: 'fallida',
}

export const EXCEL_HEADERS_REQUIRED = [
    'secuencia',
    'numero_documento',
    'nombre_persona',
    'entidad_financiadora',
    'entidad_fuente',
    'monto',
    'fecha_protesto',
]
