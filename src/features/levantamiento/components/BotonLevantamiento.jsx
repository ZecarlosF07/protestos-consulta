import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'

/** Botón para solicitar levantamiento de un protesto vigente */
export function BotonLevantamiento({ protesto, onSolicitar, isLoading }) {
    const [confirmando, setConfirmando] = useState(false)

    if (protesto.estado !== 'vigente') return null

    if (confirmando) {
        return (
            <div className="flex items-center gap-1">
                <button
                    onClick={() => {
                        onSolicitar(protesto.id)
                        setConfirmando(false)
                    }}
                    disabled={isLoading}
                    className="rounded bg-emerald-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                >
                    {isLoading ? '...' : 'Sí'}
                </button>
                <button
                    onClick={() => setConfirmando(false)}
                    className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-gray-300"
                >
                    No
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setConfirmando(true)}
            className="flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/5 px-2 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/10"
            title="Solicitar levantamiento"
        >
            <Icon name="arrowRight" className="h-3 w-3" />
            Levantar
        </button>
    )
}
