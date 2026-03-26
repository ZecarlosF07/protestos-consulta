import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { ARCHIVO_TIPO_LABELS } from '../types/levantamiento.types'
import { formatearTamanoArchivo } from '../../auditoria/utils/auditoria.utils'

/** Sección de archivos adjuntos para vista admin */
export function ArchivosSection({ archivos, onDescargar }) {
    if (!archivos || archivos.length === 0) {
        return (
            <Card>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Documentos Adjuntos
                </h4>
                <p className="text-sm text-text-muted">
                    No se han adjuntado documentos aún
                </p>
            </Card>
        )
    }

    return (
        <Card>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Documentos Adjuntos ({archivos.length})
            </h4>
            <div className="space-y-2">
                {archivos.map((archivo) => (
                    <div
                        key={archivo.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                        <div>
                            <p className="text-sm font-medium text-text-primary">
                                {archivo.nombre_archivo}
                            </p>
                            <p className="text-xs text-text-muted">
                                {ARCHIVO_TIPO_LABELS[archivo.tipo] ?? archivo.tipo} ·{' '}
                                {formatearTamanoArchivo(archivo.tamano_bytes)}
                            </p>
                        </div>
                        <button
                            onClick={() => onDescargar(archivo.ruta, archivo.nombre_archivo)}
                            className="rounded-lg p-2 text-accent transition-colors hover:bg-blue-50"
                        >
                            <Icon name="download" className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    )
}
