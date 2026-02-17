import { Card } from '../../shared/components/atoms/Card'

export function ImportacionResultadoCard({ resultado }) {
    if (!resultado) return null

    return (
        <Card>
            <h3 className="text-sm font-semibold text-text-primary">Resultado de importación</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Stat label="Procesados" value={resultado.totalRegistros} />
                <Stat label="Importados" value={resultado.registrosExitosos} />
                <Stat label="Con error" value={resultado.registrosError} />
            </div>
            {resultado.errores?.length > 0 && (
                <div className="mt-4 rounded-lg bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-700">Errores detectados</p>
                    <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto text-xs text-red-700">
                        {resultado.errores.slice(0, 20).map((err, idx) => (
                            <li key={`${err.fila}-${idx}`}>
                                Fila {err.fila ?? '—'}{err.secuencia ? ` (${err.secuencia})` : ''}: {err.mensaje}
                            </li>
                        ))}
                    </ul>
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
