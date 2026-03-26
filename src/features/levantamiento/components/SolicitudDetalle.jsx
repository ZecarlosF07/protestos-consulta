import { formatearMonto, formatearFecha } from '../../consulta/utils/formato.utils'
import { obtenerUrlDescarga } from '../services/archivos.service'
import { UploadArchivoForm } from './UploadArchivoForm'
import { CertificadoEmitidoCard } from './CertificadoEmitidoCard'
import { ComprobanteAdjuntoCard } from './ComprobanteAdjuntoCard'
import { ArchivosListado } from './ArchivosListado'
import { CamposAdicionalesInfo } from './CamposAdicionalesInfo'

/** Detalle expandido de una solicitud (vista analista) */
export function SolicitudDetalle({ solicitud, onUploaded }) {
    const puedeSubirArchivos = ['registrada', 'en_revision'].includes(solicitud.estado)

    const handleDescargar = async (ruta, nombre) => {
        try {
            const url = await obtenerUrlDescarga(ruta)
            window.open(url, '_blank')
        } catch {
            alert(`Error descargando ${nombre}`)
        }
    }

    return (
        <div className="space-y-4 border-t border-border p-4">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <InfoField label="Secuencia" value={solicitud.protesto?.secuencia} />
                <InfoField label="Fecha protesto" value={formatearFecha(solicitud.protesto?.fecha_protesto)} />
                <InfoField label="Girador" value={solicitud.protesto?.entidad_financiadora} />
                <InfoField label="Tarifa" value={
                    solicitud.protesto?.tarifa_levantamiento
                        ? formatearMonto(solicitud.protesto.tarifa_levantamiento)
                        : '—'
                } />
            </div>

            <CamposAdicionalesInfo solicitud={solicitud} />

            {solicitud.observaciones && (
                <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-700">Observaciones del Administrador:</p>
                    <p className="mt-1 text-sm text-amber-900">{solicitud.observaciones}</p>
                </div>
            )}

            <CertificadoEmitidoCard solicitud={solicitud} />
            <ComprobanteAdjuntoCard solicitud={solicitud} />

            <ArchivosListado archivos={solicitud.archivos} onDescargar={handleDescargar} />

            {puedeSubirArchivos && (
                <UploadArchivoForm solicitud={solicitud} onUploaded={onUploaded} />
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
