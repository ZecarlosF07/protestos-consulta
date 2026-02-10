/** Header superior con título de página contextual */
export function PageHeader({ title, subtitle }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            {subtitle && (
                <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            )}
        </div>
    )
}
