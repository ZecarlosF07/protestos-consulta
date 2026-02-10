import { useCallback, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import { buscarProtestos, registrarConsulta } from '../services/consulta.service'
import { validarDocumento } from '../utils/documento.utils'

/** Estados posibles de la consulta */
const ESTADOS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
}

/**
 * Hook que encapsula la lógica de consulta de protestos.
 * Maneja validación, búsqueda, registro y auditoría.
 */
export function useConsultaProtestos() {
    const { user } = useAuth()

    const [estado, setEstado] = useState(ESTADOS.IDLE)
    const [protestos, setProtestos] = useState([])
    const [error, setError] = useState(null)
    const [documentoConsultado, setDocumentoConsultado] = useState(null)

    const ejecutarConsulta = useCallback(async (numeroDocumento) => {
        const validacion = validarDocumento(numeroDocumento)

        if (!validacion.valido) {
            setError(validacion.error)
            return
        }

        setEstado(ESTADOS.LOADING)
        setError(null)
        setProtestos([])

        try {
            const resultados = await buscarProtestos(
                numeroDocumento.trim(),
                validacion.tipo
            )

            setProtestos(resultados)
            setDocumentoConsultado({
                numero: numeroDocumento.trim(),
                tipo: validacion.tipo,
            })
            setEstado(ESTADOS.SUCCESS)

            // Registrar consulta y auditoría en paralelo (no bloquean UI)
            registrarConsulta({
                usuarioId: user.id,
                entidadFinancieraId: user.entidad_financiera_id,
                tipoDocumento: validacion.tipo,
                numeroDocumento: numeroDocumento.trim(),
                resultadosEncontrados: resultados.length,
            })

            registrarAuditoria({
                usuarioId: user.id,
                entidadFinancieraId: user.entidad_financiera_id,
                accion: 'CONSULTA_PROTESTO',
                entidadAfectada: 'protestos',
                descripcion: `Consulta ${validacion.tipo}: ${numeroDocumento.trim()} — ${resultados.length} resultado(s)`,
                metadata: {
                    tipo_documento: validacion.tipo,
                    numero_documento: numeroDocumento.trim(),
                    resultados: resultados.length,
                },
            })
        } catch (err) {
            setEstado(ESTADOS.ERROR)
            setError('Error al realizar la consulta. Intente nuevamente.')
            console.error('Error en consulta de protestos:', err.message)
        }
    }, [user])

    const limpiar = useCallback(() => {
        setEstado(ESTADOS.IDLE)
        setProtestos([])
        setError(null)
        setDocumentoConsultado(null)
    }, [])

    return {
        estado,
        protestos,
        error,
        documentoConsultado,
        isLoading: estado === ESTADOS.LOADING,
        isSuccess: estado === ESTADOS.SUCCESS,
        ejecutarConsulta,
        limpiar,
    }
}
