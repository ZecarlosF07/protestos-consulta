import { supabase } from '../../../services/supabase/client'
import { STORAGE_BUCKET, SIGNED_URL_DURATION } from '../../../config/storage'
import { FORMATOS_STORAGE_PREFIX } from '../types/formatos.types'

/** Campos select para documentos con relaciones */
const DOCUMENTO_SELECT = `
    id, formato_id, correlativo,
    tipo_solicitante, nro_documento, nombre_solicitante,
    pdf_ruta, estado, emitido_por,
    anulado_por, fecha_anulacion, motivo_anulacion,
    metadata, created_at,
    emisor:usuarios!documentos_emitidos_emitido_por_fkey(nombre_completo),
    anulador:usuarios!documentos_emitidos_anulado_por_fkey(nombre_completo)
`

/** Obtiene los 3 formatos PDF disponibles */
export async function obtenerFormatos() {
    const { data, error } = await supabase
        .from('formatos_pdf')
        .select('*')
        .eq('activo', true)
        .order('nombre')

    if (error) throw new Error(error.message)
    return data ?? []
}

/** Obtiene un formato por ID */
export async function obtenerFormatoPorId(formatoId) {
    const { data, error } = await supabase
        .from('formatos_pdf')
        .select('*')
        .eq('id', formatoId)
        .single()

    if (error) throw new Error(error.message)
    return data
}

/** Obtiene documentos emitidos de un formato */
export async function obtenerDocumentos(formatoId) {
    const { data, error } = await supabase
        .from('documentos_emitidos')
        .select(DOCUMENTO_SELECT)
        .eq('formato_id', formatoId)
        .order('correlativo', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
}

/** Obtiene un documento emitido por ID */
export async function obtenerDocumentoPorId(documentoId) {
    const { data, error } = await supabase
        .from('documentos_emitidos')
        .select(DOCUMENTO_SELECT)
        .eq('id', documentoId)
        .single()

    if (error) throw new Error(error.message)
    return data
}

/**
 * Genera un nuevo documento con correlativo atómico.
 * La RPC incrementa el correlativo e inserta el historial en la misma transacción.
 */
export async function generarDocumento({
    formatoId,
    tipoSolicitante,
    nroDocumento,
    nombreSolicitante,
    pdfRuta,
    emitidoPor,
    metadata = null,
}) {
    const { data: documentoId, error } = await supabase.rpc('generar_documento_emitido', {
        p_formato_id: formatoId,
        p_tipo_solicitante: tipoSolicitante,
        p_nro_documento: nroDocumento,
        p_nombre_solicitante: nombreSolicitante,
        p_pdf_ruta: pdfRuta,
        p_emitido_por: emitidoPor,
        p_metadata: metadata,
    })

    if (error) throw new Error(error.message)
    return obtenerDocumentoPorId(documentoId)
}

/** Anula un documento emitido */
export async function anularDocumento(documentoId, anuladoPor, motivo) {
    if (!motivo?.trim()) throw new Error('El motivo de anulación es obligatorio')

    const { data, error } = await supabase
        .from('documentos_emitidos')
        .update({
            estado: 'anulado',
            anulado_por: anuladoPor,
            fecha_anulacion: new Date().toISOString(),
            motivo_anulacion: motivo.trim(),
        })
        .eq('id', documentoId)
        .eq('estado', 'activo')
        .select(DOCUMENTO_SELECT)
        .single()

    if (error) throw new Error(error.message)
    return data
}

/** Sube un PDF generado al storage */
export async function subirPdfGenerado(pdfBytes, formatoCodigo, correlativo, { upsert = false } = {}) {
    const ruta = `${FORMATOS_STORAGE_PREFIX}/${formatoCodigo}/${formatoCodigo}_${correlativo}.pdf`

    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(ruta, pdfBytes, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert,
        })

    if (error) throw new Error(`Error subiendo PDF: ${error.message}`)
    return ruta
}

/** Actualiza la ruta del PDF generado en un documento emitido */
export async function actualizarRutaPdf(documentoId, ruta) {
    const { error } = await supabase
        .from('documentos_emitidos')
        .update({ pdf_ruta: ruta })
        .eq('id', documentoId)

    if (error) throw new Error(`Error actualizando ruta PDF: ${error.message}`)
}

/** Obtiene URL firmada para descargar un PDF */
export async function obtenerUrlPdf(ruta) {
    if (!ruta) throw new Error('Ruta del PDF no proporcionada')

    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(ruta, SIGNED_URL_DURATION)

    if (error) throw new Error(`Error obteniendo URL: ${error.message}`)
    return data?.signedUrl ?? ''
}
