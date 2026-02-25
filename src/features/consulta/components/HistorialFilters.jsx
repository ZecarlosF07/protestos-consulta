import { Icon } from '../../shared/components/atoms/Icon'

/** Barra de filtros para el historial de consultas del analista */
export function HistorialFilters({ filtros, onFiltroChange, onLimpiar }) {
    return (
        <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex flex-wrap items-end gap-3">
                <div className="flex items-center gap-2">
                    <Icon name="filter" className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium text-text-secondary">Filtros:</span>
                </div>

                <FilterField label="Documento">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Número de documento..."
                        value={filtros.busqueda}
                        onChange={(e) => onFiltroChange('busqueda', e.target.value)}
                        className="w-48 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    />
                </FilterField>

                <FilterField label="Desde">
                    <input
                        type="date"
                        value={filtros.fechaDesde}
                        onChange={(e) => onFiltroChange('fechaDesde', e.target.value)}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    />
                </FilterField>

                <FilterField label="Hasta">
                    <input
                        type="date"
                        value={filtros.fechaHasta}
                        onChange={(e) => onFiltroChange('fechaHasta', e.target.value)}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    />
                </FilterField>

                <button
                    onClick={onLimpiar}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
                >
                    Limpiar
                </button>
            </div>
        </div>
    )
}

function FilterField({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted">{label}</span>
            {children}
        </div>
    )
}
