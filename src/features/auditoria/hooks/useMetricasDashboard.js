import { useCallback, useEffect, useState } from 'react'

import {
    obtenerConsultasPorEntidad,
    obtenerMetricasGlobales,
    obtenerRegistrosAuditoria,
    obtenerTopAnalistas,
} from '../services/metricas.service'

/**
 * Hook que carga las métricas del dashboard de auditoría.
 * Centraliza la lógica de fetching y estados.
 */
export function useMetricasDashboard() {
    const [metricas, setMetricas] = useState(null)
    const [consultasPorEntidad, setConsultasPorEntidad] = useState([])
    const [topAnalistas, setTopAnalistas] = useState([])
    const [registrosAuditoria, setRegistrosAuditoria] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const cargarDatos = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const [metricasData, entidadData, analistasData, auditoriaData] =
                await Promise.all([
                    obtenerMetricasGlobales(),
                    obtenerConsultasPorEntidad(),
                    obtenerTopAnalistas(),
                    obtenerRegistrosAuditoria(15),
                ])

            setMetricas(metricasData)
            setConsultasPorEntidad(entidadData)
            setTopAnalistas(analistasData)
            setRegistrosAuditoria(auditoriaData)
        } catch (err) {
            setError('Error al cargar métricas del dashboard')
            console.error('Error en métricas:', err.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        cargarDatos()
    }, [cargarDatos])

    return {
        metricas,
        consultasPorEntidad,
        topAnalistas,
        registrosAuditoria,
        isLoading,
        error,
        recargar: cargarDatos,
    }
}
