const LABELS = {
    vigente: 'Vigente',
    en_proceso: 'En proceso',
    levantado: 'Levantado',
}
const STYLES = {
    vigente: 'bg-red-50 text-red-700',
    en_proceso: 'bg-amber-50 text-amber-700',
    levantado: 'bg-emerald-50 text-emerald-700',
}

/** Badge de estado de protesto con color semántico */
export function EstadoProtestoBadge({ estado }) {
    const label = LABELS[estado] ?? estado
    const styles = STYLES[estado] ?? 'bg-gray-50 text-gray-700'

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
            {label}
        </span>
    )
}
