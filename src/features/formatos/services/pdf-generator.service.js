import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import {
    CONSTANCIA_PDF_FIELDS,
    FORMATO_CONSTANCIA_ANOTACION,
} from '../types/constancia-anotacion.types'

/** Posición del correlativo (esquina superior derecha) */
const CORRELATIVO_CONFIG = {
    offsetRight: 80,
    offsetTop: 45,
    fontSize: 11,
    color: rgb(0.1, 0.1, 0.1),
}

/** Ruta base de las plantillas en /public */
const TEMPLATES_BASE_PATH = '/templates'

/**
 * Genera un PDF con el correlativo insertado en la esquina superior derecha.
 * Si existe una plantilla en /public/templates/{codigo}.pdf, la usa como base.
 * Si no existe, genera un documento base con el nombre del formato.
 * @param {string} formatoNombre - Nombre legible del formato
 * @param {string} formatoCodigo - Código del formato (nombre del archivo plantilla)
 * @param {number} correlativo - Número correlativo a insertar
 * @param {Object|null} datosDocumento - Datos dinámicos para plantillas con campos
 * @returns {Promise<Uint8Array>} Bytes del PDF generado
 */
export async function generarPdfConCorrelativo(
    formatoNombre,
    formatoCodigo,
    correlativo,
    datosDocumento = null
) {
    const plantillaBytes = await cargarPlantilla(formatoCodigo)

    if (plantillaBytes) {
        return insertarDatosEnPlantilla(plantillaBytes, formatoCodigo, correlativo, datosDocumento)
    }

    return generarPdfBase(formatoNombre, formatoCodigo, correlativo)
}

/** Intenta cargar la plantilla PDF desde /public/templates/ */
async function cargarPlantilla(codigo) {
    try {
        const url = `${TEMPLATES_BASE_PATH}/${codigo}.pdf`
        const response = await fetch(url)

        if (!response.ok) return null

        return new Uint8Array(await response.arrayBuffer())
    } catch {
        return null
    }
}

/** Inserta el correlativo y campos dinámicos en una plantilla PDF existente. */
async function insertarDatosEnPlantilla(plantillaBytes, formatoCodigo, correlativo, datosDocumento) {
    const doc = await PDFDocument.load(plantillaBytes)
    const pages = doc.getPages()

    if (pages.length === 0) throw new Error('La plantilla no tiene páginas')

    const firstPage = pages[0]
    const { width } = firstPage.getSize()
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica)

    dibujarCorrelativo(firstPage, fontBold, correlativo, width, firstPage.getSize().height)

    if (formatoCodigo === FORMATO_CONSTANCIA_ANOTACION && datosDocumento) {
        dibujarCamposConstancia(firstPage, fontBold, fontRegular, datosDocumento)
    }

    return doc.save()
}

/** Dibuja los campos propios de la constancia de anotación. */
function dibujarCamposConstancia(page, fontBold, fontRegular, datosDocumento) {
    Object.entries(CONSTANCIA_PDF_FIELDS).forEach(([field, config]) => {
        const value = datosDocumento[field]?.trim()
        if (!value) return

        dibujarTextoAjustado(page, value.toUpperCase(), {
            ...config,
            font: usarNegritaConstancia(field) ? fontBold : fontRegular,
            color: rgb(0.05, 0.05, 0.05),
        })
    })
}

/** Dibuja una línea reduciendo tamaño si el texto excede el ancho permitido. */
function dibujarTextoAjustado(page, texto, config) {
    let sanitizedText = texto.replace(/\s+/g, ' ')
    const minFontSize = config.minFontSize ?? config.fontSize
    let size = config.fontSize

    while (size > minFontSize && config.font.widthOfTextAtSize(sanitizedText, size) > config.maxWidth) {
        size -= 0.5
    }

    sanitizedText = truncarTexto(sanitizedText, config.font, size, config.maxWidth)

    page.drawText(sanitizedText, {
        x: config.x,
        y: config.y,
        size,
        font: config.font,
        color: config.color,
    })
}

