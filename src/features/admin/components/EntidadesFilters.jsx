import { Icon } from '../../shared/components/atoms/Icon'

/** Barra de filtros para el listado de entidades financieras */
export function EntidadesFilters({
    filtroEstado,
    busqueda,
    onEstadoChange,
    onBusquedaChange,
}) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
                <Icon name="filter" className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-secondary">Filtrar:</span>
            </div>

            <select
                value={filtroEstado}
                onChange={(e) => onEstadoChange(e.target.value)}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
                <option value="">Todos los estados</option>
                <option value="activa">Activa</option>
                <option value="bloqueada">Bloqueada</option>
            </select>

            <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) => onBusquedaChange(e.target.value)}
                    className="rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
            </div>
        </div>
    )
}
