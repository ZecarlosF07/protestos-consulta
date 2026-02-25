import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Icon } from '../../shared/components/atoms/Icon'
import { useHistorialConsultas } from '../hooks/useHistorialConsultas'
import { HistorialFilters } from './HistorialFilters'
import { HistorialTable } from './HistorialTable'
import { HistorialPagination } from './HistorialPagination'

/** Página de historial de consultas realizadas por el analista */
export function HistorialConsultasPage() {
    const {
        consultas,
        totalRegistros,
        pagina,
        totalPaginas,
        filtros,
        isLoading,
        error,
        cambiarFiltro,
        limpiarFiltros,
        irAPagina,
        recargar,
    } = useHistorialConsultas()

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Historial de Consultas"
                    subtitle="Registro de todas las búsquedas de protestos realizadas"
                />
                <button
                    onClick={recargar}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
                >
                    <Icon name="refresh" className="h-4 w-4" />
                    Actualizar
                </button>
            </div>

            <HistorialFilters
                filtros={filtros}
                onFiltroChange={cambiarFiltro}
                onLimpiar={limpiarFiltros}
            />

            {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-3 text-text-secondary">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                        <span className="text-sm">Cargando historial...</span>
                    </div>
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    <HistorialTable consultas={consultas} />
                    <HistorialPagination
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        totalRegistros={totalRegistros}
                        onIrAPagina={irAPagina}
                    />
                </div>
            )}
        </div>
    )
}
