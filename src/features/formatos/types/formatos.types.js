/**
 * @typedef {'persona'|'empresa'} TipoSolicitante
 */

/**
 * @typedef {'activo'|'anulado'} EstadoDocumento
 */

/**
 * @typedef {Object} FormatoPdf
 * @property {string} id
 * @property {string} nombre
 * @property {string} codigo
 * @property {string} descripcion
 * @property {number} ultimo_correlativo
 * @property {boolean} activo
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} DocumentoEmitido
 * @property {string} id
 * @property {string} formato_id
 * @property {number} correlativo
 * @property {TipoSolicitante} tipo_solicitante
 * @property {string} nro_documento
 * @property {string} nombre_solicitante
 * @property {string} pdf_ruta
 * @property {EstadoDocumento} estado
 * @property {string} emitido_por
 * @property {string} [anulado_por]
 * @property {string} [fecha_anulacion]
 * @property {string} [motivo_anulacion]
 * @property {string} created_at
 * @property {{ nombre_completo: string }} [emisor]
 * @property {{ nombre_completo: string }} [anulador]
 */

/** Opciones de tipo de solicitante */
export const TIPO_SOLICITANTE_OPTIONS = [
    { value: 'persona', label: 'Persona Natural (DNI)' },
    { value: 'empresa', label: 'Persona Jurídica (RUC)' },
]

/** Labels para estado de documento emitido */
export const DOCUMENTO_ESTADO_LABELS = {
    activo: 'Activo',
    anulado: 'Anulado',
}

/** Estilos para badges de estado de documento */
export const DOCUMENTO_ESTADO_STYLES = {
    activo: 'bg-emerald-50 text-emerald-700',
    anulado: 'bg-red-50 text-red-700',
}

/** Prefijo de storage para PDFs generados */
export const FORMATOS_STORAGE_PREFIX = 'formatos'

/** Cantidad de documentos por página en el historial */
export const DOCUMENTOS_PER_PAGE = 15
