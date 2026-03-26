import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { registrarAuditoria } from '../../../services/supabase/audit.service'
import {
    actualizarRutaPdf,
    anularDocumento,
    generarDocumento,
    obtenerDocumentos,
    obtenerFormatoPorId,
    obtenerUrlPdf,
    subirPdfGenerado,
} from '../services/formatos.service'
import { generarPdfConCorrelativo } from '../services/pdf-generator.service'

/** Hook para gestionar documentos emitidos de un formato */
export function useDocumentosEmitidos(formatoId) {
    const { user } = useAuth()
    const userRef = useRef(user)
    userRef.current = user

    const [formato, setFormato] = useState(null)
    const [documentos, setDocumentos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [operationLoading, setOperationLoading] = useState(false)
    const [error, setError] = useState(null)

    const cargar = useCallback(async () => {
        if (!formatoId) return
        setIsLoading(true)
        setError(null)
        try {
            const [fmt, docs] = await Promise.all([
                obtenerFormatoPorId(formatoId),
                obtenerDocumentos(formatoId),
            ])
            setFormato(fmt)
            setDocumentos(docs)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [formatoId])

    useEffect(() => {
        cargar()
    }, [cargar])

    const generar = useCallback(async ({ tipoSolicitante, nroDocumento, nombreSolicitante }) => {
        const currentUser = userRef.current
        if (!currentUser || !formato) return null

        setOperationLoading(true)
        setError(null)
        try {
            // 1. Generar correlativo y registrar en BD (sin PDF aún)
            const doc = await generarDocumento({
                formatoId,
                tipoSolicitante,
                nroDocumento: nroDocumento.trim(),
                nombreSolicitante: nombreSolicitante.trim(),
                pdfRuta: null,
                emitidoPor: currentUser.id,
            })

            // 2. Generar PDF con el correlativo asignado
            const pdfBytes = await generarPdfConCorrelativo(
                formato.nombre, formato.codigo, doc.correlativo
            )

            // 3. Subir PDF al storage
            const ruta = await subirPdfGenerado(pdfBytes, formato.codigo, doc.correlativo)

            // 4. Actualizar ruta en la BD
            await actualizarRutaPdf(doc.id, ruta)

            // 5. Auditoría
            registrarAuditoria({
                usuarioId: currentUser.id,
                entidadFinancieraId: null,
                accion: 'DOCUMENTO_GENERADO',
                entidadAfectada: 'documentos_emitidos',
                entidadAfectadaId: doc.id,
                descripcion: `Generado ${formato.nombre} - Correlativo ${doc.correlativo}`,
                metadata: { formato: formato.codigo, correlativo: doc.correlativo },
            })

            await cargar()
            return doc
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setOperationLoading(false)
        }
    }, [formatoId, formato, cargar])

    const anular = useCallback(async (documentoId, motivo) => {
        const currentUser = userRef.current
        if (!currentUser) return null

        setOperationLoading(true)
        setError(null)
        try {
            const doc = await anularDocumento(documentoId, currentUser.id, motivo)

            registrarAuditoria({
                usuarioId: currentUser.id,
                entidadFinancieraId: null,
                accion: 'DOCUMENTO_ANULADO',
                entidadAfectada: 'documentos_emitidos',
                entidadAfectadaId: documentoId,
                descripcion: `Anulado correlativo ${doc.correlativo} - Motivo: ${motivo}`,
                metadata: { correlativo: doc.correlativo, motivo },
            })

            await cargar()
            return doc
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setOperationLoading(false)
        }
    }, [cargar])

    const descargar = useCallback(async (pdfRuta) => {
        const url = await obtenerUrlPdf(pdfRuta)
        window.open(url, '_blank')
    }, [])

    return {
        formato,
        documentos,
        isLoading,
        operationLoading,
        error,
        generar,
        anular,
        descargar,
        recargar: cargar,
        limpiarError: () => setError(null),
    }
}
