import { useAuth } from '../../auth/hooks/useAuth'
import { ROUTES } from '../../../config/routes'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { StatCard } from '../../shared/components/molecules/StatCard'
import { Icon } from '../../shared/components/atoms/Icon'
import { useAnalystStats } from '../hooks/useAnalystStats'
import { ModuleCard } from './ModuleCard'

const MODULES = [
    {
        title: 'Consulta de Protestos',
        description: 'Busque por DNI o RUC para verificar protestos registrados en el sistema.',
        icon: 'search',
        to: ROUTES.ANALYST_SEARCH,
    },
    {
        title: 'Solicitudes de Levantamiento',
        description: 'Gestione sus solicitudes activas y suba la documentación requerida.',
        icon: 'clipboard',
        to: ROUTES.ANALYST_SOLICITUDES,
    },
    {
        title: 'Historial de Consultas',
        description: 'Revise el registro completo de todas las búsquedas realizadas.',
        icon: 'history',
        to: ROUTES.ANALYST_HISTORY,
    },
]

export function AnalystDashboard() {
    const { user } = useAuth()
    const { stats, isLoading } = useAnalystStats(user?.id)

    const entityName = user?.entidad_financiera?.nombre
    const subtitle = entityName
        ? `${user?.nombre_completo} — ${entityName}`
        : user?.nombre_completo

    const statCards = [
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
                {statCards.map(({ label, value, icon }) => (
                    <StatCard
                        key={label}
                        label={label}
                        value={value}
                        icon={<Icon name={icon} className="h-5 w-5" />}
                    />
                ))}
            </div>

            <div className="mt-8">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">
                    Acceso rápido
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {MODULES.map((mod) => (
                        <ModuleCard key={mod.to} {...mod} />
                    ))}
                </div>
            </div>
        </div>
    )
}
