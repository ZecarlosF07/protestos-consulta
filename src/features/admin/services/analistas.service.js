import { supabase } from '../../../services/supabase/client'

const ANALISTA_SELECT = `
    id, email, nombre_completo, dni, telefono, cargo, rol,
    entidad_financiera_id, estado, created_at,
    entidad_financiera:entidades_financieras(id, nombre)
`

/** Obtiene todos los analistas (no eliminados) */
export async function obtenerAnalistas() {
    const { data, error } = await supabase
        .from('usuarios')
        .select(ANALISTA_SELECT)
        .eq('rol', 'analista')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data ?? []
}

/** Obtiene las entidades financieras activas para selects */
export async function obtenerEntidadesFinancieras() {
    const { data, error } = await supabase
        .from('entidades_financieras')
        .select('id, nombre')
        .eq('estado', 'activa')
        .is('deleted_at', null)
        .order('nombre')

    if (error) throw new Error(error.message)

    return data ?? []
}

/**
 * Crea un nuevo analista: usuario en auth + registro en tabla usuarios.
 * Utiliza supabase.auth.admin via edge function o directamente.
 */
export async function crearAnalista({
    email,
    password,
    nombre_completo,
    dni,
    telefono,
    cargo,
    entidad_financiera_id,
}) {
    // Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { nombre_completo, dni, rol: 'analista' },
        },
    })

    if (authError) throw new Error(authError.message)

    // Insertar en tabla usuarios
    const { data, error } = await supabase
        .from('usuarios')
        .insert({
            id: authData.user.id,
            email,
            nombre_completo,
            dni,
            telefono,
            cargo,
            rol: 'analista',
            entidad_financiera_id,
            estado: 'activo',
        })
        .select(ANALISTA_SELECT)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/** Actualiza datos básicos de un analista */
export async function editarAnalista(analistaId, updates) {
    const { data, error } = await supabase
        .from('usuarios')
        .update({
            nombre_completo: updates.nombre_completo,
            telefono: updates.telefono,
            cargo: updates.cargo,
            entidad_financiera_id: updates.entidad_financiera_id,
            updated_at: new Date().toISOString(),
        })
        .eq('id', analistaId)
        .select(ANALISTA_SELECT)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/** Bloquea un analista (cambia estado a 'bloqueado') */
export async function bloquearAnalista(analistaId) {
    const { error } = await supabase
        .from('usuarios')
        .update({ estado: 'bloqueado', updated_at: new Date().toISOString() })
        .eq('id', analistaId)

    if (error) throw new Error(error.message)
}

/** Desbloquea un analista (cambia estado a 'activo') */
export async function desbloquearAnalista(analistaId) {
    const { error } = await supabase
        .from('usuarios')
        .update({ estado: 'activo', updated_at: new Date().toISOString() })
        .eq('id', analistaId)

    if (error) throw new Error(error.message)
}

/** Resetea la contraseña de un analista directamente (admin) */
export async function resetearPasswordAnalista(userId, newPassword) {
    const { error } = await supabase.rpc('resetear_password', {
        p_user_id: userId,
        p_password: newPassword,
    })

    if (error) throw new Error(error.message)
}
