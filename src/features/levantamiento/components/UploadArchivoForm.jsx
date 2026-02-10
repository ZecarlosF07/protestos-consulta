import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { useUploadArchivo } from '../hooks/useUploadArchivo'
import { ARCHIVO_TIPOS, UPLOAD_CONFIG } from '../types/levantamiento.types'

/** Formulario para subir archivos a una solicitud */
export function UploadArchivoForm({ solicitudId, onUploaded }) {
    const { subir, isUploading, error } = useUploadArchivo()
    const [tipo, setTipo] = useState(ARCHIVO_TIPOS.COMPROBANTE)

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const resultado = await subir(file, solicitudId, tipo)
        if (resultado && onUploaded) {
            onUploaded(resultado)
        }

        // Limpiar input
        e.target.value = ''
    }

    return (
        <div className="space-y-3 rounded-lg border border-border p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Subir Documento
            </h4>

            <div className="flex gap-2">
                <TipoButton
                    activo={tipo === ARCHIVO_TIPOS.COMPROBANTE}
                    onClick={() => setTipo(ARCHIVO_TIPOS.COMPROBANTE)}
                    label="Comprobante de pago"
                />
                <TipoButton
                    activo={tipo === ARCHIVO_TIPOS.FORMATO}
                    onClick={() => setTipo(ARCHIVO_TIPOS.FORMATO)}
                    label="Formato firmado"
                />
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-sm text-text-secondary transition-colors hover:border-accent hover:bg-accent/5">
                <Icon name="upload" className="h-5 w-5" />
                {isUploading ? 'Subiendo...' : 'Seleccionar archivo'}
                <input
                    type="file"
                    className="hidden"
                    accept={UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(',')}
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </label>

            <p className="text-xs text-text-muted">
                Formatos: {UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')} ·
                Máximo {UPLOAD_CONFIG.MAX_SIZE_MB}MB
            </p>

            {error && (
                <p className="text-xs text-red-600">{error}</p>
            )}
        </div>
    )
}

function TipoButton({ activo, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activo
                    ? 'bg-accent text-white'
                    : 'border border-border text-text-secondary hover:bg-surface-dark'
                }`}
        >
            {label}
        </button>
    )
}
