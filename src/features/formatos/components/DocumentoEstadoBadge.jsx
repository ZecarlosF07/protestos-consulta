import { DOCUMENTO_ESTADO_STYLES, DOCUMENTO_ESTADO_LABELS } from '../types/formatos.types'

/** Badge de estado para documentos emitidos (activo/anulado) */
export function DocumentoEstadoBadge({ estado }) {
    const style = DOCUMENTO_ESTADO_STYLES[estado] ?? 'bg-gray-50 text-gray-700'
    const label = DOCUMENTO_ESTADO_LABELS[estado] ?? estado

    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
            {label}
        </span>
    )
}
