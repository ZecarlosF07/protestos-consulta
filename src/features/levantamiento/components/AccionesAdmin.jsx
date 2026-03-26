import { Icon } from '../../shared/components/atoms/Icon'

const ACCION_LABELS = {
    en_revision: 'Pasar a Revisión',
    aprobada: 'Aprobar Solicitud',
    rechazada: 'Rechazar Solicitud',
}

const ACCION_STYLES = {
    en_revision: 'bg-amber-500 hover:bg-amber-600',
    aprobada: 'bg-emerald-500 hover:bg-emerald-600',
    rechazada: 'bg-red-500 hover:bg-red-600',
}

/** Sección de acciones administrativas con observaciones */
export function AccionesAdmin({ transiciones, observaciones, onObservacionesChange, onAccion, isLoading }) {
    return (
        <div className="space-y-3 border-t border-border pt-4">
            <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Observaciones del Administrador
                </span>
                <textarea
                    value={observaciones}
                    onChange={(e) => onObservacionesChange(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Notas o feedback para el analista..."
                />
            </label>
            <div className="flex gap-2">
                {transiciones.map((estado) => (
                    <button
                        key={estado}
                        onClick={() => onAccion(estado)}
                        disabled={isLoading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${ACCION_STYLES[estado] ?? 'bg-gray-500 hover:bg-gray-600'}`}
                    >
                        {isLoading ? 'Procesando...' : ACCION_LABELS[estado]}
                    </button>
                ))}
            </div>
        </div>
    )
}
