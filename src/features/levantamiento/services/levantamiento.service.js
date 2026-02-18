import { supabase } from '../../../services/supabase/client'
import { SOLICITUD_TRANSITIONS } from '../types/levantamiento.types'

/** Campos select para solicitudes con relaciones */
const SOLICITUD_SELECT = `
    id,
    protesto_id,
    usuario_id,
    entidad_financiera_id,
    observaciones,
    tipo_comprobante,
    requiere_certificado,
    estado,
    created_at,
    updated_at,
    protesto:protestos(
        id, secuencia, nombre_persona, numero_documento,
        tipo_documento, monto, estado, fecha_protesto,
        entidad_financiadora, tarifa_levantamiento
    ),
    usuario:usuarios(nombre_completo, email),
    entidad_financiera:entidades_financieras(nombre),
    archivos(id, tipo, nombre_archivo, ruta, tamano_bytes, created_at)
`

/**
 * Crea una solicitud de levantamiento para un protesto vigente.
 * Valida que el protesto sea vigente y que no exista solicitud activa.
 */
export async function crearSolicitud({
    protestoId,
    usuarioId,
    entidadFinancieraId,
    tipoComprobante = null,
    requiereCertificado = false,
}) {
    // Verificar que el protesto está vigente (vía RPC, el analista no tiene SELECT directo)
    const { data: verificacion, error: vError } = await supabase.rpc(
        'verificar_protesto_vigente',
        { p_protesto_id: protestoId }
    )

    if (vError) throw new Error('Error verificando el protesto')
    if (!verificacion?.encontrado) throw new Error('No se encontró el protesto')
    if (!verificacion?.vigente) {
        throw new Error('Solo se pueden solicitar levantamientos para protestos vigentes')
    }

    // Verificar que no exista solicitud activa para este protesto
    const { data: existente } = await supabase
        .from('solicitudes_levantamiento')
        .select('id')
        .eq('protesto_id', protestoId)
        .is('deleted_at', null)
        .in('estado', ['registrada', 'en_revision'])
        .limit(1)

    if (existente && existente.length > 0) {
        throw new Error('Ya existe una solicitud activa para este protesto')
    }

    // Crear solicitud
    const { data, error } = await supabase
        .from('solicitudes_levantamiento')
        .insert({
            protesto_id: protestoId,
            usuario_id: usuarioId,
            entidad_financiera_id: entidadFinancieraId,
            tipo_comprobante: tipoComprobante,
            requiere_certificado: requiereCertificado,
            estado: 'registrada',
        })
        .select(SOLICITUD_SELECT)
        .single()

    if (error) throw new Error(error.message)

    // Cambiar estado del protesto a en_proceso (vía RPC)
    await supabase.rpc('cambiar_estado_protesto_solicitud', {
        p_protesto_id: protestoId,
        p_nuevo_estado: 'en_proceso',
    })

    return data
}

/**
 * Actualiza campos adicionales de una solicitud (cuenta_deposito, tipo_comprobante, requiere_certificado).
 */
export async function actualizarCamposSolicitud(solicitudId, campos) {
    const allowedFields = ['tipo_comprobante', 'requiere_certificado']
    const updates = {}

    for (const field of allowedFields) {
        if (field in campos) {
            updates[field] = campos[field]
        }
    }

    if (Object.keys(updates).length === 0) return null

    const { data, error } = await supabase
        .from('solicitudes_levantamiento')
        .update(updates)
        .eq('id', solicitudId)
        .select(SOLICITUD_SELECT)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/**
 * Obtiene solicitudes del analista autenticado.
 */
export async function obtenerMisSolicitudes(usuarioId) {
    const { data, error } = await supabase
        .from('solicitudes_levantamiento')
        .select(SOLICITUD_SELECT)
        .eq('usuario_id', usuarioId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data ?? []
}

/**
 * Obtiene todas las solicitudes (vista admin).
 */
export async function obtenerTodasSolicitudes() {
    const { data, error } = await supabase
        .from('solicitudes_levantamiento')
        .select(SOLICITUD_SELECT)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data ?? []
}

/**
 * Obtiene una solicitud por ID.
 */
export async function obtenerSolicitudPorId(solicitudId) {
    const { data, error } = await supabase
        .from('solicitudes_levantamiento')
        .select(SOLICITUD_SELECT)
        .eq('id', solicitudId)
        .is('deleted_at', null)
        .single()

    if (error) throw new Error(error.message)

    return data
}

/**
 * Cambia el estado de una solicitud. Valida transiciones permitidas.
 */
export async function cambiarEstadoSolicitud(solicitudId, nuevoEstado, observaciones = null) {
    const solicitud = await obtenerSolicitudPorId(solicitudId)

    const transicionesPermitidas = SOLICITUD_TRANSITIONS[solicitud.estado]
    if (!transicionesPermitidas?.includes(nuevoEstado)) {
        throw new Error(
            `Transición no permitida: ${solicitud.estado} → ${nuevoEstado}`
        )
    }

    const updates = { estado: nuevoEstado }
    if (observaciones !== null) {
        updates.observaciones = observaciones
    }

    const { data, error } = await supabase
        .from('solicitudes_levantamiento')
        .update(updates)
        .eq('id', solicitudId)
        .select(SOLICITUD_SELECT)
        .single()

    if (error) throw new Error(error.message)

    // Si se aprueba, cambiar protesto a levantado
    if (nuevoEstado === 'aprobada') {
        await supabase
            .from('protestos')
            .update({ estado: 'levantado' })
            .eq('id', solicitud.protesto_id)
    }

    // Si se rechaza, volver protesto a vigente
    if (nuevoEstado === 'rechazada') {
        await supabase
            .from('protestos')
            .update({ estado: 'vigente' })
            .eq('id', solicitud.protesto_id)
    }

    return data
}

/**
 * Cambia el estado de un protesto directamente (acción admin).
 */
export async function cambiarEstadoProtesto(protestoId, nuevoEstado) {
    const estadosValidos = ['vigente', 'en_proceso', 'levantado']
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado no válido: ${nuevoEstado}`)
    }

    const { data, error } = await supabase
        .from('protestos')
        .update({ estado: nuevoEstado })
        .eq('id', protestoId)
        .select('id, estado')
        .single()

    if (error) throw new Error(error.message)

    return data
}
