import { supabase } from '../../../services/supabase/client'

const ENTIDAD_SELECT = 'id, nombre, estado, created_at, updated_at'

/** Obtiene todas las entidades financieras (no eliminadas) */
export async function obtenerEntidades() {
    const { data, error } = await supabase
        .from('entidades_financieras')
        .select(ENTIDAD_SELECT)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data ?? []
}

/** Obtiene el conteo de analistas por entidad */
export async function obtenerConteoAnalistas(entidadIds) {
    if (!entidadIds.length) return {}

    const { data, error } = await supabase
        .from('usuarios')
        .select('entidad_financiera_id')
        .eq('rol', 'analista')
        .is('deleted_at', null)
        .in('entidad_financiera_id', entidadIds)

    if (error) throw new Error(error.message)

    return (data ?? []).reduce((acc, u) => {
        acc[u.entidad_financiera_id] = (acc[u.entidad_financiera_id] || 0) + 1
        return acc
    }, {})
}

/** Valida que no exista otra entidad con el mismo nombre */
async function validarNombreUnico(nombre, excludeId = null) {
    const query = supabase
        .from('entidades_financieras')
        .select('id')
        .ilike('nombre', nombre.trim())
        .is('deleted_at', null)

    if (excludeId) {
        query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    if (data && data.length > 0) {
        throw new Error('Ya existe una entidad financiera con ese nombre')
    }
}

/** Crea una nueva entidad financiera */
export async function crearEntidad({ nombre }) {
    await validarNombreUnico(nombre)

    const { data, error } = await supabase
        .from('entidades_financieras')
        .insert({
            nombre: nombre.trim(),
            estado: 'activa',
        })
        .select(ENTIDAD_SELECT)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/** Edita el nombre de una entidad financiera */
export async function editarEntidad(entidadId, { nombre }) {
    await validarNombreUnico(nombre, entidadId)

    const { data, error } = await supabase
        .from('entidades_financieras')
        .update({
            nombre: nombre.trim(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', entidadId)
        .select(ENTIDAD_SELECT)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/** Bloquea una entidad y todos sus analistas asociados */
export async function bloquearEntidad(entidadId) {
    const now = new Date().toISOString()

    const { error: entidadError } = await supabase
        .from('entidades_financieras')
        .update({ estado: 'bloqueada', updated_at: now })
        .eq('id', entidadId)

    if (entidadError) throw new Error(entidadError.message)

    // Bloqueo en cascada de analistas asociados
    const { error: analistasError } = await supabase
        .from('usuarios')
        .update({ estado: 'bloqueado', updated_at: now })
        .eq('entidad_financiera_id', entidadId)
        .eq('rol', 'analista')
        .is('deleted_at', null)

    if (analistasError) throw new Error(analistasError.message)
}

/** Desbloquea una entidad financiera */
export async function desbloquearEntidad(entidadId) {
    const { error } = await supabase
        .from('entidades_financieras')
        .update({
            estado: 'activa',
            updated_at: new Date().toISOString(),
        })
        .eq('id', entidadId)

    if (error) throw new Error(error.message)
}
