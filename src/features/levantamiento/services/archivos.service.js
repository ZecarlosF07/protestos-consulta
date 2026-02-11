import { supabase } from '../../../services/supabase/client'
import {
    buildStoragePath,
    SIGNED_URL_DURATION,
    STORAGE_BUCKET,
} from '../../../config/storage'
import { UPLOAD_CONFIG } from '../types/levantamiento.types'

/**
 * Valida un archivo antes de subirlo.
 * @param {File} file
 * @returns {{ valido: boolean, error: string | null }}
 */
export function validarArchivo(file) {
    if (!file) {
        return { valido: false, error: 'Seleccione un archivo' }
    }

    if (file.size > UPLOAD_CONFIG.MAX_SIZE_BYTES) {
        return {
            valido: false,
            error: `El archivo excede ${UPLOAD_CONFIG.MAX_SIZE_MB}MB`,
        }
    }

    if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        return {
            valido: false,
            error: `Tipo no permitido. Use: ${UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`,
        }
    }

    return { valido: true, error: null }
}

/**
 * Sube un archivo al Storage de Supabase y registra en la tabla archivos.
 * @param {File} file - El archivo a subir
 * @param {string} solicitudId - ID de la solicitud
 * @param {'comprobante_pago'|'formato_firmado'} tipo - Tipo de archivo
 */
export async function subirArchivo(file, solicitudId, tipo) {
    const validacion = validarArchivo(file)
    if (!validacion.valido) throw new Error(validacion.error)

    const rutaStorage = buildStoragePath(solicitudId, tipo, file.name)

    // Subir al Storage
    const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(rutaStorage, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) {
        const mensaje = interpretarErrorStorage(uploadError)
        throw new Error(mensaje)
    }

    // Registrar en tabla archivos
    const { data, error: dbError } = await supabase
        .from('archivos')
        .insert({
            solicitud_id: solicitudId,
            tipo,
            nombre_archivo: file.name,
            ruta: rutaStorage,
            tamano_bytes: file.size,
        })
        .select()
        .single()

    if (dbError) {
        // Rollback: eliminar archivo del storage si falla el registro en BD
        await supabase.storage.from(STORAGE_BUCKET).remove([rutaStorage])
        throw new Error(`Error registrando archivo: ${dbError.message}`)
    }

    return data
}

/**
 * Obtiene una URL temporal firmada para descargar un archivo.
 * Usa URLs firmadas en lugar de públicas (bucket privado).
 * @param {string} ruta
 * @returns {Promise<string>}
 */
export async function obtenerUrlDescarga(ruta) {
    if (!ruta) throw new Error('Ruta de archivo no proporcionada')

    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(ruta, SIGNED_URL_DURATION)

    if (error) throw new Error(`Error obteniendo URL: ${error.message}`)

    return data?.signedUrl ?? ''
}

/**
 * Interpreta errores de Supabase Storage y devuelve mensajes legibles.
 */
function interpretarErrorStorage(error) {
    const msg = error.message?.toLowerCase() ?? ''

    if (msg.includes('bucket not found')) {
        return 'Error de configuración: el almacenamiento no está disponible. Contacte al administrador.'
    }

    if (msg.includes('payload too large') || msg.includes('file size')) {
        return `El archivo excede el tamaño máximo permitido (${UPLOAD_CONFIG.MAX_SIZE_MB}MB)`
    }

    if (msg.includes('mime type') || msg.includes('content type')) {
        return `Tipo de archivo no permitido. Use: ${UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`
    }

    if (msg.includes('duplicate') || msg.includes('already exists')) {
        return 'Ya existe un archivo con este nombre. Intente nuevamente.'
    }

    if (msg.includes('not authorized') || msg.includes('unauthorized')) {
        return 'No tiene permisos para subir archivos. Verifique su sesión.'
    }

    return `Error subiendo archivo: ${error.message}`
}
