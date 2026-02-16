import { useRef, useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { UPLOAD_CONFIG, ARCHIVO_TIPO_LABELS } from '../types/levantamiento.types'
import { validarArchivo } from '../services/archivos.service'

/**
 * Slot de selección de archivo (sin botón de subir).
 * Solo permite seleccionar/deseleccionar un archivo.
 */
export function FileSelectSlot({ tipo, archivoExistente, selectedFile, onFileChange }) {
    const [validationError, setValidationError] = useState(null)
    const inputRef = useRef(null)
    const label = ARCHIVO_TIPO_LABELS[tipo] ?? tipo

    const handleSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const { valido, error } = validarArchivo(file)
        if (!valido) {
            setValidationError(error)
            onFileChange(null)
            return
        }

        setValidationError(null)
        onFileChange(file)
    }

    const handleRemove = () => {
        setValidationError(null)
        onFileChange(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className="rounded-lg border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {label}
            </p>

            {archivoExistente ? (
                <ArchivoSubido nombre={archivoExistente.nombre_archivo} />
            ) : selectedFile ? (
                <FileInfo file={selectedFile} onRemove={handleRemove} />
            ) : (
                <SelectButton inputRef={inputRef} onSelect={handleSelect} />
            )}

            {validationError && (
                <p className="mt-1 text-xs text-red-600">{validationError}</p>
            )}
        </div>
    )
}

function SelectButton({ inputRef, onSelect }) {
    return (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-3 py-4 text-sm text-text-secondary transition-colors hover:border-accent hover:bg-accent/5">
            <Icon name="upload" className="h-4 w-4" />
            Seleccionar archivo
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(',')}
                onChange={onSelect}
            />
        </label>
    )
}

function FileInfo({ file, onRemove }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-2.5">
            <div className="flex items-center gap-2 overflow-hidden">
                <Icon name="file" className="h-4 w-4 shrink-0 text-accent" />
                <span className="truncate text-sm text-text-primary">{file.name}</span>
            </div>
            <button
                onClick={onRemove}
                className="shrink-0 rounded p-1 text-text-muted hover:bg-red-50 hover:text-red-600"
            >
                <Icon name="close" className="h-3.5 w-3.5" />
            </button>
        </div>
    )
}

function ArchivoSubido({ nombre }) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5">
            <Icon name="checkCircle" className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate text-sm font-medium text-emerald-800">{nombre}</span>
        </div>
    )
}
