import { supabase } from '../../../services/supabase/client'
import { PAGE_SIZE, PROTESTO_TRANSITIONS } from '../types/admin.types'

const PROTESTO_SELECT = `
    id, secuencia, tipo_documento, numero_documento,
    nombre_persona, entidad_financiadora, entidad_fuente,
    monto, fecha_protesto, tarifa_levantamiento,
    estado, created_at, updated_at
`

/**
 * Obtiene protestos paginados con filtros opcionales.
 * @param {{ estado?: string, entidad?: string, fechaDesde?: string, fechaHasta?: string, busqueda?: string, page?: number }} filtros
 */
export async function obtenerProtestos(filtros = {}) {
    const { estado, entidad, fechaDesde, fechaHasta, busqueda, page = 1 } = filtros

    let query = supabase
        .from('protestos')
        .select(PROTESTO_SELECT, { count: 'exact' })
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (estado) {
        query = query.eq('estado', estado)
    }

    if (entidad) {
        query = query.ilike('entidad_financiadora', `%${entidad}%`)
    }

    if (fechaDesde) {
        query = query.gte('fecha_protesto', fechaDesde)
    }

    if (fechaHasta) {
        query = query.lte('fecha_protesto', fechaHasta)
    }

    if (busqueda) {
        query = query.or(
            `numero_documento.ilike.%${busqueda}%,nombre_persona.ilike.%${busqueda}%,secuencia.ilike.%${busqueda}%`
        )
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw new Error(error.message)

    return {
        protestos: data ?? [],
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
        currentPage: page,
    }
}

/** Obtiene un protesto por ID */
export async function obtenerProtestoPorId(protestoId) {
    const { data, error } = await supabase
        .from('protestos')
        .select(PROTESTO_SELECT)
        .eq('id', protestoId)
        .is('deleted_at', null)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/**
 * Cambia el estado de un protesto respetando reglas de negocio.
 * Valida transiciones permitidas.
 */
export async function cambiarEstadoProtestoAdmin(protestoId, nuevoEstado) {
    const protesto = await obtenerProtestoPorId(protestoId)

    const transicionesPermitidas = PROTESTO_TRANSITIONS[protesto.estado]
    if (!transicionesPermitidas?.includes(nuevoEstado)) {
        throw new Error(
            `Transición no permitida: ${protesto.estado} → ${nuevoEstado}`
        )
    }

    const { data, error } = await supabase
        .from('protestos')
        .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
        .eq('id', protestoId)
        .select(PROTESTO_SELECT)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/** Obtiene historial de auditoría de un protesto */
export async function obtenerHistorialProtesto(protestoId) {
    const { data, error } = await supabase
        .from('auditoria')
        .select(`
            id, accion, descripcion, metadata, created_at,
            usuario:usuarios(nombre_completo)
        `)
        .eq('entidad_afectada', 'protesto')
        .eq('entidad_afectada_id', protestoId)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) throw new Error(error.message)

    return data ?? []
}

/** Obtiene las entidades financiadoras únicas para el filtro */
export async function obtenerEntidadesFinanciadoras() {
    const { data, error } = await supabase
        .from('protestos')
        .select('entidad_financiadora')
        .is('deleted_at', null)

    if (error) throw new Error(error.message)

    const unicas = [...new Set((data ?? []).map(p => p.entidad_financiadora).filter(Boolean))]
    return unicas.sort()
}
