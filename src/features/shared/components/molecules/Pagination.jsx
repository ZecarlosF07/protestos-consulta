import { Icon } from '../atoms/Icon'

/** Controles de paginación */
export function Pagination({ currentPage, totalPages, total, onPageChange }) {
    if (totalPages <= 1) return null

    const pages = generatePageNumbers(currentPage, totalPages)

    return (
        <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
            <span className="text-sm text-text-secondary">
                {total} registro(s) · Página {currentPage} de {totalPages}
            </span>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-dark disabled:opacity-30"
                >
                    <Icon name="chevronLeft" className="h-4 w-4" />
                </button>

                {pages.map((page, i) => (
                    page === '...' ? (
                        <span key={`dots-${i}`} className="px-2 text-sm text-text-muted">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`rounded-lg px-3 py-1 text-sm transition-colors ${page === currentPage
                                ? 'bg-accent font-medium text-white'
                                : 'text-text-secondary hover:bg-surface-dark'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-dark disabled:opacity-30"
                >
                    <Icon name="chevronRight" className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

/** Genera array de páginas con puntos suspensivos */
function generatePageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages = [1]

    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    if (current < total - 2) pages.push('...')

    pages.push(total)

    return pages
}
