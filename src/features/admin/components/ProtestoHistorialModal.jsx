import { useEffect, useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { formatearFechaHora } from '../../auditoria/utils/auditoria.utils'

/** Modal que muestra el historial de auditoría de un protesto */
export function ProtestoHistorialModal({ protesto, obtenerHistorial, onClose }) {
    const [historial, setHistorial] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function cargar() {
            try {
                const data = await obtenerHistorial(protesto.id)
                setHistorial(data)
            } catch (err) {
                console.error('Error cargando historial:', err.message)
            } finally {
                setIsLoading(false)
            }
        }
        cargar()
    }, [protesto.id, obtenerHistorial])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h3 className="font-semibold text-text-primary">
                        Historial — {protesto.nombre_persona}
                    </h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto p-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                        </div>
                    ) : historial.length === 0 ? (
                        <p className="py-4 text-center text-sm text-text-muted">
                            Sin registros de auditoría para este protesto.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {historial.map((h) => (
                                <HistorialItem key={h.id} registro={h} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function HistorialItem({ registro }) {
    return (
        <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">{registro.accion}</span>
                <span className="text-xs text-text-muted">
                    {formatearFechaHora(registro.created_at)}
                </span>
            </div>
            {registro.descripcion && (
                <p className="mt-1 text-sm text-text-secondary">{registro.descripcion}</p>
            )}
            <p className="mt-1 text-xs text-text-muted">
                Por: {registro.usuario?.nombre_completo ?? 'Sistema'}
            </p>
        </div>
    )
}
