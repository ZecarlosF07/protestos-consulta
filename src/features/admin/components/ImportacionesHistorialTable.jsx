import { Card } from '../../shared/components/atoms/Card'
import { formatearFechaHora } from '../../auditoria/utils/auditoria.utils'

const ESTADO_LABELS = {
    procesando: 'Procesando',
    completada: 'Completada',
    completada_con_errores: 'Completada con errores',
    fallida: 'Fallida',
}

export function ImportacionesHistorialTable({ historial }) {
    return (
        <Card>
            <h3 className="text-sm font-semibold text-text-primary">Historial reciente de importaciones</h3>
            {historial.length === 0 ? (
                <p className="mt-3 text-sm text-text-muted">Sin importaciones registradas.</p>
            ) : (
                <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-xs uppercase text-text-muted">
                                <th className="pb-2 pr-3">Fecha</th>
                                <th className="pb-2 pr-3">Archivo</th>
                                <th className="pb-2 pr-3">Estado</th>
                                <th className="pb-2 pr-3">Exitosos</th>
                                <th className="pb-2">Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.map(item => (
                                <tr key={item.id} className="border-b border-border/50 text-text-secondary">
                                    <td className="py-2 pr-3">{formatearFechaHora(item.created_at)}</td>
                                    <td className="py-2 pr-3 text-text-primary">{item.nombre_archivo}</td>
                                    <td className="py-2 pr-3">{ESTADO_LABELS[item.estado] ?? item.estado}</td>
                                    <td className="py-2 pr-3">{item.registros_exitosos}</td>
                                    <td className="py-2">{item.registros_error}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    )
}
