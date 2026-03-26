import { useState } from 'react'

import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'
import { useUploadArchivo } from '../hooks/useUploadArchivo'
import { ARCHIVO_TIPOS, UPLOAD_CONFIG } from '../types/levantamiento.types'
import { obtenerUrlDescarga, reemplazarArchivo } from '../services/archivos.service'
import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'

/**
 * Componente para que el Administrador adjunte la
 * Boleta o Factura emitida a una solicitud.
 */
export function AdminComprobanteUpload({ solicitud, onUploaded }) {
    const { user } = useAuth()
    const { subir, isUploading, error } = useUploadArchivo()
    const [file, setFile] = useState(null)
    const [uploadError, setUploadError] = useState(null)
    const [isReplacing, setIsReplacing] = useState(false)

    const archivoExistente = solicitud.archivos?.find(
        (a) => a.tipo === ARCHIVO_TIPOS.BOLETA_FACTURA
    )
    const tipoLabel = solicitud.tipo_comprobante === 'factura' ? 'Factura' : 'Boleta'

    const handleSubir = async () => {
        if (!file) return
        setUploadError(null)
        try {
            if (archivoExistente) {
                setIsReplacing(true)
                const nuevo = await reemplazarArchivo(file, solicitud.id, ARCHIVO_TIPOS.BOLETA_FACTURA)
                registrarAuditoria({
                    usuarioId: user.id,
                    entidadFinancieraId: user.entidad_financiera_id,
                    accion: 'COMPROBANTE_REEMPLAZADO',
                    entidadAfectada: 'archivos',
                    entidadAfectadaId: nuevo.id,
                    descripcion: `${tipoLabel} reemplazada en solicitud ${solicitud.id}`,
                    metadata: { tipo: ARCHIVO_TIPOS.BOLETA_FACTURA, nombre: file.name },
                })
                setIsReplacing(false)
            } else {
                await subir(file, solicitud.id, ARCHIVO_TIPOS.BOLETA_FACTURA)
            }
            setFile(null)
            onUploaded?.()
        } catch (err) {
            setUploadError(err.message)
            setIsReplacing(false)
        }
    }

    return (
        <Card>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {tipoLabel} Adjunta
            </h4>

            {archivoExistente && (
                <ComprobanteSubido
                    archivoExistente={archivoExistente}
                    onReemplazar={() => setFile(undefined)}
                    showReplace={file === null}
                />
            )}

            {(!archivoExistente || file !== null) && (
                <UploadInput
                    file={file}
                    onFileChange={setFile}
                    onSubir={handleSubir}
                    isUploading={isUploading || isReplacing}
                    label={archivoExistente ? `Reemplazar ${tipoLabel}` : `Adjuntar ${tipoLabel}`}
                />
            )}

            {(uploadError || error) && (
                <p className="mt-2 text-xs text-red-600">{uploadError || error}</p>
            )}
        </Card>
    )
}

function ComprobanteSubido({ archivoExistente, onReemplazar, showReplace }) {
    const handleDescargar = async () => {
        const url = await obtenerUrlDescarga(archivoExistente.ruta)
        window.open(url, '_blank')
    }

    return (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
                <Icon name="checkCircle" className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">{archivoExistente.nombre_archivo}</p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={handleDescargar} className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-100">
                    <Icon name="download" className="h-4 w-4" />
                </button>
                {showReplace && (
                    <button onClick={onReemplazar} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50" title="Reemplazar">
                        <Icon name="refresh" className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

function UploadInput({ file, onFileChange, onSubir, isUploading, label }) {
    return (
        <div className="mt-3 space-y-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-3 py-4 text-sm text-text-secondary hover:border-accent hover:bg-accent/5">
                <Icon name="upload" className="h-4 w-4" />
                {file ? file.name : 'Seleccionar archivo'}
                <input type="file" className="hidden" accept={UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(',')} onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
            </label>
            {file && (
                <button onClick={onSubir} disabled={isUploading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50">
                    <Icon name="upload" className="h-4 w-4" />
                    {isUploading ? 'Subiendo...' : label}
                </button>
            )}
        </div>
    )
}
