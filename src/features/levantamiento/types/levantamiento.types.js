/**
 * @typedef {'registrada'|'en_revision'|'aprobada'|'rechazada'} EstadoSolicitud
 */

/**
 * @typedef {Object} SolicitudLevantamiento
 * @property {string} id
 * @property {string} protesto_id
 * @property {string} usuario_id
 * @property {string} entidad_financiera_id
 * @property {string} observaciones
 * @property {EstadoSolicitud} estado
 * @property {string} created_at
 * @property {string} updated_at
 * @property {{ nombre_persona: string, numero_documento: string, monto: number, estado: string, secuencia: string, fecha_protesto: string, entidad_financiadora: string }} protesto
 * @property {{ nombre_completo: string, email: string }} usuario
 * @property {{ nombre: string }} entidad_financiera
 * @property {ArchivoSolicitud[]} archivos
 */

/**
 * @typedef {Object} ArchivoSolicitud
 * @property {string} id
 * @property {string} solicitud_id
 * @property {'comprobante_pago'|'formato_firmado'} tipo
 * @property {string} nombre_archivo
 * @property {string} ruta
 * @property {number} tamano_bytes
 * @property {string} created_at
 */

/**
 * @typedef {Object} CrearSolicitudPayload
 * @property {string} protestoId
 * @property {string} usuarioId
 * @property {string} entidadFinancieraId
 */

/** Transiciones válidas de estado de solicitud */
export const SOLICITUD_TRANSITIONS = {
    registrada: ['en_revision', 'rechazada'],
    en_revision: ['aprobada', 'rechazada'],
    aprobada: [],
    rechazada: [],
}

/** Labels legibles para estados de solicitud */
export const SOLICITUD_ESTADO_LABELS = {
    registrada: 'Registrada',
    en_revision: 'En revisión',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
}

/** Estilos para badges de estado de solicitud */
export const SOLICITUD_ESTADO_STYLES = {
    registrada: 'bg-blue-50 text-blue-700',
    en_revision: 'bg-amber-50 text-amber-700',
    aprobada: 'bg-emerald-50 text-emerald-700',
    rechazada: 'bg-red-50 text-red-700',
}

/** Tipos de archivo permitidos */
export const ARCHIVO_TIPOS = {
    COMPROBANTE: 'comprobante_pago',
    FORMATO: 'formato_firmado',
}

/** Configuración de upload */
export const UPLOAD_CONFIG = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
}
