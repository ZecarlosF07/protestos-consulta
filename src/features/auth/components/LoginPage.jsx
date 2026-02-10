import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { ROLES } from '../../../config/roles'
import { ROUTES } from '../../../config/routes'
import { APP_NAME } from '../../../config/env'
import { useAuth } from '../hooks/useAuth'
import { LoginForm } from './LoginForm'

export function LoginPage() {
    const { isAuthenticated, user, signIn, error, clearError } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (isAuthenticated && user) {
        const redirectTo = user.rol === ROLES.ADMIN
            ? ROUTES.ADMIN_DASHBOARD
            : ROUTES.ANALYST_DASHBOARD

        return <Navigate to={redirectTo} replace />
    }

    async function handleLogin(email, password) {
        setIsSubmitting(true)
        clearError()

        try {
            await signIn(email, password)
        } catch {
            // Error ya manejado por AuthContext
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {APP_NAME}
                    </h1>
                    <p className="mt-2 text-sm text-text-secondary">
                        Cámara de Comercio de Ica
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold text-text-primary">
                        Iniciar sesión
                    </h2>

                    {error && (
                        <div className="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                            {error}
                        </div>
                    )}

                    <LoginForm
                        onSubmit={handleLogin}
                        isSubmitting={isSubmitting}
                    />
                </div>

                <p className="mt-6 text-center text-xs text-text-muted">
                    Acceso restringido. Solo usuarios autorizados por la Cámara de Comercio.
                </p>
            </div>
        </div>
    )
}
