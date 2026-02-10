import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Card } from '../../shared/components/atoms/Card'
import { SearchInput } from './SearchInput'
import { ResultadoResumen } from './ResultadoResumen'
import { ProtestosTable } from './ProtestosTable'
import { ErrorMessage } from './ErrorMessage'
import { useConsultaProtestos } from '../hooks/useConsultaProtestos'

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
                    onClear={limpiar}
                />
            </Card>

            <ErrorMessage message={error} />

            {isSuccess && documentoConsultado && (
                <div className="mt-4 space-y-4">
                    <ResultadoResumen
                        documentoConsultado={documentoConsultado}
                        totalResultados={protestos.length}
                    />

                    {protestos.length > 0 && (
                        <ProtestosTable protestos={protestos} />
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
