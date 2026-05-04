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
 * Utiliza la RPC administrativa `crear_usuario`; no usa flujo de auto-registro.
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
    const { data: userId, error: rpcError } = await supabase.rpc('crear_usuario', {
        p_email: email,
        p_password: password,
        p_nombre: nombre_completo,
        p_dni: dni,
        p_telefono: telefono || null,
        p_cargo: cargo || null,
        p_rol: 'analista',
        p_entidad_id: entidad_financiera_id,
    })

    if (rpcError) throw new Error(rpcError.message)

    const { data, error } = await supabase
        .from('usuarios')
        .select(ANALISTA_SELECT)
        .eq('id', userId)
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
