import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { Card } from '../../shared/components/atoms/Card'
import { formatearCorrelativo } from '../utils/formatos.utils'

/** Modal para anular un documento emitido con motivo obligatorio */
export function AnularDocumentoModal({ documento, onAnular, onClose, isLoading }) {
    const [motivo, setMotivo] = useState('')
    const [validationError, setValidationError] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!motivo.trim()) {
            setValidationError('El motivo de anulación es obligatorio')
            return
        }
        if (motivo.trim().length < 10) {
            setValidationError('El motivo debe tener al menos 10 caracteres')
            return
        }
        onAnular(documento.id, motivo)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Anular documento</h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-surface-dark">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-800">
                        {formatearCorrelativo(documento.correlativo)}
                    </p>
                    <p className="mt-1 text-xs text-red-600">
                        Esta acción es irreversible. El correlativo no podrá reutilizarse.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Motivo de anulación *
                        </span>
                        <textarea
                            value={motivo}
                            onChange={(e) => { setMotivo(e.target.value); setValidationError(null) }}
                            rows={3}
                            placeholder="Describa el motivo de la anulación..."
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                    </label>

                    {validationError && <p className="text-xs text-red-600">{validationError}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Anulando...' : 'Confirmar anulación'}
                    </button>
                </form>
            </Card>
        </div>
    )
}
