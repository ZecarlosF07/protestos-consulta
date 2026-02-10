import { Card } from '../../shared/components/atoms/Card'

/** Tabla de consultas agrupadas por entidad financiera */
export function ConsultasPorEntidadTable({ datos }) {
    return (
        <Card>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Consultas por Entidad Financiera
            </h3>

            {datos.length === 0 ? (
                <p className="text-sm text-text-muted">Sin datos disponibles</p>
            ) : (
                <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white">
                            <tr className="border-b border-border">
                                <th className="pb-2 text-left font-medium text-text-secondary">
                                    Entidad
                                </th>
                                <th className="pb-2 text-right font-medium text-text-secondary">
                                    Consultas
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {datos.map(({ entidad_nombre, total }) => (
                                <tr key={entidad_nombre}>
                                    <td className="py-2 text-text-primary">
                                        {entidad_nombre}
                                    </td>
                                    <td className="py-2 text-right font-medium text-text-primary">
                                        {total.toLocaleString('es-PE')}
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
