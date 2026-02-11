import { Icon } from '../../shared/components/atoms/Icon'

/** Barra de filtros para el listado de analistas */
export function AnalistasFilters({
    entidades,
    filtroEntidad,
    filtroEstado,
    onEntidadChange,
    onEstadoChange,
}) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
                <Icon name="filter" className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-secondary">Filtrar:</span>
            </div>

            <select
                value={filtroEntidad}
                onChange={(e) => onEntidadChange(e.target.value)}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
                <option value="">Todas las entidades</option>
                {entidades.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
            </select>

            <select
                value={filtroEstado}
                onChange={(e) => onEstadoChange(e.target.value)}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="bloqueado">Bloqueado</option>
            </select>
        </div>
    )
}
