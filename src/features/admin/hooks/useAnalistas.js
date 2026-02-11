import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import {
    bloquearAnalista,
    crearAnalista,
    desbloquearAnalista,
    editarAnalista,
    obtenerAnalistas,
    obtenerEntidadesFinancieras,
    resetearPasswordAnalista,
} from '../services/analistas.service'

/** Hook para gestión completa de analistas */
export function useAnalistas() {
    const { user } = useAuth()
    const [analistas, setAnalistas] = useState([])
    const [entidades, setEntidades] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtroEntidad, setFiltroEntidad] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('')

    const cargarDatos = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const [analistasData, entidadesData] = await Promise.all([
                obtenerAnalistas(),
                obtenerEntidadesFinancieras(),
            ])
            setAnalistas(analistasData)
            setEntidades(entidadesData)
        } catch (err) {
            setError('Error al cargar analistas')
            console.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        cargarDatos()
    }, [cargarDatos])

    const analistasFiltrados = analistas.filter((a) => {
        if (filtroEntidad && a.entidad_financiera_id !== filtroEntidad) return false
        if (filtroEstado && a.estado !== filtroEstado) return false
        return true
    })

    const crear = useCallback(async (payload) => {
        const nuevo = await crearAnalista(payload)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'CREAR_ANALISTA',
            entidadAfectada: 'usuario',
            entidadAfectadaId: nuevo.id,
            descripcion: `Analista creado: ${payload.nombre_completo}`,
        })
        await cargarDatos()
        return nuevo
    }, [user, cargarDatos])

    const editar = useCallback(async (id, updates) => {
        const actualizado = await editarAnalista(id, updates)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'EDITAR_ANALISTA',
            entidadAfectada: 'usuario',
            entidadAfectadaId: id,
            descripcion: `Analista editado: ${updates.nombre_completo}`,
        })
        await cargarDatos()
        return actualizado
    }, [user, cargarDatos])

    const bloquear = useCallback(async (analista) => {
        await bloquearAnalista(analista.id)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'BLOQUEAR_ANALISTA',
            entidadAfectada: 'usuario',
            entidadAfectadaId: analista.id,
            descripcion: `Analista bloqueado: ${analista.nombre_completo}`,
        })
        await cargarDatos()
    }, [user, cargarDatos])

    const desbloquear = useCallback(async (analista) => {
        await desbloquearAnalista(analista.id)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'DESBLOQUEAR_ANALISTA',
            entidadAfectada: 'usuario',
            entidadAfectadaId: analista.id,
            descripcion: `Analista desbloqueado: ${analista.nombre_completo}`,
        })
        await cargarDatos()
    }, [user, cargarDatos])

    const resetearPassword = useCallback(async (analista) => {
        await resetearPasswordAnalista(analista.email)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'RESETEAR_PASSWORD',
            entidadAfectada: 'usuario',
            entidadAfectadaId: analista.id,
            descripcion: `Password reseteado: ${analista.nombre_completo}`,
        })
    }, [user])

    return {
        analistas: analistasFiltrados,
        entidades,
        isLoading,
        error,
        filtroEntidad,
        filtroEstado,
        setFiltroEntidad,
        setFiltroEstado,
        crear,
        editar,
        bloquear,
        desbloquear,
        resetearPassword,
        recargar: cargarDatos,
    }
}
