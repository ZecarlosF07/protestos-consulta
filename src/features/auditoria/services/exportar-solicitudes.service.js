import * as XLSX from 'xlsx'

import { supabase } from '../../../services/supabase/client'
import { SOLICITUD_ESTADO_LABELS } from '../../levantamiento/types/levantamiento.types'

/**
 * Obtiene solicitudes filtradas por entidad financiera para exportación.
 * @param {string|null} entidadId - ID de la entidad. null = todas
 * @returns {Promise<Array>}
 */
export async function obtenerSolicitudesParaExportar(entidadId = null) {
    let query = supabase
        .from('solicitudes_levantamiento')
        .select(`
            id,
            estado,
            tipo_comprobante,
            requiere_certificado,
            comprobante_nrodocumento,
            comprobante_datos,
            comprobante_telefono,
            observaciones,
            created_at,
            updated_at,
            protesto:protestos(
                secuencia, nombre_persona, numero_documento,
                monto, estado, fecha_protesto, entidad_financiadora
            ),
            usuario:usuarios(nombre_completo, email),
            entidad_financiera:entidades_financieras(id, nombre)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (entidadId) {
        query = query.eq('entidad_financiera_id', entidadId)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)

    return data ?? []
}

/**
 * Genera y descarga un Excel con solicitudes de levantamiento.
 * @param {Array} solicitudes
 * @param {string} nombreEntidad - Nombre de la entidad para el archivo
 */
export function exportarSolicitudesExcel(solicitudes, nombreEntidad = 'Todas') {
    const filas = solicitudes.map(mapearSolicitudAFila)

    const ws = XLSX.utils.json_to_sheet(filas)

    // Ajustar anchos de columna
    ws['!cols'] = COLUMN_WIDTHS

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes')

    const fechaHoy = new Date().toISOString().split('T')[0]
    const nombreArchivo = `Solicitudes_${limpiarNombre(nombreEntidad)}_${fechaHoy}.xlsx`

    XLSX.writeFile(wb, nombreArchivo)
}

/** Mapea una solicitud a una fila plana para Excel */
function mapearSolicitudAFila(solicitud) {
    return {
        'Secuencia': solicitud.protesto?.secuencia ?? '',
        'Persona': solicitud.protesto?.nombre_persona ?? '',
        'N° Documento': solicitud.protesto?.numero_documento ?? '',
        'Monto': solicitud.protesto?.monto ?? '',
        'Fecha Protesto': solicitud.protesto?.fecha_protesto ?? '',
        'Girador': solicitud.protesto?.entidad_financiadora ?? '',
        'Estado Protesto': solicitud.protesto?.estado ?? '',
        'Analista': solicitud.usuario?.nombre_completo ?? '',
        'Entidad Financiera': solicitud.entidad_financiera?.nombre ?? '',
        'Estado Solicitud': SOLICITUD_ESTADO_LABELS[solicitud.estado] ?? solicitud.estado,
        'Tipo Comprobante': solicitud.tipo_comprobante ?? '',
        'Req. Certificado': solicitud.requiere_certificado ? 'Sí' : 'No',
        'N° Doc. Solicitante': solicitud.comprobante_nrodocumento ?? '',
        'Datos Solicitante': solicitud.comprobante_datos ?? '',
        'Teléfono': solicitud.comprobante_telefono ?? '',
        'Observaciones': solicitud.observaciones ?? '',
        'Fecha Solicitud': formatearFechaExcel(solicitud.created_at),
        'Última Actualización': formatearFechaExcel(solicitud.updated_at),
    }
}

/** Formatea fecha para Excel */
function formatearFechaExcel(fecha) {
    if (!fecha) return ''
    return new Date(fecha).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/** Limpia nombre para usar como nombre de archivo */
function limpiarNombre(nombre) {
    return nombre.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '_')
}

/** Anchos de columna para el archivo Excel */
const COLUMN_WIDTHS = [
    { wch: 12 }, { wch: 25 }, { wch: 12 }, { wch: 10 },
    { wch: 12 }, { wch: 20 }, { wch: 14 }, { wch: 25 },
    { wch: 22 }, { wch: 14 }, { wch: 12 }, { wch: 10 },
    { wch: 16 }, { wch: 30 }, { wch: 12 }, { wch: 30 },
    { wch: 18 }, { wch: 18 },
]
