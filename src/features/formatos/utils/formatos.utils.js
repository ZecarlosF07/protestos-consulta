/** Formatea un correlativo con ceros a la izquierda */
export function formatearCorrelativo(correlativo) {
    return `N° ${String(correlativo).padStart(6, '0')}`
}

/** Formatea fecha para mostrar en la UI */
export function formatearFechaFormato(fecha) {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/** Valida los datos del solicitante según su tipo */
export function validarDatosSolicitante(tipo, nroDocumento, nombre) {
    if (!tipo) return 'Seleccione el tipo de solicitante'
    if (!nroDocumento?.trim()) return 'El número de documento es obligatorio'
    if (!nombre?.trim()) return 'El nombre es obligatorio'

    if (tipo === 'persona' && nroDocumento.trim().length !== 8) {
        return 'El DNI debe tener 8 dígitos'
    }

    if (tipo === 'empresa' && nroDocumento.trim().length !== 11) {
        return 'El RUC debe tener 11 dígitos'
    }

    return null
}

/** Mapea el tipo de solicitante a label legible */
export function labelTipoSolicitante(tipo) {
    return tipo === 'empresa' ? 'RUC' : 'DNI'
}
