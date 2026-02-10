/** Longitudes válidas de documentos */
export const DOCUMENT_LENGTHS = {
    DNI: 8,
    RUC: 11,
}

/** Longitud mínima para validar */
export const MIN_DOCUMENT_LENGTH = DOCUMENT_LENGTHS.DNI
/** Longitud máxima para validar */
export const MAX_DOCUMENT_LENGTH = DOCUMENT_LENGTHS.RUC

/**
 * Determina el tipo de documento según la longitud.
 * @param {string} numero
 * @returns {'DNI'|'RUC'|null}
 */
export function detectarTipoDocumento(numero) {
    if (!numero) return null

    const limpio = numero.trim()

    if (limpio.length === DOCUMENT_LENGTHS.DNI) return 'DNI'
    if (limpio.length === DOCUMENT_LENGTHS.RUC) return 'RUC'

    return null
}

/**
 * Valida que el input sea solo dígitos.
 * @param {string} valor
 * @returns {boolean}
 */
export function esSoloDigitos(valor) {
    return /^\d+$/.test(valor)
}

/**
 * Valida un número de documento completo.
 * @param {string} numero
 * @returns {{ valido: boolean, error: string|null, tipo: 'DNI'|'RUC'|null }}
 */
export function validarDocumento(numero) {
    if (!numero || !numero.trim()) {
        return { valido: false, error: 'Ingrese un número de documento', tipo: null }
    }

    const limpio = numero.trim()

    if (!esSoloDigitos(limpio)) {
        return { valido: false, error: 'Solo se permiten números', tipo: null }
    }

    if (limpio.length < MIN_DOCUMENT_LENGTH) {
        return {
            valido: false,
            error: `Mínimo ${MIN_DOCUMENT_LENGTH} dígitos (DNI)`,
            tipo: null,
        }
    }

    if (limpio.length > MAX_DOCUMENT_LENGTH) {
        return {
            valido: false,
            error: `Máximo ${MAX_DOCUMENT_LENGTH} dígitos (RUC)`,
            tipo: null,
        }
    }

    const tipo = detectarTipoDocumento(limpio)

    if (!tipo) {
        return {
            valido: false,
            error: 'Ingrese 8 dígitos (DNI) o 11 dígitos (RUC)',
            tipo: null,
        }
    }

    return { valido: true, error: null, tipo }
}
