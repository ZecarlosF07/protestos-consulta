import { Link, useLocation } from 'react-router-dom'

import { Icon } from '../atoms/Icon'

/** Enlace individual del sidebar con ícono y estado activo */
export function SidebarNavItem({ label, path, icon }) {
    const location = useLocation()
    const isActive = location.pathname === path

    const baseClasses = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
    const activeClasses = isActive
        ? 'bg-accent/10 text-accent'
        : 'text-text-secondary hover:bg-surface-dark hover:text-text-primary'

    return (
        <Link to={path} className={`${baseClasses} ${activeClasses}`}>
            <Icon name={icon} className="h-5 w-5 shrink-0" />
            <span>{label}</span>
        </Link>
    )
}
