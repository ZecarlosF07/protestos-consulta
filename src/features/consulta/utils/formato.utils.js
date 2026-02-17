/** Mapeo de estados de protesto a labels legibles */
const ESTADO_LABELS = {
    vigente: 'Vigente',
    en_proceso: 'En proceso',
    levantado: 'Levantado',
}

/** Mapeo de estados a clases de color Tailwind */
const ESTADO_STYLES = {
    vigente: 'bg-red-50 text-red-700',
    en_proceso: 'bg-amber-50 text-amber-700',
    levantado: 'bg-emerald-50 text-emerald-700',
}

/**
 * Obtiene el label legible de un estado de protesto.
 * @param {string} estado
 * @returns {string}
 */
export function getEstadoLabel(estado) {
    return ESTADO_LABELS[estado] ?? estado
}

/**
 * Obtiene las clases CSS para el badge de estado.
 * @param {string} estado
 * @returns {string}
 */
export function getEstadoStyles(estado) {
    return ESTADO_STYLES[estado] ?? 'bg-gray-50 text-gray-700'
}

/**
 * Formatea un monto a moneda peruana.
 * @param {number} monto
 * @returns {string}
 */
export function formatearMonto(monto) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(monto)
}

/**
 * Formatea una fecha ISO a formato legible.
 * @param {string} fecha
 * @returns {string}
 */
export function formatearFecha(fecha) {
    if (!fecha) return '—'

    // Para columnas DATE (YYYY-MM-DD), evitar new Date() porque aplica timezone del navegador.
    const soloFecha = String(fecha).match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (soloFecha) {
        const [, year, month, day] = soloFecha
        return `${day}/${month}/${year}`
    }

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(fecha))
}
