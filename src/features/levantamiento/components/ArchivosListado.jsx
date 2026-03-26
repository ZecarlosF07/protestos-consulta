import { Icon } from '../../shared/components/atoms/Icon'
import { ARCHIVO_TIPO_LABELS } from '../types/levantamiento.types'
import { formatearTamanoArchivo } from '../../auditoria/utils/auditoria.utils'

/** Lista de archivos adjuntos en vista analista */
export function ArchivosListado({ archivos, onDescargar }) {
    if (!archivos || archivos.length === 0) return null

    return (
        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Archivos subidos ({archivos.length})
            </p>
            <div className="space-y-2">
                {archivos.map((archivo) => (
                    <div
                        key={archivo.id}
                        className="flex items-center justify-between rounded-lg border border-border p-2"
                    >
                        <div>
                            <p className="text-sm text-text-primary">{archivo.nombre_archivo}</p>
                            <p className="text-xs text-text-muted">
                                {ARCHIVO_TIPO_LABELS[archivo.tipo] ?? archivo.tipo} ·{' '}
                                {formatearTamanoArchivo(archivo.tamano_bytes)}
                            </p>
                        </div>
                        <button
                            onClick={() => onDescargar(archivo.ruta, archivo.nombre_archivo)}
                            className="rounded p-1 text-accent hover:bg-blue-50"
                        >
                            <Icon name="download" className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
