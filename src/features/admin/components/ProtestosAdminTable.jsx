import { EstadoProtestoBadge } from '../../shared/components/atoms/EstadoProtestoBadge'
import { Icon } from '../../shared/components/atoms/Icon'
import { formatearFecha, formatearMonto } from '../../consulta/utils/formato.utils'

/** Tabla administrativa de protestos */
export function ProtestosAdminTable({ protestos, onVerHistorial, onCambiarEstado }) {
    if (protestos.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-white p-10 text-center">
                <p className="text-sm text-text-muted">No se encontraron protestos.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-border bg-surface">
                        <th className="px-4 py-3 font-medium text-text-secondary">Secuencia</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Documento</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Nombre</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Entidad</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Monto</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Fecha</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Estado</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {protestos.map((p) => (
                        <ProtestoRow
                            key={p.id}
                            protesto={p}
                            onVerHistorial={onVerHistorial}
                            onCambiarEstado={onCambiarEstado}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function ProtestoRow({ protesto, onVerHistorial, onCambiarEstado }) {
    return (
        <tr className="border-b border-border last:border-0 hover:bg-surface/50">
            <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                {protesto.secuencia}
            </td>
            <td className="px-4 py-3 text-text-primary">{protesto.numero_documento}</td>
            <td className="px-4 py-3 text-text-primary">{protesto.nombre_persona}</td>
            <td className="px-4 py-3 text-text-secondary">{protesto.entidad_financiadora}</td>
            <td className="px-4 py-3 font-medium text-text-primary">
                {formatearMonto(protesto.monto)}
            </td>
            <td className="px-4 py-3 text-text-secondary">
                {formatearFecha(protesto.fecha_protesto)}
            </td>
            <td className="px-4 py-3">
                <EstadoProtestoBadge estado={protesto.estado} />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onVerHistorial(protesto)}
                        title="Ver historial"
                        className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-dark hover:text-text-primary"
                    >
                        <Icon name="history" className="h-4 w-4" />
                    </button>
                    {protesto.estado !== 'levantado' && (
                        <button
                            onClick={() => onCambiarEstado(protesto)}
                            title="Cambiar estado"
                            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-dark hover:text-text-primary"
                        >
                            <Icon name="edit" className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )
}
