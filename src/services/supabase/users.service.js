import { supabase } from './client'

/**
 * Obtiene el perfil del usuario desde la tabla `usuarios`.
 * Incluye la entidad financiera asociada.
 */
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('usuarios')
        .select(`
      *,
      entidad_financiera:entidades_financieras(id, nombre, estado)
    `)
        .eq('id', userId)
        .is('deleted_at', null)
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

/** Verifica si el usuario está activo y su entidad no está bloqueada */
export function isUserOperational(userProfile) {
    if (!userProfile) return false
    if (userProfile.estado !== 'activo') return false

    // Admin no requiere entidad financiera
    if (userProfile.rol === 'admin') return true

    // Analista: verificar que la entidad esté activa
    if (!userProfile.entidad_financiera) return false

    return userProfile.entidad_financiera.estado === 'activa'
}
