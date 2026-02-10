import { supabase } from '../../../services/supabase/client'

/**
 * Obtiene métricas globales de uso del sistema.
 * @returns {Promise<{ totalConsultas: number, consultasHoy: number, totalSolicitudes: number, solicitudesPendientes: number }>}
 */
export async function obtenerMetricasGlobales() {
    const hoyInicio = new Date()
    hoyInicio.setHours(0, 0, 0, 0)

    const [consultasRes, consultasHoyRes, solicitudesRes, pendientesRes] =
        await Promise.all([
            supabase.from('consultas').select('id', { count: 'exact', head: true }),
            supabase
                .from('consultas')
                .select('id', { count: 'exact', head: true })
                .gte('fecha_consulta', hoyInicio.toISOString()),
            supabase
                .from('solicitudes_levantamiento')
                .select('id', { count: 'exact', head: true })
                .is('deleted_at', null),
            supabase
                .from('solicitudes_levantamiento')
                .select('id', { count: 'exact', head: true })
                .is('deleted_at', null)
                .in('estado', ['registrada', 'en_revision']),
        ])

    return {
        totalConsultas: consultasRes.count ?? 0,
        consultasHoy: consultasHoyRes.count ?? 0,
        totalSolicitudes: solicitudesRes.count ?? 0,
        solicitudesPendientes: pendientesRes.count ?? 0,
    }
}

/**
 * Obtiene consultas agrupadas por entidad financiera.
 * @returns {Promise<Array<{ entidad_nombre: string, total: number }>>}
 */
export async function obtenerConsultasPorEntidad() {
    const { data, error } = await supabase
        .from('consultas')
        .select(`
            entidad_financiera_id,
            entidad_financiera:entidades_financieras(nombre)
        `)

    if (error) throw new Error(error.message)

    const agrupado = (data ?? []).reduce((acc, item) => {
        const nombre = item.entidad_financiera?.nombre ?? 'Sin entidad'
        acc[nombre] = (acc[nombre] || 0) + 1
        return acc
    }, {})

    return Object.entries(agrupado)
        .map(([entidad_nombre, total]) => ({ entidad_nombre, total }))
        .sort((a, b) => b.total - a.total)
}

/**
 * Obtiene top 10 analistas con mayor número de consultas.
 * @returns {Promise<Array<{ analista_nombre: string, entidad_nombre: string, total: number }>>}
 */
export async function obtenerTopAnalistas() {
    const { data, error } = await supabase
        .from('consultas')
        .select(`
            usuario_id,
            usuario:usuarios(nombre_completo),
            entidad_financiera:entidades_financieras(nombre)
        `)

    if (error) throw new Error(error.message)

    const agrupado = (data ?? []).reduce((acc, item) => {
        const key = item.usuario_id
        if (!acc[key]) {
            acc[key] = {
                analista_nombre: item.usuario?.nombre_completo ?? 'Desconocido',
                entidad_nombre: item.entidad_financiera?.nombre ?? 'Sin entidad',
                total: 0,
            }
        }
        acc[key].total += 1
        return acc
    }, {})

    return Object.values(agrupado)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
}

/**
 * Obtiene los últimos registros de auditoría.
 * @param {number} limite
 * @returns {Promise<Array>}
 */
export async function obtenerRegistrosAuditoria(limite = 20) {
    const { data, error } = await supabase
        .from('auditoria')
        .select(`
            id,
            accion,
            descripcion,
            entidad_afectada,
            metadata,
            created_at,
            usuario:usuarios(nombre_completo)
        `)
        .order('created_at', { ascending: false })
        .limit(limite)

    if (error) throw new Error(error.message)

    return data ?? []
}
