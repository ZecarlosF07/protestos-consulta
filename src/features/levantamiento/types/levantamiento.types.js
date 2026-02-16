/**
 * @typedef {'registrada'|'en_revision'|'aprobada'|'rechazada'} EstadoSolicitud
 */

/**
 * @typedef {'boleta'|'factura'} TipoComprobante
 */

/**
 * @typedef {Object} SolicitudLevantamiento
 * @property {string} id
 * @property {string} protesto_id
 * @property {string} usuario_id
 * @property {string} entidad_financiera_id
 * @property {string} observaciones
 * @property {TipoComprobante} tipo_comprobante
 * @property {boolean} requiere_certificado
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
 * @property {ArchivoTipo} tipo
 * @property {string} nombre_archivo
 * @property {string} ruta
 * @property {number} tamano_bytes
 * @property {string} created_at
 */

/**
 * @typedef {'comprobante_pago'|'formato_firmado'|'carta_no_adeudo'|'comprobante_certificado'|'certificado_emitido'} ArchivoTipo
 */

/**
 * @typedef {Object} CrearSolicitudPayload
 * @property {string} protestoId
 * @property {string} usuarioId
 * @property {string} entidadFinancieraId
 * @property {TipoComprobante} [tipoComprobante]
 * @property {boolean} [requiereCertificado]
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
    CARTA_NO_ADEUDO: 'carta_no_adeudo',
    COMPROBANTE_CERTIFICADO: 'comprobante_certificado',
    CERTIFICADO_EMITIDO: 'certificado_emitido',
}

/** Labels legibles para tipos de archivo */
export const ARCHIVO_TIPO_LABELS = {
    comprobante_pago: 'Comprobante de Pago',
    formato_firmado: 'Formato Firmado',
    carta_no_adeudo: 'Carta de No Adeudo',
    comprobante_certificado: 'Comprobante Certificado (S/ 30)',
    certificado_emitido: 'Certificado de Título Regularizado',
}

/** Tipos de comprobante fiscal */
export const TIPO_COMPROBANTE_OPTIONS = [
    { value: 'boleta', label: 'Boleta' },
    { value: 'factura', label: 'Factura' },
]

/** Costo del certificado de título regularizado */
export const COSTO_CERTIFICADO = 30

/** Información fija de cuenta de depósito para comprobantes de pago */
export const CUENTA_DEPOSITO_INFO = {
    titular: 'CAMARA DE COMERCIO INDUSTRIA Y TURISMO DE ICA',
    cuentas: [
        { banco: 'INTERBANK', cuenta: 'CTA. CTE.: 400-2600696439', cci: '003-400-002600696439-94' },
        { banco: 'CONTINENTAL', cuenta: 'CTA.: 0011-0203-0100002047', cci: '011-203-000100002047-77' },
        { banco: 'BCP', cuenta: '380-7000415044', cci: '00238000700041504440' },
    ],
}

/** URL del formato oficial de protesto */
export const FORMATO_PROTESTO_URL =
    'https://docs.google.com/document/d/1kmCJDqFd_MM4nS0CKUHJjjbwTc82IqS1/edit?usp=sharing&ouid=110297175374548788563&rtpof=true&sd=true'

/** Configuración de upload */
export const UPLOAD_CONFIG = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
}
