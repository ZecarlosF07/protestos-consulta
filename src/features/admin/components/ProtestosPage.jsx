import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Pagination } from '../../shared/components/molecules/Pagination'
import { useProtestosAdmin } from '../hooks/useProtestosAdmin'
import { ProtestosFilters } from './ProtestosFilters'
import { ProtestosAdminTable } from './ProtestosAdminTable'
import { ProtestoHistorialModal } from './ProtestoHistorialModal'
import { CambiarEstadoProtestoModal } from './CambiarEstadoProtestoModal'

/** Página de gestión administrativa de protestos */
export function ProtestosPage() {
    const {
        protestos, entidadesFinanciadoras, total, totalPages, currentPage,
        isLoading, error, filtros,
        actualizarFiltro, limpiarFiltros, cambiarEstado, obtenerHistorial,
        irAPagina, recargar,
    } = useProtestosAdmin()

    const [historialProtesto, setHistorialProtesto] = useState(null)
    const [cambiarEstadoProtesto, setCambiarEstadoProtesto] = useState(null)
    const [actionError, setActionError] = useState(null)

    const handleCambiarEstado = async (protestoId, nuevoEstado) => {
        try {
            setActionError(null)
            await cambiarEstado(protestoId, nuevoEstado)
            setCambiarEstadoProtesto(null)
        } catch (err) {
            setActionError(err.message)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-text-secondary">Cargando protestos...</span>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Gestión de Protestos"
                    subtitle={`${total} protesto(s) encontrado(s)`}
                />
                <button
                    onClick={recargar}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
                >
                    <Icon name="refresh" className="h-4 w-4" />
                    Actualizar
                </button>
            </div>

            {(error || actionError) && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error || actionError}
                </div>
            )}

            <div className="mb-4">
                <ProtestosFilters
                    filtros={filtros}
                    entidadesFinanciadoras={entidadesFinanciadoras}
                    onFiltroChange={actualizarFiltro}
                    onLimpiar={limpiarFiltros}
                />
            </div>

            <ProtestosAdminTable
                protestos={protestos}
                onVerHistorial={setHistorialProtesto}
                onCambiarEstado={setCambiarEstadoProtesto}
            />

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    onPageChange={irAPagina}
                />
            </div>

            {historialProtesto && (
                <ProtestoHistorialModal
                    protesto={historialProtesto}
                    obtenerHistorial={obtenerHistorial}
                    onClose={() => setHistorialProtesto(null)}
                />
            )}

            {cambiarEstadoProtesto && (
                <CambiarEstadoProtestoModal
                    protesto={cambiarEstadoProtesto}
                    onCambiar={handleCambiarEstado}
                    onClose={() => setCambiarEstadoProtesto(null)}
                />
            )}
        </div>
    )
}
