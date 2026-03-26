import { useState } from 'react'

import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { obtenerUrlDescarga } from '../services/archivos.service'
import { formatearTamanoArchivo } from '../../auditoria/utils/auditoria.utils'
import { ARCHIVO_TIPOS } from '../types/levantamiento.types'

/**
 * Muestra la Boleta/Factura adjuntada por el Administrador.
 * Permite al analista descargarla.
 */
export function ComprobanteAdjuntoCard({ solicitud }) {
    const comprobante = solicitud.archivos?.find(
        (a) => a.tipo === ARCHIVO_TIPOS.BOLETA_FACTURA
    )

    const tipoLabel = solicitud.tipo_comprobante === 'factura' ? 'Factura' : 'Boleta'

    if (!comprobante) return <ComprobantePendiente tipoLabel={tipoLabel} />

    return <ComprobanteDisponible comprobante={comprobante} tipoLabel={tipoLabel} />
}

function ComprobantePendiente({ tipoLabel }) {
    return (
        <Card>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {tipoLabel} Adjunta
            </h4>
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <Icon name="clock" className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-amber-700">
                    La {tipoLabel.toLowerCase()} aún no ha sido adjuntada por el Administrador.
                </p>
            </div>
        </Card>
    )
}

function ComprobanteDisponible({ comprobante, tipoLabel }) {
    const [downloading, setDownloading] = useState(false)

    const handleDescargar = async () => {
        setDownloading(true)
        try {
            const url = await obtenerUrlDescarga(comprobante.ruta)
            window.open(url, '_blank')
        } catch {
            alert(`Error descargando la ${tipoLabel.toLowerCase()}`)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <Card>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {tipoLabel} Adjunta
            </h4>
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center gap-2">
                    <Icon name="checkCircle" className="h-5 w-5 text-emerald-600" />
                    <div>
                        <p className="text-sm font-medium text-emerald-800">
                            {tipoLabel} disponible
                        </p>
                        <p className="text-xs text-emerald-600">
                            {comprobante.nombre_archivo} · {formatearTamanoArchivo(comprobante.tamano_bytes)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDescargar}
                    disabled={downloading}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    {downloading ? 'Descargando...' : 'Descargar'}
                </button>
            </div>
        </Card>
    )
}
