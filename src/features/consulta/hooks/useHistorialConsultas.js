import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { obtenerHistorialConsultas } from '../services/historial.service'
import { HISTORIAL_FILTROS_INICIALES, HISTORIAL_PAGE_SIZE } from '../types/historial.types'

/**
 * Hook que encapsula la lógica de historial de consultas del analista.
 * Maneja filtros, paginación y estados de carga.
 */
export function useHistorialConsultas() {
    const { user } = useAuth()

    const [consultas, setConsultas] = useState([])
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [pagina, setPagina] = useState(0)
    const [filtros, setFiltros] = useState(HISTORIAL_FILTROS_INICIALES)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const totalPaginas = Math.ceil(totalRegistros / HISTORIAL_PAGE_SIZE)

    const cargar = useCallback(async () => {
        if (!user?.id) return

        setIsLoading(true)
        setError(null)

        try {
            const { data, count } = await obtenerHistorialConsultas(user.id, filtros, pagina)
            setConsultas(data)
            setTotalRegistros(count)
        } catch (err) {
            setError('Error al cargar el historial de consultas.')
            console.error('Error en historial:', err.message)
        } finally {
            setIsLoading(false)
        }
    }, [user?.id, filtros, pagina])

    useEffect(() => {
        cargar()
    }, [cargar])

    const cambiarFiltro = useCallback((campo, valor) => {
        setFiltros((prev) => ({ ...prev, [campo]: valor }))
        setPagina(0)
    }, [])

    const limpiarFiltros = useCallback(() => {
        setFiltros(HISTORIAL_FILTROS_INICIALES)
        setPagina(0)
    }, [])

    const irAPagina = useCallback((nuevaPagina) => {
        setPagina(nuevaPagina)
    }, [])

    return {
        consultas,
        totalRegistros,
        pagina,
        totalPaginas,
        filtros,
        isLoading,
        error,
        cambiarFiltro,
        limpiarFiltros,
        irAPagina,
        recargar: cargar,
    }
}
