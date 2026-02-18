import { useState } from 'react'

import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { obtenerUrlDescarga } from '../services/archivos.service'
import { formatearTamanoArchivo } from '../../auditoria/utils/auditoria.utils'
import { ARCHIVO_TIPOS } from '../types/levantamiento.types'

/**
 * Muestra el Certificado de Título Regularizado emitido por el Administrador.
 * Permite al analista descargarlo.
 */
export function CertificadoEmitidoCard({ solicitud }) {
    const requiereCertificado = solicitud.requiere_certificado
    if (!requiereCertificado) return null

    const certificado = solicitud.archivos?.find(
        (a) => a.tipo === ARCHIVO_TIPOS.CERTIFICADO_EMITIDO
    )

    if (!certificado) return <CertificadoPendiente />

    return <CertificadoDisponible certificado={certificado} />
}

function CertificadoPendiente() {
    return (
        <Card>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Certificado de Título Regularizado
            </h4>
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <Icon name="clock" className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-amber-700">
                    El certificado aún no ha sido emitido por el Administrador.
                </p>
            </div>
        </Card>
    )
}

function CertificadoDisponible({ certificado }) {
    const [downloading, setDownloading] = useState(false)

    const handleDescargar = async () => {
        setDownloading(true)
        try {
            const url = await obtenerUrlDescarga(certificado.ruta)
            window.open(url, '_blank')
        } catch {
            alert('Error descargando el certificado')
        } finally {
            setDownloading(false)
        }
    }

    return (
        <Card>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Certificado de Título Regularizado
            </h4>
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center gap-2">
                    <Icon name="checkCircle" className="h-5 w-5 text-emerald-600" />
                    <div>
                        <p className="text-sm font-medium text-emerald-800">
                            Certificado disponible
                        </p>
                        <p className="text-xs text-emerald-600">
                            {certificado.nombre_archivo} · {formatearTamanoArchivo(certificado.tamano_bytes)}
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
