import { useMetricasDashboard } from '../hooks/useMetricasDashboard'
import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { AuditMetricsGrid } from './AuditMetricsGrid'
import { ConsultasPorEntidadTable } from './ConsultasPorEntidadTable'
import { TopAnalistasTable } from './TopAnalistasTable'
import { AuditoriaRecenteList } from './AuditoriaRecenteList'
import { Icon } from '../../shared/components/atoms/Icon'

/** Página principal del dashboard de auditoría (Admin) */
export function AuditDashboardPage() {
    const {
        metricas,
        consultasPorEntidad,
        topAnalistas,
        registrosAuditoria,
        isLoading,
        error,
        recargar,
    } = useMetricasDashboard()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-text-secondary">Cargando métricas...</span>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Dashboard de Auditoría"
                    subtitle="Métricas globales de uso y trazabilidad del sistema"
                />
                <button
                    onClick={recargar}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
                >
                    <Icon name="refresh" className="h-4 w-4" />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <AuditMetricsGrid metricas={metricas} />

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ConsultasPorEntidadTable datos={consultasPorEntidad} />
                <TopAnalistasTable datos={topAnalistas} />
            </div>

            <div className="mt-8">
                <AuditoriaRecenteList registros={registrosAuditoria} />
            </div>
        </div>
    )
}
