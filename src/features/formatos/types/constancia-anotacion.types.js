export const FORMATO_CONSTANCIA_ANOTACION = 'CONST-ANOTACION'

export const CONSTANCIA_INITIAL_VALUES = {
    denominacion_titulo: '',
    lugar_fecha_emision_titulo: '',
    lugar_pago: 'ICA',
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
    denominacion_titulo: { x: 212, y: 607, maxWidth: 315, fontSize: 8.2, minFontSize: 7 },
    lugar_fecha_emision_titulo: { x: 268, y: 592, maxWidth: 254, fontSize: 8.2, minFontSize: 7 },
    lugar_pago: { x: 164, y: 576, maxWidth: 370, fontSize: 8.2, minFontSize: 7 },
    clase_serie_numero_titulo: { x: 222, y: 563, maxWidth: 300, fontSize: 8.2, minFontSize: 7 },
    vencimiento: { x: 155, y: 547, maxWidth: 375, fontSize: 8.2, minFontSize: 7 },
    //hecho
    monto_moneda: { x: 280, y: 532, maxWidth: 243, fontSize: 8.2, minFontSize: 7 },
    deudor_documento: { x: 365, y: 517, maxWidth: 158, fontSize: 8.2, minFontSize: 7 },
    deudor_nombre_completo: { x: 85, y: 505, maxWidth: 440, fontSize: 7.4, minFontSize: 6.5 },
    deudor_domicilio: { x: 85, y: 489, maxWidth: 440, fontSize: 7.4, minFontSize: 6.5 },
    acreedor_titular_beneficiario: { x: 252, y: 474, maxWidth: 272, fontSize: 8, minFontSize: 7 },
    garantes_aval: { x: 170, y: 458, maxWidth: 355, fontSize: 8, minFontSize: 7 },
    endosatario_cesionario: { x: 232, y: 444, maxWidth: 292, fontSize: 8, minFontSize: 7 },
    //hecho
    otros_datos_adicionales: { x: 224, y: 388, maxWidth: 310, fontSize: 7.6, minFontSize: 6 },
    fecha_anotacion_dia: { x: 108, y: 276, maxWidth: 35, fontSize: 8, minFontSize: 7 },
    fecha_anotacion_mes: { x: 150, y: 276, maxWidth: 95, fontSize: 8, minFontSize: 7 },
    fecha_anotacion_anio: { x: 225, y: 276, maxWidth: 55, fontSize: 8, minFontSize: 7 },
    comprobantes_pago: { x: 420, y: 276, maxWidth: 110, fontSize: 7.6, minFontSize: 6 },
}
