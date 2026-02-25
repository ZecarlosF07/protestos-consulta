import { formatearFechaHora } from '../utils/historial.utils'

/** Tabla de historial de consultas del analista */
export function HistorialTable({ consultas }) {
    if (consultas.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-white p-8 text-center">
                <p className="text-sm text-text-muted">
                    No se encontraron consultas con los filtros aplicados.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-border bg-surface-dark">
                        <th className="px-4 py-3 font-medium text-text-secondary">Fecha y Hora</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Tipo</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Nº Documento</th>
                        <th className="px-4 py-3 font-medium text-text-secondary text-center">Resultados</th>
                    </tr>
                </thead>
                <tbody>
                    {consultas.map((consulta) => (
                        <HistorialRow key={consulta.id} consulta={consulta} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function HistorialRow({ consulta }) {
    const tieneResultados = consulta.resultados_encontrados > 0

    return (
        <tr className="border-b border-border last:border-b-0 hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-3 text-text-primary">
                {formatearFechaHora(consulta.created_at)}
            </td>
            <td className="px-4 py-3">
                <TipoDocBadge tipo={consulta.tipo_documento} />
            </td>
            <td className="px-4 py-3 font-mono text-text-primary">
                {consulta.numero_documento}
            </td>
            <td className="px-4 py-3 text-center">
                <ResultadoBadge cantidad={consulta.resultados_encontrados} tiene={tieneResultados} />
            </td>
        </tr>
    )
}

function TipoDocBadge({ tipo }) {
    const esRUC = tipo === 'RUC'
    const styles = esRUC
        ? 'bg-blue-50 text-blue-700'
        : 'bg-slate-50 text-slate-700'

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
            {tipo}
        </span>
    )
}

function ResultadoBadge({ cantidad, tiene }) {
    const styles = tiene
        ? 'bg-red-50 text-red-700'
        : 'bg-emerald-50 text-emerald-700'

    const label = tiene
        ? `${cantidad} protesto${cantidad > 1 ? 's' : ''}`
        : 'Sin protestos'

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
            {label}
        </span>
    )
}
