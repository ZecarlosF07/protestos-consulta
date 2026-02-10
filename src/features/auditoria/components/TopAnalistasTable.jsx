import { Card } from '../../shared/components/atoms/Card'

/** Top 10 analistas con más consultas */
export function TopAnalistasTable({ datos }) {
    return (
        <Card>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Top 10 Analistas
            </h3>

            {datos.length === 0 ? (
                <p className="text-sm text-text-muted">Sin datos disponibles</p>
            ) : (
                <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white">
                            <tr className="border-b border-border">
                                <th className="pb-2 text-left font-medium text-text-secondary">
                                    #
                                </th>
                                <th className="pb-2 text-left font-medium text-text-secondary">
                                    Analista
                                </th>
                                <th className="pb-2 text-left font-medium text-text-secondary">
                                    Entidad
                                </th>
                                <th className="pb-2 text-right font-medium text-text-secondary">
                                    Consultas
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {datos.map((item, index) => (
                                <tr key={`${item.analista_nombre}-${index}`}>
                                    <td className="py-2 text-text-muted">
                                        {index + 1}
                                    </td>
                                    <td className="py-2 text-text-primary">
                                        {item.analista_nombre}
                                    </td>
                                    <td className="py-2 text-text-secondary">
                                        {item.entidad_nombre}
                                    </td>
                                    <td className="py-2 text-right font-medium text-text-primary">
                                        {item.total.toLocaleString('es-PE')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    )
}