function truncarTexto(texto, font, size, maxWidth) {
    if (font.widthOfTextAtSize(texto, size) <= maxWidth) return texto

    const suffix = '...'
    let output = texto
    while (output.length > 0 && font.widthOfTextAtSize(`${output}${suffix}`, size) > maxWidth) {
        output = output.slice(0, -1).trimEnd()
    }

    return `${output}${suffix}`
}

function usarNegritaConstancia() {
    return true
}

/** Genera un PDF base cuando no existe plantilla (fallback) */
async function generarPdfBase(formatoNombre, formatoCodigo, correlativo) {
    const A4_WIDTH = 595.28
    const A4_HEIGHT = 841.89

    const doc = await PDFDocument.create()
    const page = doc.addPage([A4_WIDTH, A4_HEIGHT])
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica)

    dibujarEncabezado(page, fontBold, fontRegular, A4_WIDTH, A4_HEIGHT)
    dibujarTitulo(page, fontBold, formatoNombre, A4_WIDTH, A4_HEIGHT)
    dibujarCorrelativo(page, fontBold, correlativo, A4_WIDTH, A4_HEIGHT)
    dibujarCodigo(page, fontRegular, formatoCodigo, A4_WIDTH, A4_HEIGHT)
    dibujarLineaSeparadora(page, A4_WIDTH, A4_HEIGHT)
    dibujarPiePagina(page, fontRegular, A4_WIDTH)

    return doc.save()
}

/** Dibuja el encabezado institucional */
function dibujarEncabezado(page, fontBold, fontRegular, w, h) {
    const titulo = 'CÁMARA DE COMERCIO, INDUSTRIA Y TURISMO DE ICA'
    const subtitulo = 'Sistema de Consulta y Levantamiento de Protestos'

    const tWidth = fontBold.widthOfTextAtSize(titulo, 12)
    page.drawText(titulo, {
        x: (w - tWidth) / 2, y: h - 60,
        size: 12, font: fontBold, color: rgb(0.15, 0.15, 0.15),
    })

    const sWidth = fontRegular.widthOfTextAtSize(subtitulo, 9)
    page.drawText(subtitulo, {
        x: (w - sWidth) / 2, y: h - 78,
        size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4),
    })
}

/** Dibuja el título del formato centrado */
function dibujarTitulo(page, fontBold, nombre, w, h) {
    const tWidth = fontBold.widthOfTextAtSize(nombre.toUpperCase(), 16)
    page.drawText(nombre.toUpperCase(), {
        x: (w - tWidth) / 2, y: h - 130,
        size: 16, font: fontBold, color: rgb(0.1, 0.1, 0.1),
    })
}

/** Dibuja el número correlativo en la esquina superior derecha */
function dibujarCorrelativo(page, fontBold, correlativo, w, h) {
    const texto = `N° ${String(correlativo).padStart(6, '0')}`
    page.drawText(texto, {
        x: w - CORRELATIVO_CONFIG.offsetRight,
        y: h - CORRELATIVO_CONFIG.offsetTop,
        size: CORRELATIVO_CONFIG.fontSize,
        font: fontBold,
        color: CORRELATIVO_CONFIG.color,
    })
}

/** Dibuja el código del formato debajo del correlativo */
function dibujarCodigo(page, fontRegular, codigo, w, h) {
    page.drawText(codigo, {
        x: w - CORRELATIVO_CONFIG.offsetRight, y: h - 59,
        size: 7, font: fontRegular, color: rgb(0.5, 0.5, 0.5),
    })
}

/** Dibuja línea separadora debajo del encabezado */
function dibujarLineaSeparadora(page, w, h) {
    page.drawLine({
        start: { x: 50, y: h - 100 },
        end: { x: w - 50, y: h - 100 },
        thickness: 0.5, color: rgb(0.7, 0.7, 0.7),
    })
}

/** Dibuja pie de página */
function dibujarPiePagina(page, fontRegular, w) {
    const fecha = new Date().toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric',
    })
    const texto = `Documento generado el ${fecha}`
    const tWidth = fontRegular.widthOfTextAtSize(texto, 8)

    page.drawText(texto, {
        x: (w - tWidth) / 2, y: 40,
        size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5),
    })
}
