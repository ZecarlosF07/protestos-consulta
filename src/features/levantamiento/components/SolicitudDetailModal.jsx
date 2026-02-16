import { useState } from 'react'

import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { SolicitudEstadoBadge } from '../../shared/components/atoms/SolicitudEstadoBadge'
import { EstadoBadge } from '../../consulta/components/EstadoBadge'
import { formatearMonto, formatearFecha } from '../../consulta/utils/formato.utils'
import { formatearFechaHora, formatearTamanoArchivo } from '../../auditoria/utils/auditoria.utils'
import { SOLICITUD_TRANSITIONS, ARCHIVO_TIPO_LABELS, ARCHIVO_TIPOS } from '../types/levantamiento.types'
import { obtenerUrlDescarga } from '../services/archivos.service'
import { AdminCertificadoUpload } from './AdminCertificadoUpload'

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
                    <ArchivosSection
                        archivos={solicitud.archivos}
                        onDescargar={handleDescargar}
                    />

                    {solicitud.requiere_certificado && (
                        <AdminCertificadoUpload
                            solicitud={solicitud}
                            onUploaded={onRecargar}
                        />
                    )}

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
            <h3 className="text-lg font-semibold text-text-primary">
                Detalle de Solicitud
            </h3>
            <button
                onClick={onClose}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-dark"
            >
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
                <span className="text-text-muted">Estado:</span>
                <SolicitudEstadoBadge estado={solicitud.estado} />
            </div>
        </div>
    )
}

/** Muestra campos adicionales del Hito 11 en vista admin */
function CamposAdicionalesAdmin({ solicitud }) {
    const hasCampos = solicitud.tipo_comprobante || solicitud.requiere_certificado

    if (!hasCampos) return null

    return (
        <Card>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Información Adicional
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
        </Card>
    )
}

function ArchivosSection({ archivos, onDescargar }) {
    if (!archivos || archivos.length === 0) {
        return (
            <Card>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Documentos Adjuntos
                </h4>
                <p className="text-sm text-text-muted">
                    No se han adjuntado documentos aún
                </p>
            </Card>
        )
    }

    return (
        <Card>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Documentos Adjuntos ({archivos.length})
            </h4>
            <div className="space-y-2">
                {archivos.map((archivo) => (
                    <div
                        key={archivo.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">
                                {archivo.nombre_archivo}
                            </p>
                            <p className="text-xs text-text-muted">
                                {ARCHIVO_TIPO_LABELS[archivo.tipo] ?? archivo.tipo} ·{' '}
                                {formatearTamanoArchivo(archivo.tamano_bytes)}
                            </p>
                        </div>
                        <button
                            onClick={() => onDescargar(archivo.ruta, archivo.nombre_archivo)}
                            className="rounded-lg p-2 text-accent transition-colors hover:bg-blue-50"
                        >
                            <Icon name="download" className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    )
}

function AccionesAdmin({ transiciones, observaciones, onObservacionesChange, onAccion, isLoading }) {
    return (
        <div className="space-y-3 border-t border-border pt-4">
            <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Observaciones del Administrador
                </span>
                <textarea
                    value={observaciones}
                    onChange={(e) => onObservacionesChange(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Notas o feedback para el analista..."
                />
            </label>
            <div className="flex gap-2">
                {transiciones.map((estado) => (
                    <button
                        key={estado}
                        onClick={() => onAccion(estado)}
                        disabled={isLoading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${ACCION_STYLES[estado] ?? 'bg-gray-500 hover:bg-gray-600'}`}
                    >
                        {isLoading ? 'Procesando...' : ACCION_LABELS[estado]}
                    </button>
                ))}
            </div>
        </div>
    )
}

const ACCION_LABELS = {
    en_revision: 'Pasar a Revisión',
    aprobada: 'Aprobar Solicitud',
    rechazada: 'Rechazar Solicitud',
}

const ACCION_STYLES = {
    en_revision: 'bg-amber-500 hover:bg-amber-600',
    aprobada: 'bg-emerald-500 hover:bg-emerald-600',
    rechazada: 'bg-red-500 hover:bg-red-600',
}

function InfoField({ label, value }) {
    return (
        <div>
            <span className="text-text-muted">{label}</span>
            <p className="font-medium text-text-primary">{value ?? '—'}</p>
        </div>
    )
}
