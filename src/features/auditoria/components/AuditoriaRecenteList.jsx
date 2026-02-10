import { Card } from '../../shared/components/atoms/Card'
import { formatearFechaHora } from '../utils/auditoria.utils'

/** Lista de registros de auditoría recientes */
export function AuditoriaRecenteList({ registros }) {
    return (
        <Card>
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
                Actividad Reciente
            </h3>

            {registros.length === 0 ? (
                <p className="text-sm text-text-muted">Sin actividad registrada</p>
            ) : (
                <div className="max-h-80 space-y-3 overflow-y-auto">
                    {registros.map((registro) => (
                        <AuditoriaItem key={registro.id} registro={registro} />
                    ))}
                </div>
            )}
        </Card>
    )
}

/** Ítem individual de auditoría */
function AuditoriaItem({ registro }) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-accent">
                        {registro.accion}
                    </span>
                    <span className="flex-shrink-0 text-xs text-text-muted">
                        {formatearFechaHora(registro.created_at)}
                    </span>
                </div>
                {registro.descripcion && (
                    <p className="mt-1 text-sm text-text-primary">
                        {registro.descripcion}
                    </p>
                )}
                <p className="mt-0.5 text-xs text-text-muted">
                    {registro.usuario?.nombre_completo ?? 'Sistema'}
                </p>
            </div>
        </div>
    )
}
