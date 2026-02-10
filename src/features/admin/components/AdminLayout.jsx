import { Link, Outlet, useLocation } from 'react-router-dom'

import { ROUTES } from '../../../config/routes'
import { APP_NAME } from '../../../config/env'
import { useAuth } from '../../auth/hooks/useAuth'

const NAV_ITEMS = [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Analistas', path: ROUTES.ADMIN_ANALYSTS },
    { label: 'Protestos', path: ROUTES.ADMIN_PROTESTS },
    { label: 'Importar', path: ROUTES.ADMIN_IMPORT },
    { label: 'Auditoría', path: ROUTES.ADMIN_AUDIT },
]

export function AdminLayout() {
    const { user, signOut } = useAuth()
    const location = useLocation()

    return (
        <div className="flex min-h-screen flex-col bg-surface">
            <header className="border-b border-border bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-8">
                        <h1 className="text-lg font-bold text-text-primary">{APP_NAME}</h1>
                        <nav className="flex gap-1">
                            {NAV_ITEMS.map(({ label, path }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === path
                                        ? 'bg-primary/5 text-primary'
                                        : 'text-text-secondary hover:bg-surface-dark hover:text-text-primary'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary">
                            {user?.nombre_completo}
                        </span>
                        <button
                            onClick={signOut}
                            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-dark hover:text-text-primary"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">
                <Outlet />
            </main>
        </div>
    )
}
