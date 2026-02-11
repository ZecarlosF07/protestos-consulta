/** Nombre del bucket principal para documentos de levantamiento */
export const STORAGE_BUCKET = 'documentos'

/** Prefijo base para archivos de levantamiento */
export const STORAGE_PREFIX = 'levantamientos'

/**
 * Genera la ruta de almacenamiento para un archivo de solicitud.
 * Convención: levantamientos/{solicitudId}/{tipo}_{timestamp}.{ext}
 */
export function buildStoragePath(solicitudId, tipo, fileName) {
    const extension = fileName.split('.').pop()
    const timestamp = Date.now()

    return `${STORAGE_PREFIX}/${solicitudId}/${tipo}_${timestamp}.${extension}`
}

/** Duración de URLs firmadas en segundos (1 hora) */
export const SIGNED_URL_DURATION = 3600
