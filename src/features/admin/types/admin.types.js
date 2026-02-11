/**
 * @typedef {'activo'|'bloqueado'} EstadoUsuario
 */

/**
 * @typedef {Object} AnalistaRow
 * @property {string} id
 * @property {string} nombre_completo
 * @property {string} dni
 * @property {string} email
 * @property {string} telefono
 * @property {string} cargo
 * @property {string} rol
 * @property {string} entidad_financiera_id
 * @property {EstadoUsuario} estado
 * @property {string} created_at
 * @property {{ id: string, nombre: string }} entidad_financiera
 */

/**
 * @typedef {Object} CrearAnalistaPayload
 * @property {string} email
 * @property {string} password
 * @property {string} nombre_completo
 * @property {string} dni
 * @property {string} telefono
 * @property {string} cargo
 * @property {string} entidad_financiera_id
 */

/**
 * @typedef {Object} EditarAnalistaPayload
 * @property {string} nombre_completo
 * @property {string} telefono
 * @property {string} cargo
 * @property {string} entidad_financiera_id
 */

/**
 * @typedef {'vigente'|'en_proceso'|'levantado'} EstadoProtesto
 */

/**
 * @typedef {Object} ProtestoRow
 * @property {string} id
 * @property {string} secuencia
 * @property {string} tipo_documento
 * @property {string} numero_documento
 * @property {string} nombre_persona
 * @property {string} entidad_financiadora
 * @property {string} entidad_fuente
 * @property {number} monto
 * @property {string} fecha_protesto
 * @property {number} tarifa_levantamiento
 * @property {EstadoProtesto} estado
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ProtestoFilters
 * @property {string} estado
 * @property {string} entidad
 * @property {string} fechaDesde
 * @property {string} fechaHasta
 * @property {string} busqueda
 */

/** Estados válidos de usuario */
export const ESTADO_USUARIO = {
    ACTIVO: 'activo',
    BLOQUEADO: 'bloqueado',
}

/** Labels de estado de usuario */
export const ESTADO_USUARIO_LABELS = {
    activo: 'Activo',
    bloqueado: 'Bloqueado',
}

/** Estilos de badge de estado de usuario */
export const ESTADO_USUARIO_STYLES = {
    activo: 'bg-emerald-50 text-emerald-700',
    bloqueado: 'bg-red-50 text-red-700',
}

/** Estados válidos de protesto */
export const ESTADO_PROTESTO = {
    VIGENTE: 'vigente',
    EN_PROCESO: 'en_proceso',
    LEVANTADO: 'levantado',
}

/** Labels de estado de protesto */
export const ESTADO_PROTESTO_LABELS = {
    vigente: 'Vigente',
    en_proceso: 'En proceso',
    levantado: 'Levantado',
}

/** Estilos de badge de estado de protesto */
export const ESTADO_PROTESTO_STYLES = {
    vigente: 'bg-red-50 text-red-700',
    en_proceso: 'bg-amber-50 text-amber-700',
    levantado: 'bg-emerald-50 text-emerald-700',
}

/** Transiciones válidas de estado de protesto */
export const PROTESTO_TRANSITIONS = {
    vigente: ['en_proceso'],
    en_proceso: ['vigente', 'levantado'],
    levantado: [],
}

/**
 * @typedef {'activa'|'bloqueada'} EstadoEntidad
 */

/**
 * @typedef {Object} EntidadFinancieraRow
 * @property {string} id
 * @property {string} nombre
 * @property {EstadoEntidad} estado
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} CrearEntidadPayload
 * @property {string} nombre
 */

/** Estados válidos de entidad financiera */
export const ESTADO_ENTIDAD = {
    ACTIVA: 'activa',
    BLOQUEADA: 'bloqueada',
}

/** Labels de estado de entidad financiera */
export const ESTADO_ENTIDAD_LABELS = {
    activa: 'Activa',
    bloqueada: 'Bloqueada',
}

/** Estilos de badge de estado de entidad financiera */
export const ESTADO_ENTIDAD_STYLES = {
    activa: 'bg-emerald-50 text-emerald-700',
    bloqueada: 'bg-red-50 text-red-700',
}

/** Cantidad de registros por página */
export const PAGE_SIZE = 15
