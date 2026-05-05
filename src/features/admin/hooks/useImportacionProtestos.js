import { useCallback, useEffect, useState } from 'react'

import { registrarAuditoria } from '../../../services/supabase/audit.service'
import { useAuth } from '../../auth/hooks/useAuth'
import {
    actualizarImportacionProtestos,
    crearImportacionProtestos,
    importarProtestosAtomicos,
    obtenerHistorialImportaciones,
    obtenerSecuenciasExistentes,
} from '../services/importacion.service'
import { IMPORTACION_ESTADO } from '../types/importacion.types'
import { parsearExcelProtestos } from '../utils/importacion-excel.utils'

function crearErrorExistente(fila) {
    return {
        fila: fila.fila,
        columna: 'secuencia',
        campo: 'secuencia',
        valor: fila.secuencia,
        secuencia: fila.secuencia,
        mensaje: 'Secuencia ya existe en la base de datos',
    }
}

function crearErrorSinFilasValidas() {
    return {
        fila: null,
        columna: null,
        campo: null,
        valor: '',
        secuencia: null,
        mensaje: 'El archivo no contiene filas válidas para importar',
    }
}

function prepararPayloadAtomico(rows) {
    return rows.map((row) => {
        const protesto = { ...row }
        delete protesto.fila
        return protesto
    })
}

function contarRegistrosConError(errores) {
    const filas = errores
        .map(error => error.fila)
        .filter(fila => fila !== null && fila !== undefined)
    if (!filas.length) return errores.length
    return new Set(filas).size
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

            const secuencias = parsed.validRows.map(r => r.secuencia)
            const existentes = await obtenerSecuenciasExistentes(secuencias)
            const errores = [...parsed.errors]
            parsed.validRows
                .filter(fila => existentes.has(fila.secuencia))
                .forEach(fila => errores.push(crearErrorExistente(fila)))
            if (parsed.validRows.length === 0 && errores.length === 0) {
                errores.push(crearErrorSinFilasValidas())
            }

            if (errores.length > 0) {
                const resumenFallido = {
                    totalRegistros: parsed.totalRows ?? 0,
                    registrosExitosos: 0,
                    registrosError: contarRegistrosConError(errores),
                    estado: IMPORTACION_ESTADO.FALLIDA,
                }

                await actualizarImportacionProtestos(importacionId, {
                    total_registros: resumenFallido.totalRegistros,
                    registros_exitosos: 0,
                    registros_error: resumenFallido.registrosError,
                    estado: IMPORTACION_ESTADO.FALLIDA,
                    errores_detalle: errores,
                })

                await registrarAuditoria({
                    usuarioId: user.id,
                    accion: 'IMPORTAR_PROTESTOS_EXCEL',
                    entidadAfectada: 'importaciones_protestos',
                    entidadAfectadaId: importacionId,
                    descripcion: `Importación rechazada: ${nombreArchivo} (${errores.length} error(es))`,
                    metadata: { ...resumenFallido, archivo: nombreArchivo },
                })

                setResultado({ ...resumenFallido, errores })
                await cargarHistorial()
                return
            }

            const insertados = await importarProtestosAtomicos(
                importacionId,
                prepararPayloadAtomico(parsed.validRows)
            )

            const resumen = {
                totalRegistros: parsed.totalRows ?? 0,
                registrosExitosos: insertados,
                registrosError: 0,
                estado: IMPORTACION_ESTADO.COMPLETADA,
            }

            await registrarAuditoria({
                usuarioId: user.id,
                accion: 'IMPORTAR_PROTESTOS_EXCEL',
                entidadAfectada: 'importaciones_protestos',
                entidadAfectadaId: importacionId,
                descripcion: `Importación ${nombreArchivo}: ${resumen.registrosExitosos} importados, ${resumen.registrosError} con error`,
                metadata: { ...resumen, archivo: nombreArchivo },
            })

            setResultado({ ...resumen, errores: [] })
            await cargarHistorial()
        } catch (err) {
            const errores = [{
                fila: null,
                columna: null,
                campo: null,
                valor: '',
                secuencia: null,
                mensaje: err.message,
            }]
            if (importacionId) {
                await actualizarImportacionProtestos(importacionId, {
                    estado: IMPORTACION_ESTADO.FALLIDA,
                    registros_error: 1,
                    errores_detalle: errores,
                })
                await registrarAuditoria({
                    usuarioId: user.id,
                    accion: 'IMPORTAR_PROTESTOS_EXCEL',
                    entidadAfectada: 'importaciones_protestos',
                    entidadAfectadaId: importacionId,
                    descripcion: `Importación fallida: ${err.message}`,
                    metadata: { estado: IMPORTACION_ESTADO.FALLIDA },
                })
            }
            setResultado({
                totalRegistros: 0,
                registrosExitosos: 0,
                registrosError: 1,
                estado: IMPORTACION_ESTADO.FALLIDA,
                errores,
            })
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
