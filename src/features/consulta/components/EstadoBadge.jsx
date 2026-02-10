import { getEstadoLabel, getEstadoStyles } from '../utils/formato.utils'

/** Badge de estado del protesto con color semántico */
export function EstadoBadge({ estado }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoStyles(estado)}`}
        >
            {getEstadoLabel(estado)}
        </span>
    )
}
