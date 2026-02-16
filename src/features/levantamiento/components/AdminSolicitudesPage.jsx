import { useState } from 'react'

import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Icon } from '../../shared/components/atoms/Icon'
import { useSolicitudes } from '../hooks/useSolicitudes'
import { SolicitudesTable } from './SolicitudesTable'
import { SolicitudDetailModal } from './SolicitudDetailModal'
import { FORMATO_PROTESTO_URL } from '../types/levantamiento.types'

/** Página de gestión de solicitudes para el Administrador */
export function AdminSolicitudesPage() {
    const {
        solicitudes,
        isLoading,
        error,
        operationLoading,
        cambiarEstado,
        recargar,
    } = useSolicitudes({ modo: 'admin' })

    const [selectedSolicitud, setSelectedSolicitud] = useState(null)
    const [filtroEstado, setFiltroEstado] = useState('todas')

    const filtradas = filtroEstado === 'todas'
        ? solicitudes
        : solicitudes.filter((s) => s.estado === filtroEstado)

    const handleCambiarEstado = async (solicitudId, nuevoEstado, observaciones) => {
        await cambiarEstado(solicitudId, nuevoEstado, observaciones)
        setSelectedSolicitud(null)
    }

    const handleRecargar = async () => {
        await recargar()
        if (selectedSolicitud) {
            const actualizada = solicitudes.find((s) => s.id === selectedSolicitud.id)
            if (actualizada) setSelectedSolicitud(actualizada)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-text-secondary">
                    Cargando solicitudes...
                </span>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Gestión de Solicitudes"
                    subtitle="Revisar, aprobar o rechazar solicitudes de levantamiento"
                />
                <div className="flex items-center gap-2">
                    <BotonDescargarFormato />
                    <button
                        onClick={recargar}
                        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
                    >
                        <Icon name="refresh" className="h-4 w-4" />
                        Actualizar
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <FiltroEstado
                valor={filtroEstado}
                onChange={setFiltroEstado}
                conteos={contarPorEstado(solicitudes)}
            />

            <SolicitudesTable
                solicitudes={filtradas}
                onSelectSolicitud={setSelectedSolicitud}
            />

            {selectedSolicitud && (
                <SolicitudDetailModal
                    solicitud={selectedSolicitud}
                    onClose={() => setSelectedSolicitud(null)}
                    onCambiarEstado={handleCambiarEstado}
                    onRecargar={handleRecargar}
                    isLoading={operationLoading}
                />
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

/** Filtro de estados con conteos */
function FiltroEstado({ valor, onChange, conteos }) {
    const opciones = [
        { key: 'todas', label: 'Todas' },
        { key: 'registrada', label: 'Registradas' },
        { key: 'en_revision', label: 'En revisión' },
        { key: 'aprobada', label: 'Aprobadas' },
        { key: 'rechazada', label: 'Rechazadas' },
    ]

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {opciones.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${valor === key
                        ? 'bg-accent text-white'
                        : 'border border-border bg-white text-text-secondary hover:bg-surface-dark'
                        }`}
                >
                    {label} ({conteos[key] ?? 0})
                </button>
            ))}
        </div>
    )
}

/** Calcula conteos por estado */
function contarPorEstado(solicitudes) {
    const conteos = { todas: solicitudes.length }

    for (const s of solicitudes) {
        conteos[s.estado] = (conteos[s.estado] || 0) + 1
    }

    return conteos
}
