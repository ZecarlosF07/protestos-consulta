import { supabase } from '../../../services/supabase/client'
import { UPLOAD_CONFIG } from '../types/levantamiento.types'

/**
 * Valida un archivo antes de subirlo.
 * @param {File} file
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

    const extension = file.name.split('.').pop()
    const timestamp = Date.now()
    const rutaStorage = `levantamientos/${solicitudId}/${tipo}_${timestamp}.${extension}`

    // Subir al Storage
    const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(rutaStorage, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) throw new Error(`Error subiendo archivo: ${uploadError.message}`)

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

    if (dbError) throw new Error(dbError.message)

    return data
}

/**
 * Obtiene la URL pública (temporal) de un archivo.
 * @param {string} ruta
 * @returns {string}
 */
export function obtenerUrlArchivo(ruta) {
    const { data } = supabase.storage
        .from('documentos')
        .getPublicUrl(ruta)

    return data?.publicUrl ?? ''
}

/**
 * Obtiene una URL temporal firmada para descargar un archivo.
 * @param {string} ruta
 * @returns {Promise<string>}
 */
export async function obtenerUrlDescarga(ruta) {
    const { data, error } = await supabase.storage
        .from('documentos')
        .createSignedUrl(ruta, 3600)

    if (error) throw new Error(error.message)

    return data?.signedUrl ?? ''
}
