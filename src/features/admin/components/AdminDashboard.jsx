import { useAuth } from '../../auth/hooks/useAuth'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { StatCard } from '../../shared/components/molecules/StatCard'
import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'

const ADMIN_STATS = [
    { label: 'Analistas registrados', value: '—', icon: 'users' },
    { label: 'Protestos en sistema', value: '—', icon: 'file' },
    { label: 'Consultas hoy', value: '—', icon: 'search' },
    { label: 'Solicitudes pendientes', value: '—', icon: 'shield' },
]

export function AdminDashboard() {
    const { user } = useAuth()

    return (
        <div>
            <PageHeader
                title="Panel de Administración"
                subtitle={`Bienvenido, ${user?.nombre_completo}`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ADMIN_STATS.map(({ label, value, icon }) => (
                    <StatCard
                        key={label}
                        label={label}
                        value={value}
                        icon={<Icon name={icon} className="h-5 w-5" />}
                    />
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <h3 className="text-sm font-semibold text-text-primary">
                        Actividad reciente
                    </h3>
                    <p className="mt-3 text-sm text-text-muted">
                        Las últimas acciones registradas en el sistema se mostrarán aquí.
                    </p>
                </Card>

                <Card>
                    <h3 className="text-sm font-semibold text-text-primary">
                        Accesos rápidos
                    </h3>
                    <p className="mt-3 text-sm text-text-muted">
                        Acciones frecuentes de administración se habilitarán en hitos posteriores.
                    </p>
                </Card>
            </div>
        </div>
    )
}
