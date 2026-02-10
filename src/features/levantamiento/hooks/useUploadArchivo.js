import { useCallback, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import { subirArchivo } from '../services/archivos.service'

/**
 * Hook para gestionar upload de archivos de solicitudes.
 */
export function useUploadArchivo() {
    const { user } = useAuth()

    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState(null)
    const [archivoSubido, setArchivoSubido] = useState(null)

    const subir = useCallback(async (file, solicitudId, tipo) => {
        if (!user) return null

        setIsUploading(true)
        setError(null)
        setArchivoSubido(null)

        try {
            const archivo = await subirArchivo(file, solicitudId, tipo)

            registrarAuditoria({
                usuarioId: user.id,
                entidadFinancieraId: user.entidad_financiera_id,
                accion: 'ARCHIVO_SUBIDO',
                entidadAfectada: 'archivos',
                entidadAfectadaId: archivo.id,
                descripcion: `Archivo ${tipo} subido: ${file.name}`,
                metadata: { tipo, nombre: file.name, tamano: file.size },
            })

            setArchivoSubido(archivo)
            return archivo
        } catch (err) {
            setError(err.message)
            return null
        } finally {
            setIsUploading(false)
        }
    }, [user])

    return {
        subir,
        isUploading,
        error,
        archivoSubido,
        limpiar: () => {
            setError(null)
            setArchivoSubido(null)
        },
    }
}
