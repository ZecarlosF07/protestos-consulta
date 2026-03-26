/** Muestra los campos adicionales del Hito 11/12 en vista analista */
export function CamposAdicionalesInfo({ solicitud }) {
    const hasCampos = solicitud.tipo_comprobante || solicitud.requiere_certificado

    if (!hasCampos) return null

    const docLabel = solicitud.tipo_comprobante === 'factura' ? 'RUC' : 'DNI'
    const datosLabel = solicitud.tipo_comprobante === 'factura' ? 'Razón Social' : 'Nombres y Apellidos'

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                {solicitud.tipo_comprobante && (
                    <InfoField
                        label="Tipo comprobante"
                        value={solicitud.tipo_comprobante === 'boleta' ? 'Boleta' : 'Factura'}
                    />
                )}
                <InfoField
                    label="Certificado requerido"
                    value={solicitud.requiere_certificado ? 'Sí' : 'No'}
                />
            </div>

            {solicitud.comprobante_nrodocumento && (
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                    <InfoField label={docLabel} value={solicitud.comprobante_nrodocumento} />
                    <InfoField label={datosLabel} value={solicitud.comprobante_datos} />
                    <InfoField label="Teléfono" value={solicitud.comprobante_telefono} />
                </div>
            )}
        </div>
    )
}

function InfoField({ label, value }) {
    return (
        <div>
            <span className="text-xs text-text-muted">{label}</span>
            <p className="font-medium text-text-primary">{value ?? '—'}</p>
        </div>
    )
}
