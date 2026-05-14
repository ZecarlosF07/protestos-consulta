export const FORMATO_CONSTANCIA_ANOTACION = 'CONST-ANOTACION'

export const CONSTANCIA_INITIAL_VALUES = {
    denominacion_titulo: '',
    lugar_fecha_emision_titulo: '',
    lugar_pago: '',
    clase_serie_numero_titulo: '',
    vencimiento: '',
    monto_moneda: '',
    deudor_documento: '',
    deudor_nombre_completo: '',
    deudor_domicilio: '',
    acreedor_titular_beneficiario: '',
    garantes_aval: '',
    endosatario_cesionario: '',
    otros_datos_adicionales: '',
    fecha_anotacion_dia: '',
    fecha_anotacion_mes: '',
    fecha_anotacion_anio: '',
    comprobantes_pago: '',
}

export const CONSTANCIA_REQUIRED_FIELDS = [
    'denominacion_titulo',
    'lugar_fecha_emision_titulo',
    'lugar_pago',
    'clase_serie_numero_titulo',
    'vencimiento',
    'monto_moneda',
    'deudor_documento',
    'deudor_nombre_completo',
    'deudor_domicilio',
    'acreedor_titular_beneficiario',
    'fecha_anotacion_dia',
    'fecha_anotacion_mes',
    'fecha_anotacion_anio',
    'comprobantes_pago',
]

export const CONSTANCIA_FIELD_LABELS = {
    denominacion_titulo: 'Denominación del título',
    lugar_fecha_emision_titulo: 'Lugar y fecha de emisión',
    lugar_pago: 'Lugar de pago',
    clase_serie_numero_titulo: 'Clase, serie y número',
    vencimiento: 'Vencimiento',
    monto_moneda: 'Monto e importe',
    deudor_documento: 'Documento del deudor',
    deudor_nombre_completo: 'Nombre completo o razón social',
    deudor_domicilio: 'Domicilio',
    acreedor_titular_beneficiario: 'Acreedor, titular o beneficiario',
    garantes_aval: 'Garantes o aval',
    endosatario_cesionario: 'Endosatario o cesionario',
    otros_datos_adicionales: 'Otros datos adicionales',
    fecha_anotacion_dia: 'Día',
    fecha_anotacion_mes: 'Mes',
    fecha_anotacion_anio: 'Año',
    comprobantes_pago: 'Comprobantes de pago',
}

export const CONSTANCIA_FORM_SECTIONS = [
    {
        title: 'Título valor',
        fields: [
            'denominacion_titulo',
            'lugar_fecha_emision_titulo',
            'lugar_pago',
            'clase_serie_numero_titulo',
            'vencimiento',
            'monto_moneda',
        ],
    },
    {
        title: 'Deudor',
        fields: ['deudor_documento', 'deudor_nombre_completo', 'deudor_domicilio'],
    },
    {
        title: 'Partes y anotación',
        fields: [
            'acreedor_titular_beneficiario',
            'garantes_aval',
            'endosatario_cesionario',
            'otros_datos_adicionales',
            'comprobantes_pago',
        ],
    },
]

export const CONSTANCIA_DATE_FIELDS = [
    'fecha_anotacion_dia',
    'fecha_anotacion_mes',
    'fecha_anotacion_anio',
]

export const CONSTANCIA_PDF_FIELDS = {
    denominacion_titulo: { x: 208, y: 609, maxWidth: 300, fontSize: 9, minFontSize: 7 },
    lugar_fecha_emision_titulo: { x: 210, y: 592, maxWidth: 285, fontSize: 9, minFontSize: 7 },
    lugar_pago: { x: 155, y: 576, maxWidth: 350, fontSize: 9, minFontSize: 7 },
    clase_serie_numero_titulo: { x: 222, y: 560, maxWidth: 285, fontSize: 9, minFontSize: 7 },
    vencimiento: { x: 150, y: 544, maxWidth: 355, fontSize: 9, minFontSize: 7 },
    monto_moneda: { x: 272, y: 528, maxWidth: 235, fontSize: 9, minFontSize: 7 },
    deudor_documento: { x: 362, y: 512, maxWidth: 145, fontSize: 9, minFontSize: 7 },
    deudor_nombre_completo: { x: 85, y: 494, maxWidth: 420, fontSize: 9, minFontSize: 7 },
    deudor_domicilio: { x: 85, y: 476, maxWidth: 420, fontSize: 9, minFontSize: 7 },
    acreedor_titular_beneficiario: { x: 245, y: 460, maxWidth: 260, fontSize: 9, minFontSize: 7 },
    garantes_aval: { x: 156, y: 445, maxWidth: 350, fontSize: 9, minFontSize: 7 },
    endosatario_cesionario: { x: 194, y: 428, maxWidth: 310, fontSize: 9, minFontSize: 7 },
    otros_datos_adicionales: { x: 214, y: 386, maxWidth: 292, fontSize: 8, minFontSize: 6 },
    fecha_anotacion_dia: { x: 108, y: 277, maxWidth: 35, fontSize: 9, minFontSize: 8 },
    fecha_anotacion_mes: { x: 176, y: 277, maxWidth: 56, fontSize: 9, minFontSize: 8 },
    fecha_anotacion_anio: { x: 245, y: 277, maxWidth: 40, fontSize: 9, minFontSize: 8 },
    comprobantes_pago: { x: 397, y: 277, maxWidth: 110, fontSize: 8, minFontSize: 6 },
}
