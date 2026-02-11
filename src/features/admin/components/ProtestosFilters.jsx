import { Icon } from '../../shared/components/atoms/Icon'
import { ESTADO_PROTESTO_LABELS } from '../types/admin.types'

/** Barra de filtros para el listado de protestos */
export function ProtestosFilters({ filtros, entidadesFinanciadoras, onFiltroChange, onLimpiar }) {
    return (
        <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex flex-wrap items-end gap-3">
                <div className="flex items-center gap-2">
                    <Icon name="filter" className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium text-text-secondary">Filtros:</span>
                </div>

                <FilterField label="Búsqueda">
                    <input
                        type="text"
                        placeholder="Doc, nombre o secuencia..."
                        value={filtros.busqueda}
                        onChange={(e) => onFiltroChange('busqueda', e.target.value)}
                        className="w-48 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    />
                </FilterField>

                <FilterField label="Estado">
                    <select
                        value={filtros.estado}
                        onChange={(e) => onFiltroChange('estado', e.target.value)}
                        className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    >
                        <option value="">Todos</option>
                        {Object.entries(ESTADO_PROTESTO_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                </FilterField>

                <FilterField label="Entidad">
                    <select
                        value={filtros.entidad}
                        onChange={(e) => onFiltroChange('entidad', e.target.value)}
                        className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    >
                        <option value="">Todas</option>
                        {entidadesFinanciadoras.map((e) => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
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
