import { EstadoUsuarioBadge } from '../../shared/components/atoms/EstadoUsuarioBadge'
import { Icon } from '../../shared/components/atoms/Icon'

/** Tabla de analistas con acciones por fila */
export function AnalistasTable({ analistas, onEditar, onToggleEstado, onResetPassword }) {
    if (analistas.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-white p-10 text-center">
                <p className="text-sm text-text-muted">No se encontraron analistas.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-border bg-surface">
                        <th className="px-4 py-3 font-medium text-text-secondary">Nombre</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">DNI</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Email</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Entidad</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Estado</th>
                        <th className="px-4 py-3 font-medium text-text-secondary">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {analistas.map((a) => (
                        <AnalistaRow
                            key={a.id}
                            analista={a}
                            onEditar={onEditar}
                            onToggleEstado={onToggleEstado}
                            onResetPassword={onResetPassword}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function AnalistaRow({ analista, onEditar, onToggleEstado, onResetPassword }) {
    const isBloqueado = analista.estado === 'bloqueado'

    return (
        <tr className="border-b border-border last:border-0 hover:bg-surface/50">
            <td className="px-4 py-3 font-medium text-text-primary">{analista.nombre_completo}</td>
            <td className="px-4 py-3 text-text-secondary">{analista.dni}</td>
            <td className="px-4 py-3 text-text-secondary">{analista.email}</td>
            <td className="px-4 py-3 text-text-secondary">
                {analista.entidad_financiera?.nombre ?? '—'}
            </td>
            <td className="px-4 py-3">
                <EstadoUsuarioBadge estado={analista.estado} />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                    <ActionButton
                        icon="edit"
                        title="Editar"
                        onClick={() => onEditar(analista)}
                    />
                    <ActionButton
                        icon={isBloqueado ? 'unlock' : 'lock'}
                        title={isBloqueado ? 'Desbloquear' : 'Bloquear'}
                        onClick={() => onToggleEstado(analista)}
                        variant={isBloqueado ? 'success' : 'warning'}
                    />
                    <ActionButton
                        icon="key"
                        title="Resetear contraseña"
                        onClick={() => onResetPassword(analista)}
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
