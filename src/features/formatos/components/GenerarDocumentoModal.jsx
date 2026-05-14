import { useState } from 'react'

import { Icon } from '../../shared/components/atoms/Icon'
import { Card } from '../../shared/components/atoms/Card'
import { ConstanciaAnotacionForm } from './ConstanciaAnotacionForm'
import { SolicitanteDocumentoForm } from './SolicitanteDocumentoForm'
import {
    CONSTANCIA_INITIAL_VALUES,
    FORMATO_CONSTANCIA_ANOTACION,
} from '../types/constancia-anotacion.types'
import {
    crearPayloadConstanciaAnotacion,
    tieneErrores,
    validarConstanciaAnotacion,
} from '../utils/constancia-anotacion.utils'
import { validarDatosSolicitante } from '../utils/formatos.utils'

/** Modal para registrar datos del solicitante y generar un documento con correlativo */
export function GenerarDocumentoModal({ formato, onGenerar, onClose, isLoading }) {
    const [tipo, setTipo] = useState('')
    const [nroDocumento, setNroDocumento] = useState('')
    const [nombre, setNombre] = useState('')
    const [constanciaData, setConstanciaData] = useState(CONSTANCIA_INITIAL_VALUES)
    const [fieldErrors, setFieldErrors] = useState({})
    const [validationError, setValidationError] = useState(null)

    const isConstanciaAnotacion = formato.codigo === FORMATO_CONSTANCIA_ANOTACION

    const handleTipoChange = (value) => {
        setTipo(value)
        setNroDocumento('')
        setNombre('')
        setValidationError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLoading) return

        if (isConstanciaAnotacion) {
            const errors = validarConstanciaAnotacion(constanciaData)
            setFieldErrors(errors)
            if (tieneErrores(errors)) return
            await onGenerar(crearPayloadConstanciaAnotacion(constanciaData))
            return
        }

        const error = validarDatosSolicitante(tipo, nroDocumento, nombre)
        if (error) { setValidationError(error); return }
        await onGenerar({ tipoSolicitante: tipo, nroDocumento, nombreSolicitante: nombre })
    }

    const handleConstanciaChange = (field, value) => {
        setConstanciaData((current) => ({ ...current, [field]: value }))
        setFieldErrors((current) => ({ ...current, [field]: null }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className={`w-full ${isConstanciaAnotacion ? 'max-w-3xl' : 'max-w-md'}`}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">
                        Generar {formato.nombre}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-surface-dark">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>

                <p className="mb-4 text-xs text-text-secondary">
                    {isConstanciaAnotacion
                        ? 'Complete la información que se imprimirá en la constancia.'
                        : 'Registre los datos del solicitante. Esta información se guarda como respaldo interno y no se imprime en el documento.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isConstanciaAnotacion ? (
                        <ConstanciaAnotacionForm
                            values={constanciaData}
                            errors={fieldErrors}
                            onChange={handleConstanciaChange}
                        />
                    ) : (
                        <SolicitanteDocumentoForm
                            tipo={tipo}
                            nroDocumento={nroDocumento}
                            nombre={nombre}
                            onTipoChange={handleTipoChange}
                            onDocChange={setNroDocumento}
                            onNombreChange={setNombre}
                        />
                    )}

                    {validationError && <p className="text-xs text-red-600">{validationError}</p>}

                    <button
                        type="submit"
                        disabled={isLoading || (!isConstanciaAnotacion && !tipo)}
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
