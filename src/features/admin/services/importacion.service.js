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

export async function insertarProtestoDesdeImportacion(protesto) {
    const payload = {
        secuencia: protesto.secuencia,
        tipo_documento: protesto.tipo_documento,
        numero_documento: protesto.numero_documento,
        nombre_persona: protesto.nombre_persona,
        entidad_financiadora: protesto.entidad_financiadora,
        entidad_fuente: protesto.entidad_fuente,
        monto: protesto.monto,
        fecha_protesto: protesto.fecha_protesto,
        tarifa_levantamiento: protesto.tarifa_levantamiento ?? null,
        importacion_id: protesto.importacion_id ?? null,
        estado: protesto.estado ?? 'vigente',
    }

    const { error } = await supabase
        .from('protestos')
        .insert(payload)

    if (error) throw new Error(error.message)
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
        ;(data ?? []).forEach(row => existentes.add(row.secuencia))
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
