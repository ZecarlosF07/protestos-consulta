import { Link } from 'react-router-dom'

import { Icon } from '../../shared/components/atoms/Icon'

/** Tarjeta de acceso rápido a un módulo del sistema */
export function ModuleCard({ title, description, icon, to }) {
    return (
        <Link
            to={to}
            className="group flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:border-accent/30 hover:shadow-sm"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon name={icon} className="h-5 w-5" />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {title}
                </h4>
                <p className="mt-1 text-xs text-text-muted leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="ml-auto flex items-center self-center text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
                <Icon name="arrowRight" className="h-4 w-4" />
            </div>
        </Link>
    )
}
