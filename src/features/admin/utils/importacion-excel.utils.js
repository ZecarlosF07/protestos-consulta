import * as XLSX from 'xlsx'

import {
    EXCEL_HEADERS_REQUIRED,
    IMPORTACION_FIELD_LIMITS,
} from '../types/importacion.types'

const HEADER_ALIASES = {
    secuencia: ['secuencia'],
    numero_documento: ['numero_documento', 'nro_documento', 'n_documento', 'documento'],
    entidad_financiadora: ['entidad_financiadora', 'girador'],
    entidad_fuente: ['entidad_fuente', 'ef', 'entidad_origen'],
    monto: ['monto', 'importe'],
    fecha_protesto: ['fecha_protesto', 'fecha', 'feccha_protesto'],
    nombre_persona: ['nombre_persona', 'nombre', 'razon_social', 'aceptante'],
    tarifa_levantamiento: ['tarifa_levantamiento', 'tarifa'],
    tipo_valor: ['tipo_valor', 'tv'],
    idsec: ['idsec'],
    tpg: ['tpg'],
}

const IGNORED_COLUMNS = new Set(['idsec', 'tpg'])
const HEADER_MAP = buildHeaderMap()
const VALUE_PREVIEW_LIMIT = 120

function buildHeaderMap() {
    const map = new Map()
    Object.entries(HEADER_ALIASES).forEach(([canonical, aliases]) => {
        aliases.forEach(alias => map.set(alias, canonical))
    })
    return map
}

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_')
}

function isEmptyRow(row) {
    return !Object.values(row.cells).some(cell => String(cell.valor ?? '').trim() !== '')
}

