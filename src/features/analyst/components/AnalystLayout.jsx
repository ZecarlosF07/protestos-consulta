import { ANALYST_NAV_ITEMS } from '../../../config/navigation'
import { APP_NAME } from '../../../config/env'
import { useAuth } from '../../auth/hooks/useAuth'
import { AppShell } from '../../shared/components/organisms/AppShell'

export function AnalystLayout() {
    const { user, signOut } = useAuth()

    return (
        <AppShell
            navItems={ANALYST_NAV_ITEMS}
            appName={APP_NAME}
            user={user}
            rolLabel="Analista"
            onSignOut={signOut}
        />
    )
}
