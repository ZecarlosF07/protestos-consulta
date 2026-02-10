/**
 * Formatea un timestamp ISO a formato legible con hora.
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
    }).format(new Date(timestamp))
}

/**
 * Formatea el tamaño de un archivo en bytes a una unidad legible.
 * @param {number} bytes
 * @returns {string}
 */
export function formatearTamanoArchivo(bytes) {
    if (!bytes) return '—'

    const unidades = ['B', 'KB', 'MB', 'GB']
    let indice = 0
    let tamano = bytes

    while (tamano >= 1024 && indice < unidades.length - 1) {
        tamano /= 1024
        indice++
    }

    return `${tamano.toFixed(1)} ${unidades[indice]}`
}
