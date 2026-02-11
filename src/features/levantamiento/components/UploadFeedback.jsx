import { Icon } from '../../shared/components/atoms/Icon'
import { ARCHIVO_TIPOS, UPLOAD_CONFIG } from '../types/levantamiento.types'

/** Selector de tipo de archivo (comprobante/formato) */
export function TipoSelector({ tipo, onTipoChange }) {
    return (
        <div className="flex gap-2">
            <TipoButton
                activo={tipo === ARCHIVO_TIPOS.COMPROBANTE}
                onClick={() => onTipoChange(ARCHIVO_TIPOS.COMPROBANTE)}
                label="Comprobante de pago"
            />
            <TipoButton
                activo={tipo === ARCHIVO_TIPOS.FORMATO}
                onClick={() => onTipoChange(ARCHIVO_TIPOS.FORMATO)}
                label="Formato firmado"
            />
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

/** Zona de arrastrar/seleccionar archivo */
export function DropZone({ inputRef, isUploading, selectedFile, onFileSelect }) {
    return (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-sm text-text-secondary transition-colors hover:border-accent hover:bg-accent/5">
            <Icon name="upload" className="h-5 w-5" />
            {isUploading
                ? 'Subiendo...'
                : selectedFile
                    ? selectedFile.name
                    : 'Seleccionar archivo'}
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(',')}
                onChange={onFileSelect}
                disabled={isUploading}
            />
        </label>
    )
}

/** Previsualización de archivo seleccionado con botón de subir */
export function FilePreview({ file, onRemove, onUpload }) {
    const tamano = formatearTamano(file.size)

    return (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center gap-3 overflow-hidden">
                <Icon name="file" className="h-5 w-5 shrink-0 text-accent" />
                <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium text-text-primary">
                        {file.name}
                    </p>
                    <p className="text-xs text-text-muted">{tamano}</p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <button
                    onClick={onRemove}
                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <Icon name="close" className="h-4 w-4" />
                </button>
                <button
                    onClick={onUpload}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
                >
                    Subir
                </button>
            </div>
        </div>
    )
}

/** Mensaje de éxito tras subir un archivo */
export function SuccessMessage({ nombre, onReset }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
                <Icon name="checkCircle" className="h-5 w-5 text-emerald-600" />
                <div>
                    <p className="text-sm font-medium text-emerald-800">
                        Archivo subido correctamente
                    </p>
                    <p className="text-xs text-emerald-600">{nombre}</p>
                </div>
            </div>
            <button
                onClick={onReset}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
            >
                Subir otro
            </button>
        </div>
    )
}

/** Formatea bytes en formato legible */
function formatearTamano(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
