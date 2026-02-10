import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Card } from '../../shared/components/atoms/Card'
import { SearchInput } from './SearchInput'
import { ResultadoResumen } from './ResultadoResumen'
import { ProtestosTable } from './ProtestosTable'
import { ErrorMessage } from './ErrorMessage'
import { useConsultaProtestos } from '../hooks/useConsultaProtestos'
import { useSolicitudes } from '../../levantamiento/hooks/useSolicitudes'

/** Página de consulta de protestos para analistas */
export function ConsultaProtestosPage() {
    const {
        protestos,
        error,
        documentoConsultado,
        isLoading,
        isSuccess,
        ejecutarConsulta,
        limpiar,
    } = useConsultaProtestos()

    const {
        crear: crearSolicitud,
        operationLoading: isCreando,
        error: errorSolicitud,
        limpiarError,
    } = useSolicitudes({ modo: 'analista' })

    const handleSolicitar = async (protestoId) => {
        try {
            await crearSolicitud(protestoId)
            ejecutarConsulta(documentoConsultado?.numero)
        } catch {
            // Error ya manejado en el hook
        }
    }

    return (
        <div>
            <PageHeader
                title="Consulta de Protestos"
                subtitle="Busque por número de documento (DNI o RUC) para verificar protestos registrados"
            />

            <Card className="mb-6">
                <SearchInput
                    onSearch={ejecutarConsulta}
                    isLoading={isLoading}
                    onClear={() => { limpiar(); limpiarError() }}
                />
            </Card>

            <ErrorMessage message={error} />
            <ErrorMessage message={errorSolicitud} />

            {isSuccess && documentoConsultado && (
                <div className="mt-4 space-y-4">
                    <ResultadoResumen
                        documentoConsultado={documentoConsultado}
                        totalResultados={protestos.length}
                    />

                    {protestos.length > 0 && (
                        <ProtestosTable
                            protestos={protestos}
                            onSolicitar={handleSolicitar}
                            isLoadingSolicitud={isCreando}
                        />
                    )}
                </div>
            )}

            {isLoading && (
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-3 text-text-secondary">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                        <span className="text-sm">Buscando protestos...</span>
                    </div>
                </div>
            )}
        </div>
    )
}
