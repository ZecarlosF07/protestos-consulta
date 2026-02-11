import { useNavigate } from 'react-router-dom'

import { ROUTES } from '../../../../config/routes'
import { SidebarNavItem } from '../molecules/SidebarNavItem'
import { UserInfoBlock } from '../molecules/UserInfoBlock'
import { Icon } from '../atoms/Icon'

/** Sidebar de navegación reutilizable para cualquier layout por rol */
export function Sidebar({ navItems, appName, user, rolLabel, onSignOut }) {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await onSignOut()
        navigate(ROUTES.LOGIN, { replace: true })
    }

    return (
        <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-white">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                <span className="text-base font-bold text-text-primary">
                    {appName}
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navItems.map((item) => (
                    <SidebarNavItem
                        key={item.path}
                        label={item.label}
                        path={item.path}
                        icon={item.icon}
                    />
                ))}
            </nav>

            <div className="border-t border-border px-3 py-4">
                <UserInfoBlock
                    name={user?.nombre_completo}
                    role={rolLabel}
                    entity={user?.entidad_financiera?.nombre}
                />

                <button
                    onClick={handleSignOut}
                    className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark hover:text-text-primary"
                >
                    <Icon name="logout" className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    )
}
