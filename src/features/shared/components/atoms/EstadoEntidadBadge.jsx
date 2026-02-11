const LABELS = { activa: 'Activa', bloqueada: 'Bloqueada' }
const STYLES = {
    activa: 'bg-emerald-50 text-emerald-700',
    bloqueada: 'bg-red-50 text-red-700',
}

/** Badge de estado de entidad financiera con color semántico */
export function EstadoEntidadBadge({ estado }) {
    const label = LABELS[estado] ?? estado
    const styles = STYLES[estado] ?? 'bg-gray-50 text-gray-700'

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
            {label}
        </span>
    )
}
