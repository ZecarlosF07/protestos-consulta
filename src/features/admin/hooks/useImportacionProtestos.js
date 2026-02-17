import { useCallback, useEffect, useState } from 'react'

import { registrarAuditoria } from '../../../services/supabase/audit.service'
import { useAuth } from '../../auth/hooks/useAuth'
import {
    actualizarImportacionProtestos,
    crearImportacionProtestos,
    insertarProtestoDesdeImportacion,
    obtenerHistorialImportaciones,
    obtenerSecuenciasExistentes,
} from '../services/importacion.service'
import { parsearExcelProtestos } from '../utils/importacion-excel.utils'

function obtenerEstadoFinal(registrosError, registrosExitosos) {
    if (registrosExitosos === 0 && registrosError > 0) return 'fallida'
    if (registrosError > 0) return 'completada_con_errores'
    return 'completada'
}

export function useImportacionProtestos() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [resultado, setResultado] = useState(null)
    const [historial, setHistorial] = useState([])

    const cargarHistorial = useCallback(async () => {
        try {
            setHistorial(await obtenerHistorialImportaciones(10))
        } catch (err) {
            console.error('Error cargando historial de importaciones:', err.message)
        }
    }, [])

    useEffect(() => {
        cargarHistorial()
    }, [cargarHistorial])

    const importarArchivo = useCallback(async (filePayload) => {
        setIsLoading(true)
        setError(null)
        setResultado(null)

        let importacionId = null
        try {
            const nombreArchivo = filePayload?.name ?? filePayload?.file?.name ?? 'archivo.xlsx'
            importacionId = await crearImportacionProtestos({
                usuarioId: user.id,
                nombreArchivo,
            })

            const parsed = await parsearExcelProtestos(filePayload)
            if (parsed.missingHeaders.length > 0) {
                const mensaje = `Encabezados faltantes: ${parsed.missingHeaders.join(', ')}`
                throw new Error(mensaje)
            }

            const secuencias = parsed.validRows.map(r => r.secuencia)
            const existentes = await obtenerSecuenciasExistentes(secuencias)
            const errores = [...parsed.errors]
            let exitosos = 0

            for (const fila of parsed.validRows) {
                if (existentes.has(fila.secuencia)) {
                    errores.push({ fila: fila.fila, secuencia: fila.secuencia, mensaje: 'Secuencia ya existe en la base de datos' })
                    continue
                }
                try {
                    const { fila: _fila, ...payloadFila } = fila
                    await insertarProtestoDesdeImportacion({
                        ...payloadFila,
                        importacion_id: importacionId,
                        estado: 'vigente',
                    })
                    exitosos += 1
                } catch (err) {
                    errores.push({ fila: fila.fila, secuencia: fila.secuencia, mensaje: err.message })
                }
            }

            const resumen = {
                totalRegistros: parsed.totalRows ?? 0,
                registrosExitosos: exitosos,
                registrosError: errores.length,
            }

            await actualizarImportacionProtestos(importacionId, {
                total_registros: resumen.totalRegistros,
                registros_exitosos: resumen.registrosExitosos,
                registros_error: resumen.registrosError,
                estado: obtenerEstadoFinal(resumen.registrosError, resumen.registrosExitosos),
                errores_detalle: errores,
            })

            await registrarAuditoria({
                usuarioId: user.id,
                accion: 'IMPORTAR_PROTESTOS_EXCEL',
                entidadAfectada: 'importaciones_protestos',
                entidadAfectadaId: importacionId,
                descripcion: `Importación ${nombreArchivo}: ${resumen.registrosExitosos} importados, ${resumen.registrosError} con error`,
                metadata: { ...resumen, archivo: nombreArchivo },
            })

            setResultado({ ...resumen, errores })
            await cargarHistorial()
        } catch (err) {
            if (importacionId) {
                await actualizarImportacionProtestos(importacionId, {
                    estado: 'fallida',
                    registros_error: 1,
                    errores_detalle: [{ fila: null, secuencia: null, mensaje: err.message }],
                })
            }
            setError(err.message || 'No se pudo procesar la importación')
        } finally {
            setIsLoading(false)
        }
    }, [user, cargarHistorial])

    return {
        isLoading,
        error,
        resultado,
        historial,
        importarArchivo,
        recargarHistorial: cargarHistorial,
    }
}
