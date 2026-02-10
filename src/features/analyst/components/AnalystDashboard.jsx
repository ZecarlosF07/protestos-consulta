import { useAuth } from '../../auth/hooks/useAuth'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { StatCard } from '../../shared/components/molecules/StatCard'
import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'

const ANALYST_STATS = [
    { label: 'Consultas realizadas', value: '—', icon: 'search' },
    { label: 'Solicitudes activas', value: '—', icon: 'file' },
]

export function AnalystDashboard() {
    const { user } = useAuth()

    const entityName = user?.entidad_financiera?.nombre
    const subtitle = entityName
        ? `${user?.nombre_completo} — ${entityName}`
        : user?.nombre_completo

    return (
        <div>
            <PageHeader
                title="Panel del Analista"
                subtitle={`Bienvenido, ${subtitle}`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {ANALYST_STATS.map(({ label, value, icon }) => (
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
                        Los módulos de consulta y levantamiento se habilitarán en hitos posteriores.
                        Utiliza el menú lateral para navegar.
                    </p>
                </Card>
            </div>
        </div>
    )
}
