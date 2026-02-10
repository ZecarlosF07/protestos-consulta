import { supabase } from './client'

/**
 * Registra un evento en la tabla de auditoría.
 * Silencea errores para no bloquear el flujo principal.
 */
export async function registrarAuditoria({
    usuarioId,
    entidadFinancieraId = null,
    accion,
    entidadAfectada = null,
    entidadAfectadaId = null,
    descripcion = null,
    metadata = null,
}) {
    try {
        const { error } = await supabase.from('auditoria').insert({
            usuario_id: usuarioId,
            entidad_financiera_id: entidadFinancieraId,
            accion,
            entidad_afectada: entidadAfectada,
            entidad_afectada_id: entidadAfectadaId,
            descripcion,
            metadata,
        })

        if (error) {
            console.error('Error al registrar auditoría:', error.message)
        }
    } catch (err) {
        console.error('Error inesperado en auditoría:', err.message)
    }
}
