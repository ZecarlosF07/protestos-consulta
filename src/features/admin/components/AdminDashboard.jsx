import { useAuth } from '../../auth/hooks/useAuth'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { StatCard } from '../../shared/components/molecules/StatCard'
import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { useMetricasDashboard } from '../../auditoria/hooks/useMetricasDashboard'

export function AdminDashboard() {
    const { user } = useAuth()
    const { metricas, registrosAuditoria, isLoading } = useMetricasDashboard()

    const stats = [
        {
            label: 'Total Consultas',
            value: isLoading ? '...' : (metricas?.totalConsultas?.toLocaleString('es-PE') ?? '—'),
            icon: 'search',
        },
        {
            label: 'Consultas Hoy',
            value: isLoading ? '...' : (metricas?.consultasHoy?.toLocaleString('es-PE') ?? '—'),
            icon: 'trendingUp',
        },
        {
            label: 'Total Solicitudes',
            value: isLoading ? '...' : (metricas?.totalSolicitudes?.toLocaleString('es-PE') ?? '—'),
            icon: 'clipboard',
        },
        {
            label: 'Pendientes',
            value: isLoading ? '...' : (metricas?.solicitudesPendientes?.toLocaleString('es-PE') ?? '—'),
            icon: 'alert',
        },
    ]

    return (
        <div>
            <PageHeader
                title="Panel de Administración"
                subtitle={`Bienvenido, ${user?.nombre_completo}`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, icon }) => (
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
                        Actividad reciente
                    </h3>
                    {registrosAuditoria.length === 0 ? (
                        <p className="mt-3 text-sm text-text-muted">
                            Sin actividad registrada.
                        </p>
                    ) : (
                        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                            {registrosAuditoria.slice(0, 5).map((r) => (
                                <div key={r.id} className="flex items-center gap-2 text-sm">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                    <span className="text-text-secondary">
                                        {r.usuario?.nombre_completo}:
                                    </span>
                                    <span className="text-text-primary">
                                        {r.descripcion ?? r.accion}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
