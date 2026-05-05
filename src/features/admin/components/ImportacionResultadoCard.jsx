import { Card } from '../../shared/components/atoms/Card'

export function ImportacionResultadoCard({ resultado }) {
    if (!resultado) return null
    const importacionFallida = resultado.estado === 'fallida'

    return (
        <Card>
            <h3 className="text-sm font-semibold text-text-primary">Resultado de importación</h3>
            {importacionFallida && (
                <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    Archivo rechazado. No se importó ningún protesto.
                </p>
            )}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Stat label="Procesados" value={resultado.totalRegistros} />
                <Stat label="Importados" value={resultado.registrosExitosos} />
                <Stat label="Con error" value={resultado.registrosError} />
            </div>
            {resultado.errores?.length > 0 && (
                <div className="mt-4 rounded-lg bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-700">Errores detectados</p>
                    <ul className="mt-2 max-h-56 space-y-2 overflow-y-auto text-xs text-red-700">
                        {resultado.errores.slice(0, 20).map((err, idx) => (
                            <li key={`${err.fila}-${idx}`}>
                                <span className="font-medium">
                                    Fila {err.fila ?? '—'} · Columna {err.columna ?? '—'}
                                </span>
                                {err.campo ? ` · Campo ${err.campo}` : ''}
                                {err.valor ? ` · Valor "${err.valor}"` : ''}
                                {err.secuencia ? ` · Secuencia ${err.secuencia}` : ''}
                                {`: ${err.mensaje}`}
                            </li>
                        ))}
                    </ul>
                    {resultado.errores.length > 20 && (
                        <p className="mt-2 text-xs text-red-700">
                            Se muestran los primeros 20 errores de {resultado.errores.length}.
                        </p>
                    )}
                </div>
            )}
        </Card>
    )
}

function Stat({ label, value }) {
    return (
        <div className="rounded-lg border border-border bg-surface px-3 py-2">
            <p className="text-xs text-text-muted">{label}</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">{value}</p>
        </div>
    )
}
