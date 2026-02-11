import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import {
    cambiarEstadoSolicitud,
    crearSolicitud,
    obtenerMisSolicitudes,
    obtenerTodasSolicitudes,
} from '../services/levantamiento.service'

/**
 * Hook para gestionar solicitudes de levantamiento.
 * Funciona para analistas (mis solicitudes) y admin (todas).
 * Usa user.id como dependencia estable para evitar re-fetches innecesarios.
 */
export function useSolicitudes({ modo = 'analista' } = {}) {
    const { user } = useAuth()
    const userRef = useRef(user)
    userRef.current = user

    const userId = user?.id
    const [solicitudes, setSolicitudes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [operationLoading, setOperationLoading] = useState(false)

    const cargarSolicitudes = useCallback(async () => {
        if (!userId) return

        setIsLoading(true)
        setError(null)

        try {
            const data = modo === 'admin'
                ? await obtenerTodasSolicitudes()
                : await obtenerMisSolicitudes(userId)

            setSolicitudes(data)
        } catch (err) {
            setError('Error al cargar solicitudes')
            console.error('Error cargando solicitudes:', err.message)
        } finally {
            setIsLoading(false)
        }
    }, [userId, modo])

    useEffect(() => {
        cargarSolicitudes()
    }, [cargarSolicitudes])

    const crear = useCallback(async (protestoId) => {
        const currentUser = userRef.current
        if (!currentUser) return null

        setOperationLoading(true)
        setError(null)

        try {
            const solicitud = await crearSolicitud({
                protestoId,
                usuarioId: currentUser.id,
                entidadFinancieraId: currentUser.entidad_financiera_id,
            })

            registrarAuditoria({
                usuarioId: currentUser.id,
                entidadFinancieraId: currentUser.entidad_financiera_id,
                accion: 'SOLICITUD_CREADA',
                entidadAfectada: 'solicitudes_levantamiento',
                entidadAfectadaId: solicitud.id,
                descripcion: `Solicitud de levantamiento creada para protesto ${protestoId}`,
            })

            await cargarSolicitudes()
            return solicitud
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setOperationLoading(false)
        }
    }, [cargarSolicitudes])

    const cambiarEstado = useCallback(async (solicitudId, nuevoEstado, observaciones = null) => {
        const currentUser = userRef.current
        if (!currentUser) return null

        setOperationLoading(true)
        setError(null)

        try {
            const solicitud = await cambiarEstadoSolicitud(
                solicitudId,
                nuevoEstado,
                observaciones
            )

            registrarAuditoria({
                usuarioId: currentUser.id,
                entidadFinancieraId: currentUser.entidad_financiera_id,
                accion: `SOLICITUD_${nuevoEstado.toUpperCase()}`,
                entidadAfectada: 'solicitudes_levantamiento',
                entidadAfectadaId: solicitudId,
                descripcion: `Solicitud ${solicitudId} → ${nuevoEstado}`,
                metadata: { observaciones },
            })

            await cargarSolicitudes()
            return solicitud
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setOperationLoading(false)
        }
    }, [cargarSolicitudes])

    return {
        solicitudes,
        isLoading,
        error,
        operationLoading,
        crear,
        cambiarEstado,
        recargar: cargarSolicitudes,
        limpiarError: () => setError(null),
    }
}
