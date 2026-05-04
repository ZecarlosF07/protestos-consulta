import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import {
    cambiarEstadoProtestoAdmin,
    obtenerHistorialProtesto,
    obtenerProtestos,
} from '../services/protestos.service'

const FILTER_DEBOUNCE_MS = 350
const INITIAL_FILTERS = {
    estado: '',
    entidad: '',
    fechaDesde: '',
    fechaHasta: '',
    busquedaTipo: 'secuencia',
    busqueda: '',
}

/** Hook para gestión administrativa de protestos */
export function useProtestosAdmin() {
    const { user } = useAuth()
    const [protestos, setProtestos] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtros, setFiltros] = useState(INITIAL_FILTERS)
    const [filtrosAplicados, setFiltrosAplicados] = useState(INITIAL_FILTERS)

    const cargarProtestos = useCallback(async (page = 1) => {
        setIsLoading(true)
        setError(null)

        try {
            const resultado = await obtenerProtestos({ ...filtrosAplicados, page })
            setProtestos(resultado.protestos)
            setTotal(resultado.total)
            setTotalPages(resultado.totalPages)
            setCurrentPage(resultado.currentPage)
        } catch (err) {
            setError('Error al cargar protestos')
            console.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [filtrosAplicados])

    useEffect(() => {
        cargarProtestos(1)
    }, [cargarProtestos])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setFiltrosAplicados(filtros)
        }, FILTER_DEBOUNCE_MS)

        return () => window.clearTimeout(timeoutId)
    }, [filtros])

    const cambiarEstado = useCallback(async (protestoId, nuevoEstado) => {
        const { anterior, actualizado } = await cambiarEstadoProtestoAdmin(protestoId, nuevoEstado)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'CAMBIAR_ESTADO_PROTESTO',
            entidadAfectada: 'protesto',
            entidadAfectadaId: protestoId,
            descripcion: `Estado cambiado a "${nuevoEstado}"`,
            metadata: { estado_anterior: anterior.estado, nuevo_estado: actualizado.estado },
        })
        await cargarProtestos(currentPage)
        return actualizado
    }, [user, cargarProtestos, currentPage])

    const obtenerHistorial = useCallback(async (protestoId) => {
        return await obtenerHistorialProtesto(protestoId)
    }, [])

    const actualizarFiltro = useCallback((campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }))
    }, [])

    const limpiarFiltros = useCallback(() => {
        setFiltros(INITIAL_FILTERS)
        setFiltrosAplicados(INITIAL_FILTERS)
    }, [])

    return {
        protestos,
        total,
        totalPages,
        currentPage,
        isLoading,
        error,
        filtros,
        actualizarFiltro,
        limpiarFiltros,
        cambiarEstado,
        obtenerHistorial,
        irAPagina: cargarProtestos,
        recargar: () => cargarProtestos(currentPage),
    }
}
