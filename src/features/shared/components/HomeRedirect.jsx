import { Navigate } from 'react-router-dom'

import { ROLES } from '../../../config/roles'
import { ROUTES } from '../../../config/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { LoadingScreen } from '../../shared/components/LoadingScreen'

/** Redirige al dashboard según el rol del usuario autenticado */
export function HomeRedirect() {
    const { isAuthenticated, user, loading } = useAuth()

    if (loading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    const destination = user?.rol === ROLES.ADMIN
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.ANALYST_DASHBOARD

    return <Navigate to={destination} replace />
}
