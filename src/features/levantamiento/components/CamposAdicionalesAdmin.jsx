import { Card } from '../../shared/components/atoms/Card'

/** Muestra campos adicionales del Hito 11/12 en vista admin */
export function CamposAdicionalesAdmin({ solicitud }) {
    const hasCampos = solicitud.tipo_comprobante || solicitud.requiere_certificado

    if (!hasCampos) return null

    const docLabel = solicitud.tipo_comprobante === 'factura' ? 'RUC' : 'DNI'
    const datosLabel = solicitud.tipo_comprobante === 'factura' ? 'Razón Social' : 'Nombres y Apellidos'

    return (
        <Card>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Información del Comprobante
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
                {solicitud.tipo_comprobante && (
                    <InfoField
                        label="Tipo comprobante"
                        value={solicitud.tipo_comprobante === 'boleta' ? 'Boleta' : 'Factura'}
                    />
                )}
                <InfoField
                    label="Certificado requerido"
                    value={solicitud.requiere_certificado ? 'Sí (S/ 30)' : 'No'}
                />
            </div>

            {solicitud.comprobante_nrodocumento && (
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm sm:grid-cols-3">
                    <InfoField label={docLabel} value={solicitud.comprobante_nrodocumento} />
                    <InfoField label={datosLabel} value={solicitud.comprobante_datos} />
                    <InfoField label="Teléfono" value={solicitud.comprobante_telefono} />
                </div>
            )}
        </Card>
    )
}

function InfoField({ label, value }) {
    return (
        <div>
            <span className="text-text-muted">{label}</span>
            <p className="font-medium text-text-primary">{value ?? '—'}</p>
        </div>
    )
}
