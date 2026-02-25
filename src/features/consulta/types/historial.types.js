/**
 * @typedef {Object} ConsultaHistorial
 * @property {string} id
 * @property {string} usuario_id
 * @property {string} entidad_financiera_id
 * @property {'DNI'|'RUC'} tipo_documento
 * @property {string} numero_documento
 * @property {number} resultados_encontrados
 * @property {string} fecha_consulta
 * @property {string} created_at
 */

/**
 * @typedef {Object} HistorialFiltros
 * @property {string} busqueda - Texto libre para filtrar por número de documento
 * @property {string} fechaDesde - Fecha inicio del rango
 * @property {string} fechaHasta - Fecha fin del rango
 */

/** Filtros iniciales vacíos */
export const HISTORIAL_FILTROS_INICIALES = {
    busqueda: '',
    fechaDesde: '',
    fechaHasta: '',
}

/** Cantidad de registros por página */
export const HISTORIAL_PAGE_SIZE = 20

export default {}
