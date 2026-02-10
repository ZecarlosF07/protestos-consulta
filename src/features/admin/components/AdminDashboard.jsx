import { useAuth } from '../../auth/hooks/useAuth'

export function AdminDashboard() {
    const { user } = useAuth()

    return (
        <div>
            <h2 className="text-xl font-bold text-text-primary">
                Panel de Administración
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
                Bienvenido, {user?.nombre_completo}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Analistas', value: '—' },
                    { label: 'Protestos', value: '—' },
                    { label: 'Consultas hoy', value: '—' },
                    { label: 'Solicitudes', value: '—' },
                ].map(({ label, value }) => (
                    <div
                        key={label}
                        className="rounded-xl border border-border bg-white p-5"
                    >
                        <p className="text-sm text-text-secondary">{label}</p>
                        <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
