import { Navigate } from 'react-router-dom'

import { ROUTES } from '../../../config/routes'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from '../../shared/components/LoadingScreen'

/**
 * Protege rutas que requieren autenticación.
 * Opcionalmente filtra por roles permitidos.
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, user, loading } = useAuth()

    if (loading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
        return <Navigate to={ROUTES.HOME} replace />
    }

    return children
}
