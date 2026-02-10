import { supabase } from './client'

/**
 * Inicia sesión con email y contraseña.
 * Retorna { data, error } donde data contiene session y user.
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

/** Cierra la sesión activa */
export async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw new Error(error.message)
    }
}

/** Obtiene la sesión actual (persistida en localStorage) */
export async function getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
        throw new Error(error.message)
    }

    return session
}

/** Obtiene el usuario de auth actualmente autenticado */
export async function getCurrentAuthUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        throw new Error(error.message)
    }

    return user
}

/** Suscripción a cambios de estado de autenticación */
export function onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
            callback(event, session)
        }
    )

    return subscription
}
