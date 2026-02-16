import { Icon } from '../../shared/components/atoms/Icon'

/** Botón para solicitar levantamiento de un protesto vigente */
export function BotonLevantamiento({ protesto, onSolicitar, isLoading }) {
    if (protesto.estado !== 'vigente') return null

    return (
        <button
            onClick={() => onSolicitar(protesto)}
            disabled={isLoading}
            className="flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/5 px-2 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
            title="Solicitar levantamiento"
        >
            <Icon name="arrowRight" className="h-3 w-3" />
            Levantar
        </button>
    )
}
