const LABELS = { activo: 'Activo', bloqueado: 'Bloqueado' }
const STYLES = {
    activo: 'bg-emerald-50 text-emerald-700',
    bloqueado: 'bg-red-50 text-red-700',
}

/** Badge de estado de usuario con color semántico */
export function EstadoUsuarioBadge({ estado }) {
    const label = LABELS[estado] ?? estado
    const styles = STYLES[estado] ?? 'bg-gray-50 text-gray-700'

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
            {label}
        </span>
    )
}
