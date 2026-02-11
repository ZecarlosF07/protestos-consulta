import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import {
    bloquearEntidad,
    crearEntidad,
    desbloquearEntidad,
    editarEntidad,
    obtenerConteoAnalistas,
    obtenerEntidades,
} from '../services/entidades.service'

/** Hook para gestión completa de entidades financieras */
export function useEntidades() {
    const { user } = useAuth()
    const [entidades, setEntidades] = useState([])
    const [conteoAnalistas, setConteoAnalistas] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtroEstado, setFiltroEstado] = useState('')
    const [busqueda, setBusqueda] = useState('')

    const cargarDatos = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const entidadesData = await obtenerEntidades()
            setEntidades(entidadesData)

            const ids = entidadesData.map((e) => e.id)
            const conteo = await obtenerConteoAnalistas(ids)
            setConteoAnalistas(conteo)
        } catch (err) {
            setError('Error al cargar entidades financieras')
            console.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        cargarDatos()
    }, [cargarDatos])

    const entidadesFiltradas = entidades.filter((e) => {
        if (filtroEstado && e.estado !== filtroEstado) return false
        if (busqueda && !e.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
        return true
    })

    const crear = useCallback(async (payload) => {
        const nueva = await crearEntidad(payload)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'CREAR_ENTIDAD',
            entidadAfectada: 'entidad_financiera',
            entidadAfectadaId: nueva.id,
            descripcion: `Entidad creada: ${payload.nombre}`,
        })
        await cargarDatos()
        return nueva
    }, [user, cargarDatos])

    const editar = useCallback(async (id, updates) => {
        const actualizada = await editarEntidad(id, updates)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'EDITAR_ENTIDAD',
            entidadAfectada: 'entidad_financiera',
            entidadAfectadaId: id,
            descripcion: `Entidad editada: ${updates.nombre}`,
        })
        await cargarDatos()
        return actualizada
    }, [user, cargarDatos])

    const bloquear = useCallback(async (entidad) => {
        await bloquearEntidad(entidad.id)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'BLOQUEAR_ENTIDAD',
            entidadAfectada: 'entidad_financiera',
            entidadAfectadaId: entidad.id,
            descripcion: `Entidad bloqueada: ${entidad.nombre} (analistas asociados bloqueados en cascada)`,
        })
        await cargarDatos()
    }, [user, cargarDatos])

    const desbloquear = useCallback(async (entidad) => {
        await desbloquearEntidad(entidad.id)
        await registrarAuditoria({
            usuarioId: user.id,
            accion: 'DESBLOQUEAR_ENTIDAD',
            entidadAfectada: 'entidad_financiera',
            entidadAfectadaId: entidad.id,
            descripcion: `Entidad desbloqueada: ${entidad.nombre}`,
        })
        await cargarDatos()
    }, [user, cargarDatos])

    return {
        entidades: entidadesFiltradas,
        conteoAnalistas,
        isLoading,
        error,
        filtroEstado,
        busqueda,
        setFiltroEstado,
        setBusqueda,
        crear,
        editar,
        bloquear,
        desbloquear,
        recargar: cargarDatos,
    }
}
