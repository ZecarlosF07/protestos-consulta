import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import {
    cambiarEstadoProtestoAdmin,
    obtenerEntidadesFinanciadoras,
    obtenerHistorialProtesto,
    obtenerProtestos,
} from '../services/protestos.service'

/** Hook para gestión administrativa de protestos */
export function useProtestosAdmin() {
    const { user } = useAuth()
    const [protestos, setProtestos] = useState([])
    const [entidadesFinanciadoras, setEntidadesFinanciadoras] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [filtros, setFiltros] = useState({
        estado: '',
        entidad: '',
        fechaDesde: '',
        fechaHasta: '',
        busqueda: '',
    })

    const cargarProtestos = useCallback(async (page = 1) => {
        setIsLoading(true)
        setError(null)

        try {
            const resultado = await obtenerProtestos({ ...filtros, page })
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
    }, [filtros])

    const cargarEntidades = useCallback(async () => {
        try {
            const data = await obtenerEntidadesFinanciadoras()
            setEntidadesFinanciadoras(data)
        } catch (err) {
            console.error('Error cargando entidades:', err.message)
        }
    }, [])

    useEffect(() => {
        cargarEntidades()
    }, [cargarEntidades])

    useEffect(() => {
        cargarProtestos(1)
    }, [cargarProtestos])

    const cambiarEstado = useCallback(async (protestoId, nuevoEstado) => {
        const actualizado = await cambiarEstadoProtestoAdmin(protestoId, nuevoEstado)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'CAMBIAR_ESTADO_PROTESTO',
            entidadAfectada: 'protesto',
            entidadAfectadaId: protestoId,
            descripcion: `Estado cambiado a "${nuevoEstado}"`,
            metadata: { estado_anterior: actualizado.estado, nuevo_estado: nuevoEstado },
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
        setFiltros({ estado: '', entidad: '', fechaDesde: '', fechaHasta: '', busqueda: '' })
    }, [])

    return {
        protestos,
        entidadesFinanciadoras,
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
