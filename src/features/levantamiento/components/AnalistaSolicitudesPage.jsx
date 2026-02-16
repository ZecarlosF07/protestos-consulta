import { useState } from 'react'

import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { SolicitudEstadoBadge } from '../../shared/components/atoms/SolicitudEstadoBadge'
import { useSolicitudes } from '../hooks/useSolicitudes'
import { formatearMonto, formatearFecha } from '../../consulta/utils/formato.utils'
import { formatearFechaHora, formatearTamanoArchivo } from '../../auditoria/utils/auditoria.utils'
import { UploadArchivoForm } from './UploadArchivoForm'
import { obtenerUrlDescarga } from '../services/archivos.service'
import { ARCHIVO_TIPO_LABELS, FORMATO_PROTESTO_URL } from '../types/levantamiento.types'

/** Página de solicitudes del analista */
export function AnalistaSolicitudesPage() {
    const { solicitudes, isLoading, error, recargar } = useSolicitudes({ modo: 'analista' })
    const [expandedId, setExpandedId] = useState(null)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-text-secondary">Cargando solicitudes...</span>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Mis Solicitudes de Levantamiento"
                    subtitle="Gestiona tus solicitudes y sube la documentación requerida"
                />
                <BotonDescargarFormato />
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            {solicitudes.length === 0 ? (
                <Card>
                    <div className="py-8 text-center">
                        <Icon name="clipboard" className="mx-auto h-8 w-8 text-text-muted" />
                        <p className="mt-3 text-sm text-text-muted">
                            No tienes solicitudes de levantamiento. Inicia una desde la consulta de protestos.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {solicitudes.map((solicitud) => (
                        <SolicitudCard
                            key={solicitud.id}
                            solicitud={solicitud}
                            isExpanded={expandedId === solicitud.id}
                            onToggle={() => setExpandedId(
                                expandedId === solicitud.id ? null : solicitud.id
                            )}
                            onUploaded={recargar}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

/** Botón para descargar formato oficial */
function BotonDescargarFormato() {
    return (
        <a
            href={FORMATO_PROTESTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
        >
            <Icon name="download" className="h-4 w-4" />
            Descargar Formato
        </a>
    )
}

/** Card individual de solicitud */
function SolicitudCard({ solicitud, isExpanded, onToggle, onUploaded }) {
    const handleDescargar = async (ruta, nombre) => {
        try {
            const url = await obtenerUrlDescarga(ruta)
            window.open(url, '_blank')
        } catch {
            alert(`Error descargando ${nombre}`)
        }
    }

    return (
        <Card className="overflow-hidden !p-0">
            <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-surface"
                onClick={onToggle}
            >
                <div className="flex items-center gap-4">
                    <SolicitudEstadoBadge estado={solicitud.estado} />
                    <div>
                        <p className="text-sm font-medium text-text-primary">
                            {solicitud.protesto?.nombre_persona ?? '—'}
                        </p>
                        <p className="text-xs text-text-muted">
                            Doc: {solicitud.protesto?.numero_documento} ·
                            Monto: {solicitud.protesto?.monto ? formatearMonto(solicitud.protesto.monto) : '—'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                        {formatearFechaHora(solicitud.created_at)}
                    </span>
                    <Icon
                        name="chevronDown"
                        className={`h-4 w-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isExpanded && (
                <SolicitudDetalle
                    solicitud={solicitud}
                    onDescargar={handleDescargar}
                    onUploaded={onUploaded}
                />
            )}
        </Card>
    )
}

/** Detalle expandido de una solicitud */
function SolicitudDetalle({ solicitud, onDescargar, onUploaded }) {
    const puedeSubirArchivos = ['registrada', 'en_revision'].includes(solicitud.estado)

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

            <ArchivosListado archivos={solicitud.archivos} onDescargar={onDescargar} />

            {puedeSubirArchivos && (
                <UploadArchivoForm solicitud={solicitud} onUploaded={onUploaded} />
            )}
        </div>
    )
}

/** Muestra los campos adicionales del Hito 11 */
function CamposAdicionalesInfo({ solicitud }) {
    const hasCampos = solicitud.tipo_comprobante || solicitud.requiere_certificado

    if (!hasCampos) return null

    return (
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
    )
}

/** Lista de archivos adjuntos */
function ArchivosListado({ archivos, onDescargar }) {
    if (!archivos || archivos.length === 0) return null

    return (
        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Archivos subidos ({archivos.length})
            </p>
            <div className="space-y-2">
                {archivos.map((archivo) => (
                    <div
                        key={archivo.id}
                        className="flex items-center justify-between rounded-lg border border-border p-2"
                    >
                        <div>
                            <p className="text-sm text-text-primary">{archivo.nombre_archivo}</p>
                            <p className="text-xs text-text-muted">
                                {ARCHIVO_TIPO_LABELS[archivo.tipo] ?? archivo.tipo} ·{' '}
                                {formatearTamanoArchivo(archivo.tamano_bytes)}
                            </p>
                        </div>
                        <button
                            onClick={() => onDescargar(archivo.ruta, archivo.nombre_archivo)}
                            className="rounded p-1 text-accent hover:bg-blue-50"
                        >
                            <Icon name="download" className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
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
