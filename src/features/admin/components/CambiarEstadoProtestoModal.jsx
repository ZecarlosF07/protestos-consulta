import { Icon } from '../../shared/components/atoms/Icon'
import { EstadoProtestoBadge } from '../../shared/components/atoms/EstadoProtestoBadge'
import { PROTESTO_TRANSITIONS, ESTADO_PROTESTO_LABELS } from '../types/admin.types'

/** Modal para cambiar el estado de un protesto respetando transiciones */
export function CambiarEstadoProtestoModal({ protesto, onCambiar, onClose }) {
    const transiciones = PROTESTO_TRANSITIONS[protesto.estado] ?? []

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary">Cambiar estado</h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4 rounded-lg bg-surface p-3">
                    <p className="text-sm text-text-secondary">
                        <span className="font-medium">{protesto.nombre_persona}</span>
                        {' — '}{protesto.numero_documento}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-text-muted">Estado actual:</span>
                        <EstadoProtestoBadge estado={protesto.estado} />
                    </div>
                </div>

                {transiciones.length === 0 ? (
                    <p className="mt-4 text-sm text-text-muted">
                        No hay transiciones disponibles desde este estado.
                    </p>
                ) : (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm text-text-secondary">Cambiar a:</p>
                        {transiciones.map((estado) => (
                            <button
                                key={estado}
                                onClick={() => onCambiar(protesto.id, estado)}
                                className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:bg-surface-dark"
                            >
                                <span className="text-text-primary">
                                    {ESTADO_PROTESTO_LABELS[estado]}
                                </span>
                                <Icon name="arrowRight" className="h-4 w-4 text-text-muted" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-dark"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}
