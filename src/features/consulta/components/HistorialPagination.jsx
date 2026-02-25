import { Icon } from '../../shared/components/atoms/Icon'

/** Paginación simple con botones Anterior / Siguiente */
export function HistorialPagination({ pagina, totalPaginas, totalRegistros, onIrAPagina }) {
    if (totalPaginas <= 1) return null

    return (
        <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
            <span className="text-sm text-text-muted">
                {totalRegistros} consulta{totalRegistros !== 1 ? 's' : ''} — Página {pagina + 1} de {totalPaginas}
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onIrAPagina(pagina - 1)}
                    disabled={pagina === 0}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Icon name="chevronLeft" className="h-4 w-4" />
                    Anterior
                </button>
                <button
                    onClick={() => onIrAPagina(pagina + 1)}
                    disabled={pagina >= totalPaginas - 1}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Siguiente
                    <Icon name="chevronRight" className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
