import { Icon } from '../../shared/components/atoms/Icon'
import { Card } from '../../shared/components/atoms/Card'

/** Tarjeta visual para cada formato PDF disponible */
export function FormatoCard({ formato, onSeleccionar }) {
    return (
        <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
                <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-accent/10 p-2.5">
                        <Icon name="file" className="h-6 w-6 text-accent" />
                    </div>
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-text-muted">
                        {formato.codigo}
                    </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-text-primary">
                    {formato.nombre}
                </h3>
                <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                    {formato.descripcion}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-text-muted">
                    Último correlativo: <span className="font-semibold text-text-primary">{formato.ultimo_correlativo}</span>
                </p>
                <button
                    onClick={() => onSeleccionar(formato.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
                >
                    <Icon name="arrowRight" className="h-3.5 w-3.5" />
                    Ver historial
                </button>
            </div>
        </Card>
    )
}
