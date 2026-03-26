/** Valida que los datos obligatorios del comprobante estén completos */
export function validarDatosComprobante(tipo, datos) {
    if (tipo === 'factura') {
        if (!datos.nroDocumento?.trim()) return 'El RUC es obligatorio para factura'
        if (datos.nroDocumento.trim().length !== 11) return 'El RUC debe tener 11 dígitos'
        if (!datos.datos?.trim()) return 'La razón social es obligatoria para factura'
        if (!datos.telefono?.trim()) return 'El teléfono es obligatorio'
    }

    if (tipo === 'boleta') {
        if (!datos.nroDocumento?.trim()) return 'El DNI es obligatorio para boleta'
        if (datos.nroDocumento.trim().length !== 8) return 'El DNI debe tener 8 dígitos'
        if (!datos.datos?.trim()) return 'Los nombres y apellidos son obligatorios para boleta'
        if (!datos.telefono?.trim()) return 'El teléfono es obligatorio'
    }

    return null
}
