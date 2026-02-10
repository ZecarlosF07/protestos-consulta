import { Outlet } from 'react-router-dom'

import { Sidebar } from './Sidebar'

/**
 * Template de layout con sidebar fijo + área de contenido scrollable.
 * Compartido entre AdminLayout y AnalystLayout.
 */
export function AppShell({ navItems, appName, user, rolLabel, onSignOut }) {
    return (
        <div className="flex h-screen overflow-hidden bg-surface">
            <Sidebar
                navItems={navItems}
                appName={appName}
                user={user}
                rolLabel={rolLabel}
                onSignOut={onSignOut}
            />

            <main className="flex-1 overflow-y-auto px-8 py-6">
                <div className="mx-auto max-w-6xl">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
