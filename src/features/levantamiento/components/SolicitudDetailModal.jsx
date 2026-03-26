import { useState } from 'react'

import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { SolicitudEstadoBadge } from '../../shared/components/atoms/SolicitudEstadoBadge'
import { EstadoBadge } from '../../consulta/components/EstadoBadge'
import { formatearMonto, formatearFecha } from '../../consulta/utils/formato.utils'
import { formatearFechaHora } from '../../auditoria/utils/auditoria.utils'
import { SOLICITUD_TRANSITIONS } from '../types/levantamiento.types'
import { obtenerUrlDescarga } from '../services/archivos.service'
import { AdminCertificadoUpload } from './AdminCertificadoUpload'
import { AdminComprobanteUpload } from './AdminComprobanteUpload'
import { ArchivosSection } from './ArchivosSection'
import { AccionesAdmin } from './AccionesAdmin'
import { CamposAdicionalesAdmin } from './CamposAdicionalesAdmin'

/** Modal de detalle de una solicitud de levantamiento (Admin) */
export function SolicitudDetailModal({ solicitud, onClose, onCambiarEstado, onRecargar, isLoading }) {
    const [observaciones, setObservaciones] = useState(solicitud.observaciones ?? '')
    const transicionesPermitidas = SOLICITUD_TRANSITIONS[solicitud.estado] ?? []

    const handleDescargar = async (ruta, nombre) => {
        try {
            const url = await obtenerUrlDescarga(ruta)
            window.open(url, '_blank')
        } catch {
            alert(`Error descargando ${nombre}`)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
                <ModalHeader onClose={onClose} />

                <div className="space-y-5 p-6">
                    <ProtestoInfo protesto={solicitud.protesto} />
                    <SolicitudInfo solicitud={solicitud} />
                    <CamposAdicionalesAdmin solicitud={solicitud} />
                    <ArchivosSection archivos={solicitud.archivos} onDescargar={handleDescargar} />

                    {solicitud.requiere_certificado && (
                        <AdminCertificadoUpload solicitud={solicitud} onUploaded={onRecargar} />
                    )}

                    <AdminComprobanteUpload solicitud={solicitud} onUploaded={onRecargar} />

                    {transicionesPermitidas.length > 0 && (
                        <AccionesAdmin
                            transiciones={transicionesPermitidas}
                            observaciones={observaciones}
                            onObservacionesChange={setObservaciones}
                            onAccion={(nuevoEstado) =>
                                onCambiarEstado(solicitud.id, nuevoEstado, observaciones)
                            }
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

function ModalHeader({ onClose }) {
    return (
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-lg font-semibold text-text-primary">Detalle de Solicitud</h3>
            <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-surface-dark">
                <Icon name="close" className="h-5 w-5" />
            </button>
        </div>
    )
}

function ProtestoInfo({ protesto }) {
    if (!protesto) return null

    return (
        <Card>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Datos del Protesto
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoField label="Persona" value={protesto.nombre_persona} />
                <InfoField label="Documento" value={protesto.numero_documento} />
                <InfoField label="Monto" value={formatearMonto(protesto.monto)} />
                <InfoField label="Fecha" value={formatearFecha(protesto.fecha_protesto)} />
                <InfoField label="Girador" value={protesto.entidad_financiadora} />
                <InfoField label="Secuencia" value={protesto.secuencia} />
            </div>
            <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-text-muted">Estado protesto:</span>
                <EstadoBadge estado={protesto.estado} />
            </div>
        </Card>
    )
}

function SolicitudInfo({ solicitud }) {
    return (
        <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoField label="Analista" value={solicitud.usuario?.nombre_completo} />
            <InfoField label="Entidad" value={solicitud.entidad_financiera?.nombre} />
            <InfoField label="Fecha solicitud" value={formatearFechaHora(solicitud.created_at)} />
            <div className="flex items-center gap-2">
                <span className="text-text-muted">Estado:</span> <SolicitudEstadoBadge estado={solicitud.estado} />
            </div>
        </div>
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
