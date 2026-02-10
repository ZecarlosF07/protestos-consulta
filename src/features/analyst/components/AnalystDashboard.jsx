import { useEffect, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { StatCard } from '../../shared/components/molecules/StatCard'
import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { supabase } from '../../../services/supabase/client'

export function AnalystDashboard() {
    const { user } = useAuth()
    const { stats, isLoading } = useAnalystStats(user?.id)

    const entityName = user?.entidad_financiera?.nombre
    const subtitle = entityName
        ? `${user?.nombre_completo} — ${entityName}`
        : user?.nombre_completo

    const cards = [
        {
            label: 'Consultas realizadas',
            value: isLoading ? '...' : stats.consultas.toLocaleString('es-PE'),
            icon: 'search',
        },
        {
            label: 'Solicitudes activas',
            value: isLoading ? '...' : stats.solicitudesActivas.toLocaleString('es-PE'),
            icon: 'clipboard',
        },
    ]

    return (
        <div>
            <PageHeader
                title="Panel del Analista"
                subtitle={`Bienvenido, ${subtitle}`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cards.map(({ label, value, icon }) => (
                    <StatCard
                        key={label}
                        label={label}
                        value={value}
                        icon={<Icon name={icon} className="h-5 w-5" />}
                    />
                ))}
            </div>

            <div className="mt-8">
                <Card>
                    <h3 className="text-sm font-semibold text-text-primary">
                        Módulos disponibles
                    </h3>
                    <p className="mt-3 text-sm text-text-muted">
                        Usa el menú lateral para consultar protestos, gestionar solicitudes de levantamiento o ver tu historial.
                    </p>
                </Card>
            </div>
        </div>
    )
}

/** Hook interno para cargar stats del analista */
function useAnalystStats(userId) {
    const [stats, setStats] = useState({ consultas: 0, solicitudesActivas: 0 })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!userId) return

        async function load() {
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
        }

        load()
    }, [userId])

    return { stats, isLoading }
}
