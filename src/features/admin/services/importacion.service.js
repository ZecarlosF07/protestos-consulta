import { supabase } from '../../../services/supabase/client'

const IMPORTACION_SELECT = `
    id,
    nombre_archivo,
    total_registros,
    registros_exitosos,
    registros_error,
    estado,
    created_at,
    usuario:usuarios(nombre_completo)
`

export async function crearImportacionProtestos({ usuarioId, nombreArchivo }) {
    const { data, error } = await supabase
        .from('importaciones_protestos')
        .insert({
            usuario_id: usuarioId,
            nombre_archivo: nombreArchivo,
            estado: 'procesando',
        })
        .select('id')
        .single()

    if (error) throw new Error(error.message)
    return data.id
}

export async function actualizarImportacionProtestos(importacionId, payload) {
    const { error } = await supabase
        .from('importaciones_protestos')
        .update(payload)
        .eq('id', importacionId)

    if (error) throw new Error(error.message)
}

export async function importarProtestosAtomicos(importacionId, protestos) {
    const { data, error } = await supabase.rpc('importar_protestos_atomicos', {
        p_importacion_id: importacionId,
        p_protestos: protestos,
    })

    if (error) throw new Error(error.message)
    return data ?? 0
}

export async function obtenerSecuenciasExistentes(secuencias) {
    if (!secuencias.length) return new Set()
    const secuenciasUnicas = [...new Set(secuencias)]
    const existentes = new Set()

    for (let i = 0; i < secuenciasUnicas.length; i += 300) {
        const chunk = secuenciasUnicas.slice(i, i + 300)
        const { data, error } = await supabase
            .from('protestos')
            .select('secuencia')
            .in('secuencia', chunk)
            .is('deleted_at', null)

        if (error) throw new Error(error.message)

        const rows = data ?? []
        rows.forEach(row => existentes.add(row.secuencia))
    }
    return existentes
}

export async function obtenerHistorialImportaciones(limit = 10) {
    const { data, error } = await supabase
        .from('importaciones_protestos')
        .select(IMPORTACION_SELECT)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message)
    return data ?? []
}
