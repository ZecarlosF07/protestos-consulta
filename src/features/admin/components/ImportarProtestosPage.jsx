import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { useImportacionProtestos } from '../hooks/useImportacionProtestos'
import { ImportacionArchivoForm } from './ImportacionArchivoForm'
import { ImportacionResultadoCard } from './ImportacionResultadoCard'
import { ImportacionesHistorialTable } from './ImportacionesHistorialTable'

export function ImportarProtestosPage() {
    const { isLoading, error, resultado, historial, importarArchivo } = useImportacionProtestos()

    return (
        <div className="space-y-4">
            <PageHeader
                title="Importación de Protestos"
                subtitle="Carga archivos Excel oficiales, validando estructura y evitando duplicados por secuencia."
            />

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <ImportacionArchivoForm
                isLoading={isLoading}
                onImportar={importarArchivo}
            />
            <ImportacionResultadoCard resultado={resultado} />
            <ImportacionesHistorialTable historial={historial} />
        </div>
    )
}
