import { Icon } from '../../shared/components/atoms/Icon'
import {
    ESTADO_PROTESTO_LABELS,
    PROTESTO_BUSQUEDA_TIPOS,
} from '../types/admin.types'

/** Barra de filtros para el listado de protestos */
export function ProtestosFilters({ filtros, onFiltroChange, onLimpiar }) {
    const busquedaPlaceholder = getBusquedaPlaceholder(filtros.busquedaTipo)

    return (
        <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex flex-wrap items-end gap-3">
                <div className="flex items-center gap-2">
                    <Icon name="filter" className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium text-text-secondary">Filtros:</span>
                </div>

                <FilterField label="Buscar por">
                    <select
                        value={filtros.busquedaTipo}
                        onChange={(e) => onFiltroChange('busquedaTipo', e.target.value)}
                        className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    >
                        {PROTESTO_BUSQUEDA_TIPOS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </FilterField>

                <FilterField label="Valor">
                    <input
                        type="text"
                        placeholder={busquedaPlaceholder}
                        value={filtros.busqueda}
                        onChange={(e) => onFiltroChange('busqueda', e.target.value)}
                        className="w-56 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
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
                    <input
                        type="text"
                        placeholder="Entidad financiadora..."
                        value={filtros.entidad}
                        onChange={(e) => onFiltroChange('entidad', e.target.value)}
                        className="w-56 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
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

function getBusquedaPlaceholder(tipo) {
    if (tipo === 'secuencia') return 'Ej: 2024-000123'
    if (tipo === 'nombre') return 'Nombre o razón social...'
    return 'DNI o RUC...'
}

function FilterField({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted">{label}</span>
            {children}
        </div>
    )
}
