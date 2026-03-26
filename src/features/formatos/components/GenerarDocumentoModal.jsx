import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { Card } from '../../shared/components/atoms/Card'
import { TIPO_SOLICITANTE_OPTIONS } from '../types/formatos.types'
import { validarDatosSolicitante } from '../utils/formatos.utils'

/** Modal para registrar datos del solicitante y generar un documento con correlativo */
export function GenerarDocumentoModal({ formato, onGenerar, onClose, isLoading }) {
    const [tipo, setTipo] = useState('')
    const [nroDocumento, setNroDocumento] = useState('')
    const [nombre, setNombre] = useState('')
    const [validationError, setValidationError] = useState(null)

    const handleTipoChange = (value) => {
        setTipo(value)
        setNroDocumento('')
        setNombre('')
        setValidationError(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const error = validarDatosSolicitante(tipo, nroDocumento, nombre)
        if (error) { setValidationError(error); return }
        onGenerar({ tipoSolicitante: tipo, nroDocumento, nombreSolicitante: nombre })
    }

    const docLabel = tipo === 'empresa' ? 'RUC' : 'DNI'
    const nombreLabel = tipo === 'empresa' ? 'Razón Social' : 'Nombres y Apellidos'
    const docMaxLength = tipo === 'empresa' ? 11 : 8

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">
                        Generar {formato.nombre}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-surface-dark">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <p className="mb-4 text-xs text-text-secondary">
                    Registre los datos del solicitante. Esta información se guarda como respaldo interno y no se imprime en el documento.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TipoSelect value={tipo} onChange={handleTipoChange} />

                    {tipo && (
                        <CamposSolicitante
                            docLabel={docLabel}
                            nombreLabel={nombreLabel}
                            docMaxLength={docMaxLength}
                            nroDocumento={nroDocumento}
                            nombre={nombre}
                            onDocChange={setNroDocumento}
                            onNombreChange={setNombre}
                        />
                    )}

                    {validationError && <p className="text-xs text-red-600">{validationError}</p>}

                    <button
                        type="submit"
                        disabled={isLoading || !tipo}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                    >
                        <Icon name="file" className="h-4 w-4" />
                        {isLoading ? 'Generando...' : 'Generar documento'}
                    </button>
                </form>
            </Card>
        </div>
    )
}

function TipoSelect({ value, onChange }) {
    return (
        <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Tipo de solicitante *
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
                <option value="">Seleccione...</option>
                {TIPO_SOLICITANTE_OPTIONS.map(({ value: v, label }) => (
                    <option key={v} value={v}>{label}</option>
                ))}
            </select>
        </label>
    )
}

function CamposSolicitante({ docLabel, nombreLabel, docMaxLength, nroDocumento, nombre, onDocChange, onNombreChange }) {
    return (
        <div className="space-y-3 rounded-lg border border-border p-3">
            <label className="block">
                <span className="text-xs text-text-secondary">{docLabel} *</span>
                <input
                    type="text"
                    value={nroDocumento}
                    onChange={(e) => onDocChange(e.target.value)}
                    maxLength={docMaxLength}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
            </label>
            <label className="block">
                <span className="text-xs text-text-secondary">{nombreLabel} *</span>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => onNombreChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
            </label>
        </div>
    )
}
