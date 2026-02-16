import { useState } from 'react'

import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { useUploadArchivo } from '../hooks/useUploadArchivo'
import { ARCHIVO_TIPOS, UPLOAD_CONFIG } from '../types/levantamiento.types'
import { obtenerUrlDescarga } from '../services/archivos.service'

/**
 * Componente para que el Administrador adjunte el
 * Certificado de Título Regularizado emitido a una solicitud.
 */
export function AdminCertificadoUpload({ solicitud, onUploaded }) {
    const { subir, isUploading, error } = useUploadArchivo()
    const [file, setFile] = useState(null)
    const [uploadError, setUploadError] = useState(null)

    const certificadoExistente = solicitud.archivos?.find(
        (a) => a.tipo === ARCHIVO_TIPOS.CERTIFICADO_EMITIDO
    )

    const handleDescargar = async () => {
        if (!certificadoExistente) return
        try {
            const url = await obtenerUrlDescarga(certificadoExistente.ruta)
            window.open(url, '_blank')
        } catch {
            alert('Error descargando el certificado')
        }
    }

    const handleSubir = async () => {
        if (!file) return
        setUploadError(null)

        try {
            await subir(file, solicitud.id, ARCHIVO_TIPOS.CERTIFICADO_EMITIDO)
            setFile(null)
            onUploaded?.()
        } catch (err) {
            setUploadError(err.message)
        }
    }

    return (
        <Card>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Certificado de Título Regularizado
            </h4>

            {certificadoExistente ? (
                <CertificadoSubido
                    nombre={certificadoExistente.nombre_archivo}
                    onDescargar={handleDescargar}
                />
            ) : (
                <UploadCertificado
                    file={file}
                    onFileChange={setFile}
                    onSubir={handleSubir}
                    isUploading={isUploading}
                />
            )}

            {(uploadError || error) && (
                <p className="mt-2 text-xs text-red-600">{uploadError || error}</p>
            )}
        </Card>
    )
}

function CertificadoSubido({ nombre, onDescargar }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
                <Icon name="checkCircle" className="h-5 w-5 text-emerald-600" />
                <div>
                    <p className="text-sm font-medium text-emerald-800">
                        Certificado adjuntado
                    </p>
                    <p className="text-xs text-emerald-600">{nombre}</p>
                </div>
            </div>
            <button
                onClick={onDescargar}
                className="rounded-lg p-2 text-emerald-700 transition-colors hover:bg-emerald-100"
            >
                <Icon name="download" className="h-4 w-4" />
            </button>
        </div>
    )
}

function UploadCertificado({ file, onFileChange, onSubir, isUploading }) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-text-muted">
                Adjunte el Certificado de Título Regularizado emitido para esta solicitud.
            </p>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-3 py-4 text-sm text-text-secondary transition-colors hover:border-accent hover:bg-accent/5">
                <Icon name="upload" className="h-4 w-4" />
                {file ? file.name : 'Seleccionar certificado'}
                <input
                    type="file"
                    className="hidden"
                    accept={UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(',')}
                    onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                />
            </label>

            {file && (
                <button
                    onClick={onSubir}
                    disabled={isUploading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                    <Icon name="upload" className="h-4 w-4" />
                    {isUploading ? 'Subiendo certificado...' : 'Adjuntar certificado'}
                </button>
            )}
        </div>
    )
}
