import { Avatar } from '../atoms/Avatar'

/** Bloque de información del usuario en el sidebar */
export function UserInfoBlock({ name, role, entity }) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-surface-dark px-3 py-3">
            <Avatar name={name} size="md" />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                    {name}
                </p>
                <p className="truncate text-xs text-text-muted">
                    {entity || role}
                </p>
            </div>
        </div>
    )
}
