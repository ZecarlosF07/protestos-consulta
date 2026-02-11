import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ROLES } from '../../../config/roles'
import {
    getCurrentSession,
    onAuthStateChange,
} from '../../../services/supabase/auth.service'
import { getUserProfile } from '../../../services/supabase/users.service'
import { ejecutarLogin, ejecutarLogout, interpretarErrorAuth } from '../services/auth-flow.service'
import { AuthContext } from './auth-context-def'

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const mountedRef = useRef(true)
    const sessionTokenRef = useRef(null)

    const loadUserProfile = useCallback(async (userId) => {
        try {
            const profile = await getUserProfile(userId)
            if (mountedRef.current) setUserProfile(profile)
            return profile
        } catch (err) {
            console.error('Error al cargar perfil:', err.message)
            if (mountedRef.current) setUserProfile(null)
            return null
        }
    }, [])

    useEffect(() => {
        mountedRef.current = true

        async function initializeAuth() {
            try {
                const currentSession = await getCurrentSession()
                if (!mountedRef.current) return

                if (currentSession?.user) {
                    sessionTokenRef.current = currentSession.access_token
                    setSession(currentSession)
                    await loadUserProfile(currentSession.user.id)
                }
            } catch (err) {
                console.error('Error inicializando auth:', err.message)
            } finally {
                if (mountedRef.current) setLoading(false)
            }
        }

        initializeAuth()

        const subscription = onAuthStateChange(async (event, newSession) => {
            if (!mountedRef.current) return

            if (event === 'SIGNED_IN' && newSession?.user) {
                sessionTokenRef.current = newSession.access_token
                setSession(newSession)
                // Solo cargar perfil si no existe aún (evita recarga al volver de otra ventana)
                if (!userProfile) {
                    await loadUserProfile(newSession.user.id)
                }
                return
            }

            if (event === 'SIGNED_OUT') {
                sessionTokenRef.current = null
                setSession(null)
                setUserProfile(null)
                return
            }

            // TOKEN_REFRESHED: solo actualizar si el token realmente cambió
            if (event === 'TOKEN_REFRESHED' && newSession) {
                if (newSession.access_token === sessionTokenRef.current) return
                sessionTokenRef.current = newSession.access_token
                setSession(newSession)
            }
        })

        return () => {
            mountedRef.current = false
            subscription.unsubscribe()
        }
    }, [loadUserProfile])

    const signIn = useCallback(async (email, password) => {
        setError(null)

        try {
            const profile = await ejecutarLogin(email, password)
            if (mountedRef.current) setUserProfile(profile)
            return profile
        } catch (err) {
            const message = interpretarErrorAuth(err)
            if (mountedRef.current) setError(message)
            throw new Error(message)
        }
    }, [])

    const signOut = useCallback(async () => {
        await ejecutarLogout(userProfile)

        if (mountedRef.current) {
            sessionTokenRef.current = null
            setSession(null)
            setUserProfile(null)
            setError(null)
        }
    }, [userProfile])

    // session se excluye de las dependencias del memo para evitar re-renders
    // cuando solo cambia el token (ej: al volver de otra ventana).
    // isAuthenticated usa sessionTokenRef que siempre está sincronizado.
    const value = useMemo(() => ({
        user: userProfile,
        loading,
        error,
        isAuthenticated: !!sessionTokenRef.current && !!userProfile,
        isAdmin: userProfile?.rol === ROLES.ADMIN,
        isAnalista: userProfile?.rol === ROLES.ANALISTA,
        signIn,
        signOut,
        clearError: () => setError(null),
    }), [userProfile, loading, error, signIn, signOut])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