function parseFecha(value) {
    if (!value && value !== 0) return null
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        // Excel puede entregar Date en UTC; usamos getters UTC para evitar desfase por timezone.
        const year = value.getUTCFullYear()
        const month = String(value.getUTCMonth() + 1).padStart(2, '0')
        const day = String(value.getUTCDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    if (typeof value === 'number') {
        const parsed = XLSX.SSF.parse_date_code(value)
        if (!parsed) return null
        return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`
    }

    const clean = String(value).trim()
    const iso = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (iso) return clean

    const latam = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
    if (latam) {
        const [, d, m, y] = latam
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    }

    return null
}

function parseMonto(value) {
    const clean = String(value ?? '').replace(/[^\d.,-]/g, '').replace(',', '.')
    const parsed = Number(clean)
    return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : null
}

function resolveHeader(header) {
    return HEADER_MAP.get(normalizeText(header)) ?? null
}

function mapRawRow(raw) {
    const cells = {}
    Object.entries(raw).forEach(([header, value]) => {
        const canonical = resolveHeader(header)
        if (!canonical || IGNORED_COLUMNS.has(canonical)) return
        cells[canonical] = { columna: header, valor: value }
    })
    return { cells }
}

function getCell(row, campo) {
    return row.cells[campo] ?? { columna: campo, valor: '' }
}

function getText(row, campo) {
    return String(getCell(row, campo).valor ?? '').trim()
}

function previewValue(value) {
    const text = String(value ?? '').trim()
    if (text.length <= VALUE_PREVIEW_LIMIT) return text
    return `${text.slice(0, VALUE_PREVIEW_LIMIT)}...`
}

function crearError({ fila, row, campo, mensaje, valor = null, secuencia = null }) {
    const cell = campo ? getCell(row, campo) : { columna: null }
    return {
        fila,
        columna: cell.columna ?? null,
        campo: campo ?? null,
        valor: previewValue(valor ?? cell.valor),
        secuencia,
        mensaje,
    }
}

function validarRequeridos(row, fila, secuencia) {
    return EXCEL_HEADERS_REQUIRED
        .filter(campo => !getText(row, campo))
        .map(campo => crearError({
            fila,
            row,
            campo,
            secuencia,
            mensaje: 'Campo obligatorio vacío',
        }))
}

function validarLongitudes(row, fila, valores, secuencia) {
    return Object.entries(IMPORTACION_FIELD_LIMITS).flatMap(([campo, limite]) => {
        const valor = valores[campo]
        if (!valor || String(valor).length <= limite) return []
        return crearError({
            fila,
            row,
            campo,
            valor,
            secuencia,
            mensaje: `Supera el máximo permitido de ${limite} caracteres`,
        })
    })
}

function obtenerCamposPresentes(rawRows) {
    const fields = new Set()
    Object.keys(rawRows[0] ?? {}).forEach((header) => {
        const canonical = resolveHeader(header)
        if (canonical && !IGNORED_COLUMNS.has(canonical)) fields.add(canonical)
    })
    return fields
}

function crearErroresEncabezado(missingHeaders) {
    return missingHeaders.map(campo => ({
        fila: null,
        columna: null,
        campo,
        valor: '',
        secuencia: null,
        mensaje: `Encabezado obligatorio no encontrado: ${campo}`,
    }))
}

async function obtenerArrayBuffer(filePayload) {
    if (filePayload?.arrayBuffer instanceof ArrayBuffer) {
        return filePayload.arrayBuffer
    }
    if (filePayload?.arrayBuffer && typeof filePayload.arrayBuffer === 'function') {
        return await filePayload.arrayBuffer()
    }
    if (filePayload?.file?.arrayBuffer && typeof filePayload.file.arrayBuffer === 'function') {
        return await filePayload.file.arrayBuffer()
    }
    throw new Error('Archivo invalido para importacion')
}

export async function parsearExcelProtestos(filePayload) {
    let buffer

    try {
        buffer = await obtenerArrayBuffer(filePayload)
    } catch (err) {
        if (err?.name === 'NotReadableError') {
            throw new Error('No se puede leer el archivo. Cierra Excel o copia el archivo a una carpeta local e intenta de nuevo.')
        }
        throw err
    }

    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
    const firstSheet = workbook.SheetNames[0]
    if (!firstSheet) throw new Error('El archivo no contiene hojas')

    const sheet = workbook.Sheets[firstSheet]
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true })
    if (!rawRows.length) throw new Error('El archivo no contiene filas de datos')

    const mappedRows = rawRows.map(mapRawRow)
    const camposPresentes = obtenerCamposPresentes(rawRows)
    const missingHeaders = EXCEL_HEADERS_REQUIRED.filter(h => !camposPresentes.has(h))
    if (missingHeaders.length > 0) {
        return {
            validRows: [],
            errors: crearErroresEncabezado(missingHeaders),
            missingHeaders,
            totalRows: 0,
        }
    }

    const seenSecuencias = new Set()
    const errors = []
    const validRows = []
    let processed = 0

    mappedRows.forEach((row, index) => {
        if (isEmptyRow(row)) return

        processed += 1
        const fila = index + 2
        const secuencia = getText(row, 'secuencia')
        const numeroDocumento = getText(row, 'numero_documento').replace(/\D/g, '')
        const tipoDocumento = numeroDocumento.length === 8 ? 'DNI' : numeroDocumento.length === 11 ? 'RUC' : null
        const nombrePersona = getText(row, 'nombre_persona')
        const entidadFinanciadora = getText(row, 'entidad_financiadora')
        const entidadFuente = getText(row, 'entidad_fuente')
        const tipoValor = getText(row, 'tipo_valor') || null
        const monto = parseMonto(getCell(row, 'monto').valor)
        const fecha = parseFecha(getCell(row, 'fecha_protesto').valor)
        const tarifaRaw = getText(row, 'tarifa_levantamiento')
        const tarifa = tarifaRaw ? parseMonto(getCell(row, 'tarifa_levantamiento').valor) : null

        const valores = {
            secuencia,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            nombre_persona: nombrePersona,
            entidad_financiadora: entidadFinanciadora,
            entidad_fuente: entidadFuente,
            tipo_valor: tipoValor,
        }
        const rowErrors = [
            ...validarRequeridos(row, fila, secuencia || null),
            ...validarLongitudes(row, fila, valores, secuencia || null),
        ]

        if (numeroDocumento && !tipoDocumento) {
            rowErrors.push(crearError({
                fila,
                row,
                campo: 'numero_documento',
                valor: getText(row, 'numero_documento'),
                secuencia: secuencia || null,
                mensaje: 'Debe tener 8 dígitos para DNI o 11 dígitos para RUC',
            }))
        }

        if (getText(row, 'monto') && (!monto || monto <= 0)) {
            rowErrors.push(crearError({
                fila,
                row,
                campo: 'monto',
                secuencia: secuencia || null,
                mensaje: 'Monto inválido o menor/igual a cero',
            }))
        }

        if (tarifaRaw && (tarifa === null || tarifa < 0)) {
            rowErrors.push(crearError({
                fila,
                row,
                campo: 'tarifa_levantamiento',
                secuencia: secuencia || null,
                mensaje: 'Tarifa inválida',
            }))
        }

        if (getText(row, 'fecha_protesto') && !fecha) {
            rowErrors.push(crearError({
                fila,
                row,
                campo: 'fecha_protesto',
                secuencia: secuencia || null,
                mensaje: 'Fecha inválida',
            }))
        }

        if (seenSecuencias.has(secuencia)) {
            rowErrors.push(crearError({
                fila,
                row,
                campo: 'secuencia',
                secuencia,
                mensaje: 'Secuencia duplicada dentro del archivo',
            }))
        }

        if (rowErrors.length > 0) {
            errors.push(...rowErrors)
            if (secuencia) seenSecuencias.add(secuencia)
            return
        }

        seenSecuencias.add(secuencia)

        validRows.push({
            fila,
            secuencia,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            nombre_persona: nombrePersona,
            entidad_financiadora: entidadFinanciadora,
            entidad_fuente: entidadFuente,
            monto,
            fecha_protesto: fecha,
            tarifa_levantamiento: tarifa,
            tipo_valor: tipoValor,
        })
    })

    return { validRows, errors, missingHeaders: [], totalRows: processed }
}
