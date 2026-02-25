/**
 * Formatea un timestamp ISO a fecha y hora legible (dd/mm/yyyy HH:mm).
 * @param {string} timestamp
 * @returns {string}
 */
export function formatearFechaHora(timestamp) {
    if (!timestamp) return '—'

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(timestamp))
}
