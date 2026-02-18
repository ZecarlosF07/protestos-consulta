import { supabase } from '../../../services/supabase/client'

/** Campos que se retornan en la consulta de protestos */
const PROTESTO_SELECT_FIELDS = `
    id,
    secuencia,
    tipo_documento,
    numero_documento,
    nombre_persona,
    entidad_financiadora,
    entidad_fuente,
    monto,
    fecha_protesto,
    tarifa_levantamiento,
    estado
`

/**
 * Busca protestos por número de documento usando función RPC.
 * El analista no tiene acceso directo a la tabla protestos;
 * la función SECURITY DEFINER filtra por documento.
 */
export async function buscarProtestos(numeroDocumento, tipoDocumento) {
    const { data, error } = await supabase.rpc('buscar_protestos_por_documento', {
        p_numero_documento: numeroDocumento,
        p_tipo_documento: tipoDocumento,
    })

    if (error) {
        throw new Error(error.message)
    }

    return data ?? []
}

/**
 * Registra una consulta en la tabla de consultas (auditoría de búsquedas).
 * No lanza errores para no bloquear el flujo principal.
 */
export async function registrarConsulta({
    usuarioId,
    entidadFinancieraId,
    tipoDocumento,
    numeroDocumento,
    resultadosEncontrados,
}) {
    try {
        const { error } = await supabase.from('consultas').insert({
            usuario_id: usuarioId,
            entidad_financiera_id: entidadFinancieraId,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            resultados_encontrados: resultadosEncontrados,
        })

        if (error) {
            console.error('Error registrando consulta:', error.message)
        }
    } catch (err) {
        console.error('Error inesperado registrando consulta:', err.message)
    }
}
