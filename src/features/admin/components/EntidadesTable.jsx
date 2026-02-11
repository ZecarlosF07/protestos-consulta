import { EstadoEntidadBadge } from '../../shared/components/atoms/EstadoEntidadBadge'
import { Icon } from '../../shared/components/atoms/Icon'

/** Tabla de entidades financieras con acciones por fila */
export function EntidadesTable({ entidades, conteoAnalistas, onEditar, onToggleEstado }) {
    if (entidades.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-white p-10 text-center">
                <p className="text-sm text-text-muted">No se encontraron entidades financieras.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-border bg-surface">
                        <th className="px-4 py-3 font-medium text-text-secondary">Nombre</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Estado</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Analistas</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Fecha de creación</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {entidades.map((entidad) => (
                        <EntidadRow
                            key={entidad.id}
                            entidad={entidad}
                            totalAnalistas={conteoAnalistas[entidad.id] ?? 0}
                            onEditar={onEditar}
                            onToggleEstado={onToggleEstado}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function EntidadRow({ entidad, totalAnalistas, onEditar, onToggleEstado }) {
    const isBloqueada = entidad.estado === 'bloqueada'
    const fecha = new Date(entidad.created_at).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })

    return (
        <tr className="border-b border-border last:border-0 hover:bg-surface/50">
            <td className="px-4 py-3 font-medium text-text-primary">{entidad.nombre}</td>
            <td className="px-4 py-3">
                <EstadoEntidadBadge estado={entidad.estado} />
            </td>
            <td className="px-4 py-3 text-text-secondary">{totalAnalistas}</td>
            <td className="px-4 py-3 text-text-secondary">{fecha}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                    <ActionButton
                        icon="edit"
                        title="Editar nombre"
                        onClick={() => onEditar(entidad)}
                    />
                    <ActionButton
                        icon={isBloqueada ? 'unlock' : 'lock'}
                        title={isBloqueada ? 'Desbloquear' : 'Bloquear'}
                        onClick={() => onToggleEstado(entidad)}
                        variant={isBloqueada ? 'success' : 'warning'}
                    />
                </div>
            </td>
        </tr>
    )
}

const VARIANT_STYLES = {
    default: 'text-text-secondary hover:text-text-primary hover:bg-surface-dark',
    warning: 'text-amber-600 hover:text-amber-700 hover:bg-amber-50',
    success: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
}

function ActionButton({ icon, title, onClick, variant = 'default' }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`rounded-lg p-1.5 transition-colors ${VARIANT_STYLES[variant]}`}
        >
            <Icon name={icon} className="h-4 w-4" />
        </button>
    )
}
