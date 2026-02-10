import { StatCard } from '../../shared/components/molecules/StatCard'
import { Icon } from '../../shared/components/atoms/Icon'

/** Grid de métricas principales del dashboard */
export function AuditMetricsGrid({ metricas }) {
    if (!metricas) return null

    const cards = [
        {
            label: 'Total de Consultas',
            value: metricas.totalConsultas.toLocaleString('es-PE'),
            icon: 'search',
        },
        {
            label: 'Consultas Hoy',
            value: metricas.consultasHoy.toLocaleString('es-PE'),
            icon: 'trendingUp',
        },
        {
            label: 'Total Solicitudes',
            value: metricas.totalSolicitudes.toLocaleString('es-PE'),
            icon: 'clipboard',
        },
        {
            label: 'Solicitudes Pendientes',
            value: metricas.solicitudesPendientes.toLocaleString('es-PE'),
            icon: 'alert',
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ label, value, icon }) => (
                <StatCard
                    key={label}
                    label={label}
                    value={value}
                    icon={<Icon name={icon} className="h-5 w-5" />}
                />
            ))}
        </div>
    )
}
