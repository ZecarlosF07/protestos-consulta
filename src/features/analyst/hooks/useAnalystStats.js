import { useCallback, useEffect, useState } from 'react'

import { supabase } from '../../../services/supabase/client'

/** Hook para cargar estadísticas del dashboard del analista */
export function useAnalystStats(userId) {
    const [stats, setStats] = useState({ consultas: 0, solicitudesActivas: 0 })
    const [isLoading, setIsLoading] = useState(true)

    const cargar = useCallback(async () => {
        if (!userId) return

        setIsLoading(true)

        try {
            const [consultasRes, solicitudesRes] = await Promise.all([
                supabase
                    .from('consultas')
                    .select('id', { count: 'exact', head: true })
                    .eq('usuario_id', userId),
                supabase
                    .from('solicitudes_levantamiento')
                    .select('id', { count: 'exact', head: true })
                    .eq('usuario_id', userId)
                    .is('deleted_at', null)
                    .in('estado', ['registrada', 'en_revision']),
            ])

            setStats({
                consultas: consultasRes.count ?? 0,
                solicitudesActivas: solicitudesRes.count ?? 0,
            })
        } catch (err) {
            console.error('Error cargando stats del analista:', err.message)
        } finally {
            setIsLoading(false)
        }
    }, [userId])

    useEffect(() => {
        cargar()
    }, [cargar])

    return { stats, isLoading }
}
