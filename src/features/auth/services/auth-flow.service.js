import { registrarAuditoria } from '../../../services/supabase/audit.service'
import {
    signIn as authSignIn,
    signOut as authSignOut,
} from '../../../services/supabase/auth.service'
import { getUserProfile, isUserOperational } from '../../../services/supabase/users.service'

/**
 * Ejecuta el flujo de login: auth + validación de estado + auditoría.
 * @returns {Promise<Object>} perfil del usuario
 */
export async function ejecutarLogin(email, password) {
    const data = await authSignIn(email, password)
    const profile = await getUserProfile(data.user.id)

    if (!isUserOperational(profile)) {
        await authSignOut()

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

    registrarAuditoria({
        usuarioId: data.user.id,
        entidadFinancieraId: profile?.entidad_financiera_id,
        accion: 'LOGIN_EXITOSO',
        descripcion: `Inicio de sesión: ${profile.nombre_completo}`,
    })

    return profile
}

/**
 * Ejecuta el flujo de logout: auditoría + signOut de Supabase.
 */
export async function ejecutarLogout(userProfile) {
    if (userProfile) {
        registrarAuditoria({
            usuarioId: userProfile.id,
            entidadFinancieraId: userProfile.entidad_financiera_id,
            accion: 'LOGOUT',
            descripcion: `Cierre de sesión: ${userProfile.nombre_completo}`,
        })
    }

    await authSignOut()
}

/**
 * Interpreta errores de autenticación con mensajes amigables.
 */
export function interpretarErrorAuth(err) {
    if (err.message === 'Invalid login credentials') {
        return 'Credenciales incorrectas. Verifique su email y contraseña.'
    }

    return err.message
}
