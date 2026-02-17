import * as XLSX from 'xlsx'

import { EXCEL_HEADERS_REQUIRED } from '../types/importacion.types'

const HEADER_ALIASES = {
    secuencia: ['secuencia'],
    numero_documento: ['numero_documento', 'nro_documento', 'n_documento', 'documento'],
    entidad_financiadora: ['entidad_financiadora', 'girador'],
    entidad_fuente: ['entidad_fuente', 'ef', 'entidad_origen'],
    monto: ['monto', 'importe'],
    fecha_protesto: ['fecha_protesto', 'fecha'],
    nombre_persona: ['nombre_persona', 'nombre', 'razon_social', 'aceptante'],
    tarifa_levantamiento: ['tarifa_levantamiento', 'tarifa'],
    idsec: ['idsec'],
    tpg: ['tpg'],
}

const IGNORED_COLUMNS = new Set(['idsec', 'tpg'])
const HEADER_MAP = buildHeaderMap()

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
    return !Object.values(row).some(value => String(value ?? '').trim() !== '')
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

    const mappedRows = rawRows.map((raw) => {
        const mapped = {}
        Object.entries(raw).forEach(([header, value]) => {
            const canonical = resolveHeader(header)
            if (!canonical || IGNORED_COLUMNS.has(canonical)) return
            mapped[canonical] = value
        })
        return mapped
    })

    const firstHeaderRow = mappedRows.find(row => !isEmptyRow(row)) ?? {}
    const missingHeaders = EXCEL_HEADERS_REQUIRED.filter(h => !(h in firstHeaderRow))
    if (missingHeaders.length > 0) {
        return { validRows: [], errors: [], missingHeaders }
    }

    const seenSecuencias = new Set()
    const errors = []
    const validRows = []
    let processed = 0

    mappedRows.forEach((row, index) => {
        if (isEmptyRow(row)) return

        processed += 1
        const fila = index + 2
        const secuencia = String(row.secuencia ?? '').trim()
        const numeroDocumento = String(row.numero_documento ?? '').replace(/\D/g, '')
        const tipoDocumento = numeroDocumento.length === 8 ? 'DNI' : numeroDocumento.length === 11 ? 'RUC' : null
        const nombrePersona = String(row.nombre_persona ?? '').trim()
        const entidadFinanciadora = String(row.entidad_financiadora ?? '').trim()
        const entidadFuente = String(row.entidad_fuente ?? '').trim()
        const monto = parseMonto(row.monto)
        const fecha = parseFecha(row.fecha_protesto)

        if (!secuencia || !numeroDocumento || !tipoDocumento || !nombrePersona || !entidadFinanciadora || !entidadFuente || !monto || !fecha) {
            errors.push({ fila, secuencia: secuencia || null, mensaje: 'Fila invalida: faltan datos obligatorios o formato incorrecto' })
            return
        }

        if (seenSecuencias.has(secuencia)) {
            errors.push({ fila, secuencia, mensaje: 'Secuencia duplicada dentro del archivo' })
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
            tarifa_levantamiento: row.tarifa_levantamiento ? parseMonto(row.tarifa_levantamiento) : null,
        })
    })

    return { validRows, errors, missingHeaders: [], totalRows: processed }
}
