import { useState } from 'react'

import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { SearchInput } from './SearchInput'
import { ResultadoResumen } from './ResultadoResumen'
import { ProtestosTable } from './ProtestosTable'
import { ErrorMessage } from './ErrorMessage'
import { useConsultaProtestos } from '../hooks/useConsultaProtestos'
import { useSolicitudes } from '../../levantamiento/hooks/useSolicitudes'
import { SolicitudFormModal } from '../../levantamiento/components/SolicitudFormModal'
import { FORMATO_PROTESTO_URL } from '../../levantamiento/types/levantamiento.types'

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

    const [protestoSeleccionado, setProtestoSeleccionado] = useState(null)

    const handleSolicitar = (protesto) => {
        setProtestoSeleccionado(protesto)
    }

    const handleConfirmSolicitud = async (protestoId, camposAdicionales) => {
        try {
            await crearSolicitud(protestoId, camposAdicionales)
            setProtestoSeleccionado(null)
            ejecutarConsulta(documentoConsultado?.numero)
        } catch {
            // Error ya manejado en el hook
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Consulta de Protestos"
                    subtitle="Busque por número de documento (DNI o RUC) para verificar protestos registrados"
                />
                <BotonDescargarFormato />
            </div>

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

            {protestoSeleccionado && (
                <SolicitudFormModal
                    protesto={protestoSeleccionado}
                    onConfirm={handleConfirmSolicitud}
                    onClose={() => setProtestoSeleccionado(null)}
                    isLoading={isCreando}
                />
            )}
        </div>
    )
}

/** Botón para descargar el formato oficial de protesto */
function BotonDescargarFormato() {
    return (
        <a
            href={FORMATO_PROTESTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
        >
            <Icon name="download" className="h-4 w-4" />
            Descargar Formato
        </a>
    )
}
