import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { PageHeader } from '../../shared/components/organisms/PageHeader'
import { Icon } from '../../shared/components/atoms/Icon'
import { useDocumentosEmitidos } from '../hooks/useDocumentosEmitidos'
import { DocumentosTable } from './DocumentosTable'
import { GenerarDocumentoModal } from './GenerarDocumentoModal'
import { AnularDocumentoModal } from './AnularDocumentoModal'

/** Página de historial de documentos emitidos para un formato específico */
export function FormatoHistorialPage() {
    const { formatoId } = useParams()
    const navigate = useNavigate()
    const {
        formato, documentos, isLoading, operationLoading,
        error, generar, anular, descargar, recargar, limpiarError,
    } = useDocumentosEmitidos(formatoId)

    const [showGenerar, setShowGenerar] = useState(false)
    const [docAnular, setDocAnular] = useState(null)

    const handleGenerar = async (datos) => {
        try {
            await generar(datos)
            setShowGenerar(false)
        } catch { /* error manejado en hook */ }
    }

    const handleAnular = async (docId, motivo) => {
        try {
            await anular(docId, motivo)
            setDocAnular(null)
        } catch { /* error manejado en hook */ }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-text-secondary">Cargando historial...</span>
            </div>
        )
    }

    return (
        <div>
            <HistorialHeader
                formato={formato}
                onVolver={() => navigate('/admin/formatos')}
                onGenerar={() => { limpiarError(); setShowGenerar(true) }}
                onRecargar={recargar}
            />

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <DocumentosTable
                documentos={documentos}
                onDescargar={descargar}
                onAnular={setDocAnular}
            />

            {showGenerar && formato && (
                <GenerarDocumentoModal
                    formato={formato}
                    onGenerar={handleGenerar}
                    onClose={() => setShowGenerar(false)}
                    isLoading={operationLoading}
                />
            )}

            {docAnular && (
                <AnularDocumentoModal
                    documento={docAnular}
                    onAnular={handleAnular}
                    onClose={() => setDocAnular(null)}
                    isLoading={operationLoading}
                />
            )}
        </div>
    )
}

function HistorialHeader({ formato, onVolver, onGenerar, onRecargar }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onVolver}
                    className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-dark"
                >
                    <Icon name="chevronLeft" className="h-5 w-5" />
                </button>
                <PageHeader
                    title={formato?.nombre ?? 'Formato'}
                    subtitle={`Código: ${formato?.codigo ?? ''} · Último correlativo: ${formato?.ultimo_correlativo ?? 0}`}
                />
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onRecargar}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-dark"
                >
                    <Icon name="refresh" className="h-4 w-4" />
                    Actualizar
                </button>
                <button
                    onClick={onGenerar}
                    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Generar documento
                </button>
            </div>
        </div>
    )
}
