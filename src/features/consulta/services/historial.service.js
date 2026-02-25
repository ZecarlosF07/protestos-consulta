import { supabase } from '../../../services/supabase/client'
import { HISTORIAL_PAGE_SIZE } from '../types/historial.types'

/**
 * Obtiene el historial de consultas de un analista con filtros y paginación.
 * @param {string} usuarioId
 * @param {import('../types/historial.types').HistorialFiltros} filtros
 * @param {number} pagina - Página actual (0-indexed)
 * @returns {Promise<{ data: import('../types/historial.types').ConsultaHistorial[], count: number }>}
 */
export async function obtenerHistorialConsultas(usuarioId, filtros, pagina = 0) {
    const desde = pagina * HISTORIAL_PAGE_SIZE
    const hasta = desde + HISTORIAL_PAGE_SIZE - 1

    let query = supabase
        .from('consultas')
        .select('*', { count: 'exact' })
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: false })
        .range(desde, hasta)

    if (filtros.busqueda?.trim()) {
        query = query.ilike('numero_documento', `%${filtros.busqueda.trim()}%`)
    }

    if (filtros.fechaDesde) {
        query = query.gte('created_at', `${filtros.fechaDesde}T00:00:00`)
    }

    if (filtros.fechaHasta) {
        query = query.lte('created_at', `${filtros.fechaHasta}T23:59:59`)
    }

    const { data, error, count } = await query

    if (error) {
        throw new Error(error.message)
    }

    return { data: data ?? [], count: count ?? 0 }
}
