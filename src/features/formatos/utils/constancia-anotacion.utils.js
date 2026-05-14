import {
    CONSTANCIA_FIELD_LABELS,
    CONSTANCIA_INITIAL_VALUES,
    CONSTANCIA_REQUIRED_FIELDS,
} from '../types/constancia-anotacion.types'

const FIELD_MAX_LENGTH = {
    deudor_documento: 20,
    fecha_anotacion_dia: 2,
    fecha_anotacion_mes: 20,
    fecha_anotacion_anio: 4,
}

/** Limpia los valores capturados para emitir la constancia de anotación. */
export function normalizarConstanciaAnotacion(values) {
    return Object.keys(CONSTANCIA_INITIAL_VALUES).reduce((acc, key) => {
        acc[key] = values[key]?.trim() ?? ''
        return acc
    }, {})
}

/** Valida los campos obligatorios y formatos mínimos de la constancia. */
export function validarConstanciaAnotacion(values) {
    const data = normalizarConstanciaAnotacion(values)
    const errors = {}

    CONSTANCIA_REQUIRED_FIELDS.forEach((field) => {
        if (!data[field]) errors[field] = `${CONSTANCIA_FIELD_LABELS[field]} es obligatorio`
    })

    Object.entries(FIELD_MAX_LENGTH).forEach(([field, maxLength]) => {
        if (data[field]?.length > maxLength) {
            errors[field] = `${CONSTANCIA_FIELD_LABELS[field]} no debe superar ${maxLength} caracteres`
        }
    })

    const digits = extraerDigitos(data.deudor_documento)
    if (data.deudor_documento && ![8, 11].includes(digits.length)) {
        errors.deudor_documento = 'Use un DNI de 8 dígitos o RUC de 11 dígitos'
    }

    const day = Number(data.fecha_anotacion_dia)
    if (data.fecha_anotacion_dia && (!Number.isInteger(day) || day < 1 || day > 31)) {
        errors.fecha_anotacion_dia = 'Día inválido'
    }

    if (data.fecha_anotacion_anio && !/^\d{4}$/.test(data.fecha_anotacion_anio)) {
        errors.fecha_anotacion_anio = 'Año inválido'
    }

    return errors
}

/** Crea el payload requerido por documentos_emitidos a partir de la constancia. */
export function crearPayloadConstanciaAnotacion(values) {
    const metadata = normalizarConstanciaAnotacion(values)
    const digits = extraerDigitos(metadata.deudor_documento)

    return {
        tipoSolicitante: digits.length === 11 ? 'empresa' : 'persona',
        nroDocumento: metadata.deudor_documento,
        nombreSolicitante: metadata.deudor_nombre_completo,
        metadata,
    }
}

export function tieneErrores(errors) {
    return Object.keys(errors).length > 0
}

function extraerDigitos(value) {
    return value?.replace(/\D/g, '') ?? ''
}
