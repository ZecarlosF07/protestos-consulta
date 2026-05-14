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

    const generarPdfDocumento = useCallback(async (documento, { upsert = false } = {}) => {
        const pdfBytes = await generarPdfConCorrelativo(
            formato.nombre,
            formato.codigo,
            documento.correlativo,
            documento.metadata
        )
        const ruta = await subirPdfGenerado(pdfBytes, formato.codigo, documento.correlativo, { upsert })
        await actualizarRutaPdf(documento.id, ruta)
        return ruta
    }, [formato])

    const generar = useCallback(async ({
        tipoSolicitante,
        nroDocumento,
        nombreSolicitante,
        metadata = null,
    }) => {
        const currentUser = userRef.current
        if (!currentUser || !formato) return null

        setOperationLoading(true)
        setError(null)
        let docCreado = null
        try {
            // 1. Generar correlativo y registrar en BD (sin PDF aún)
            const doc = await generarDocumento({
                formatoId,
                tipoSolicitante,
                nroDocumento: nroDocumento.trim(),
                nombreSolicitante: nombreSolicitante.trim(),
                pdfRuta: null,
                emitidoPor: currentUser.id,
                metadata,
            })
            docCreado = doc

            // 2. Generar PDF con el correlativo asignado
            await generarPdfDocumento(doc)

            // 3. Auditoría
            await registrarAuditoria({
                usuarioId: currentUser.id,
                entidadFinancieraId: null,
                accion: 'DOCUMENTO_GENERADO',
                entidadAfectada: 'documentos_emitidos',
                entidadAfectadaId: doc.id,
                descripcion: `Generado ${formato.nombre} - Correlativo ${doc.correlativo}`,
                metadata: {
                    formato: formato.codigo,
                    correlativo: doc.correlativo,
                    datos_documento: metadata,
                },
            })

            await cargar()
            return doc
        } catch (err) {
            if (docCreado) {
                await cargar()
                setError(
                    `El correlativo ${docCreado.correlativo} quedó reservado, pero no se completó el PDF: ${err.message}. Puede regenerarse desde el historial.`
                )
            } else {
                setError(err.message)
            }
            throw err
        } finally {
            setOperationLoading(false)
        }
    }, [formatoId, formato, generarPdfDocumento, cargar])

    const regenerarPdf = useCallback(async (documento) => {
        const currentUser = userRef.current
        if (!currentUser || !formato) return null

        setOperationLoading(true)
        setError(null)
        try {
            const ruta = await generarPdfDocumento(documento, { upsert: true })

            await registrarAuditoria({
                usuarioId: currentUser.id,
                entidadFinancieraId: null,
                accion: 'DOCUMENTO_PDF_REGENERADO',
                entidadAfectada: 'documentos_emitidos',
                entidadAfectadaId: documento.id,
                descripcion: `Regenerado PDF de ${formato.nombre} - Correlativo ${documento.correlativo}`,
                metadata: {
                    formato: formato.codigo,
                    correlativo: documento.correlativo,
                    ruta,
                },
            })

            await cargar()
            return ruta
        } catch (err) {
            setError(`No se pudo regenerar el PDF: ${err.message}`)
            throw err
        } finally {
            setOperationLoading(false)
        }
    }, [formato, generarPdfDocumento, cargar])

    const anular = useCallback(async (documentoId, motivo) => {
        const currentUser = userRef.current
        if (!currentUser) return null

        setOperationLoading(true)
        setError(null)
        try {
            const doc = await anularDocumento(documentoId, currentUser.id, motivo)

            await registrarAuditoria({
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
        regenerarPdf,
        anular,
        descargar,
        recargar: cargar,
        limpiarError: () => setError(null),
    }
}
