import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { ROLES } from '../../config/roles'
import { registrarAuditoria } from '../../services/supabase/audit.service'
import {
    getCurrentSession,
    onAuthStateChange,
    signIn as authSignIn,
    signOut as authSignOut,
} from '../services/supabase/auth.service'
import { getUserProfile, isUserOperational } from '../services/supabase/users.service'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadUserProfile = useCallback(async (userId) => {
        try {
            const profile = await getUserProfile(userId)
            setUserProfile(profile)
            return profile
        } catch (err) {
            console.error('Error al cargar perfil:', err.message)
            setUserProfile(null)
            return null
        }
    }, [])

    useEffect(() => {
        let mounted = true

        async function initializeAuth() {
            try {
                const currentSession = await getCurrentSession()

                if (!mounted) return

                if (currentSession?.user) {
                    setSession(currentSession)
                    await loadUserProfile(currentSession.user.id)
                }
            } catch (err) {
                console.error('Error inicializando auth:', err.message)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        initializeAuth()

        const subscription = onAuthStateChange(async (event, newSession) => {
            if (!mounted) return

            setSession(newSession)

            if (event === 'SIGNED_IN' && newSession?.user) {
                await loadUserProfile(newSession.user.id)
            }

            if (event === 'SIGNED_OUT') {
                setUserProfile(null)
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [loadUserProfile])

    const signIn = useCallback(async (email, password) => {
        setError(null)

        try {
            const data = await authSignIn(email, password)
            const profile = await getUserProfile(data.user.id)

            if (!isUserOperational(profile)) {
                await authSignOut()
                setSession(null)
                setUserProfile(null)

                registrarAuditoria({
                    usuarioId: data.user.id,
                    entidadFinancieraId: profile?.entidad_financiera_id,
                    accion: 'LOGIN_BLOQUEADO',
                    descripcion: 'Intento de acceso con cuenta bloqueada o entidad inactiva',
                })

                const reason = profile?.estado === 'bloqueado'
                    ? 'Tu cuenta se encuentra bloqueada.'
                    : 'Tu entidad financiera se encuentra bloqueada.'

                throw new Error(reason)
            }

            setUserProfile(profile)

            registrarAuditoria({
                usuarioId: data.user.id,
                entidadFinancieraId: profile?.entidad_financiera_id,
                accion: 'LOGIN_EXITOSO',
                descripcion: `Inicio de sesión: ${profile.nombre_completo}`,
            })

            return profile
        } catch (err) {
            const message = err.message === 'Invalid login credentials'
                ? 'Credenciales incorrectas. Verifique su email y contraseña.'
                : err.message

            setError(message)
            throw new Error(message)
        }
    }, [])

    const signOut = useCallback(async () => {
        if (userProfile) {
            registrarAuditoria({
                usuarioId: userProfile.id,
                entidadFinancieraId: userProfile.entidad_financiera_id,
                accion: 'LOGOUT',
                descripcion: `Cierre de sesión: ${userProfile.nombre_completo}`,
            })
        }

        await authSignOut()
        setSession(null)
        setUserProfile(null)
        setError(null)
    }, [userProfile])

    const value = useMemo(() => ({
        session,
        user: userProfile,
        loading,
        error,
        isAuthenticated: !!session && !!userProfile,
        isAdmin: userProfile?.rol === ROLES.ADMIN,
        isAnalista: userProfile?.rol === ROLES.ANALISTA,
        signIn,
        signOut,
        clearError: () => setError(null),
    }), [session, userProfile, loading, error, signIn, signOut])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
