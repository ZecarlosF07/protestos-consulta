/** Tarjeta de métrica con label, valor e ícono */
export function StatCard({ label, value, icon }) {
    return (
        <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">{label}</p>
                {icon && (
                    <span className="text-text-muted">{icon}</span>
                )}
            </div>
            <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
        </div>
    )
}
