import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { useUploadArchivo } from '../hooks/useUploadArchivo'
import { ARCHIVO_TIPOS, UPLOAD_CONFIG } from '../types/levantamiento.types'
import { FileSelectSlot } from './SingleUploadSlot'

/**
 * Formulario de subida de documentos para una solicitud.
 * Dos slots de selección independientes + un botón único para subir ambos.
 */
export function UploadArchivoForm({ solicitudId, archivosExistentes = [], onUploaded }) {
    const { subir, isUploading, error } = useUploadArchivo()
    const [comprobanteFile, setComprobanteFile] = useState(null)
    const [formatoFile, setFormatoFile] = useState(null)
    const [uploadError, setUploadError] = useState(null)

    const comprobanteExistente = archivosExistentes.find(
        (a) => a.tipo === ARCHIVO_TIPOS.COMPROBANTE
    )
    const formatoExistente = archivosExistentes.find(
        (a) => a.tipo === ARCHIVO_TIPOS.FORMATO
    )

    const hayArchivosParaSubir = comprobanteFile || formatoFile

    const handleSubirTodos = async () => {
        setUploadError(null)

        try {
            if (comprobanteFile) {
                await subir(comprobanteFile, solicitudId, ARCHIVO_TIPOS.COMPROBANTE)
                setComprobanteFile(null)
            }

            if (formatoFile) {
                await subir(formatoFile, solicitudId, ARCHIVO_TIPOS.FORMATO)
                setFormatoFile(null)
            }

            onUploaded?.()
        } catch (err) {
            setUploadError(err.message)
        }
    }

    const displayError = uploadError || error

    return (
        <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Documentos Requeridos
            </h4>

            <FileSelectSlot
                tipo={ARCHIVO_TIPOS.COMPROBANTE}
                archivoExistente={comprobanteExistente}
                selectedFile={comprobanteFile}
                onFileChange={setComprobanteFile}
            />

            <FileSelectSlot
                tipo={ARCHIVO_TIPOS.FORMATO}
                archivoExistente={formatoExistente}
                selectedFile={formatoFile}
                onFileChange={setFormatoFile}
            />

            <p className="text-xs text-text-muted">
                Formatos: {UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')} ·
                Máximo {UPLOAD_CONFIG.MAX_SIZE_MB}MB
            </p>

            {displayError && (
                <p className="text-xs text-red-600">{displayError}</p>
            )}

            {hayArchivosParaSubir && (
                <button
                    onClick={handleSubirTodos}
                    disabled={isUploading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                    <Icon name="upload" className="h-4 w-4" />
                    {isUploading ? 'Subiendo documentos...' : 'Subir documentos'}
                </button>
            )}
        </div>
    )
}
