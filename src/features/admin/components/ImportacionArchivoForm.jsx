import { useState } from 'react'

import { Card } from '../../shared/components/atoms/Card'
import { Icon } from '../../shared/components/atoms/Icon'

const EXCEL_MIME_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
]

function esArchivoExcelValido(file) {
    if (!file) return false
    const fileName = file.name.toLowerCase()
    return EXCEL_MIME_TYPES.includes(file.type) || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')
}

export function ImportacionArchivoForm({ isLoading, onImportar }) {
    const [filePayload, setFilePayload] = useState(null)
    const [error, setError] = useState(null)

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0] ?? null
        setError(null)
        setFilePayload(null)

        if (!selectedFile) return

        if (!esArchivoExcelValido(selectedFile)) {
            setError('Formato invalido. Usa un archivo .xlsx o .xls')
            return
        }

        try {
            const arrayBuffer = await selectedFile.arrayBuffer()
            setFilePayload({
                name: selectedFile.name,
                arrayBuffer,
            })
        } catch (err) {
            if (err?.name === 'NotReadableError') {
                setError('No se puede leer el archivo. Cierra Excel, mueve el archivo a una carpeta local y vuelve a intentarlo.')
                return
            }
            setError('No se pudo leer el archivo seleccionado.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!filePayload) {
            setError('Selecciona un archivo Excel')
            return
        }

        await onImportar(filePayload)
    }

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-text-secondary">
                    Archivo Excel oficial
                </label>
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary file:mr-3 file:rounded-md file:border-0 file:bg-surface-dark file:px-3 file:py-1.5 file:text-xs file:font-medium"
                />
                {filePayload?.name && (
                    <p className="text-xs text-text-muted">
                        Archivo listo: {filePayload.name}
                    </p>
                )}
                {error && <p className="text-sm text-red-700">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Icon name="upload" className="h-4 w-4" />
                    )}
                    {isLoading ? 'Importando...' : 'Importar protestos'}
                </button>
            </form>
        </Card>
    )
}
