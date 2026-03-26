-- ============================================================
-- HITO 12: Ampliación del flujo de levantamiento y control documental
-- Campos unificados del comprobante (boleta/factura)
-- y nuevo tipo de archivo para boleta/factura adjunta
-- ============================================================

-- 1. Campos unificados del comprobante
--    comprobante_nrodocumento: DNI (boleta) o RUC (factura)
--    comprobante_datos: nombres + apellidos (boleta) o razón social (factura)
--    comprobante_telefono: teléfono del solicitante (ambos casos)
ALTER TABLE solicitudes_levantamiento
  ADD COLUMN IF NOT EXISTS comprobante_nrodocumento varchar(20),
  ADD COLUMN IF NOT EXISTS comprobante_datos varchar(255),
  ADD COLUMN IF NOT EXISTS comprobante_telefono varchar(20);

-- 2. Ampliar tipos de archivo para incluir boleta/factura adjunta
ALTER TABLE archivos
  DROP CONSTRAINT IF EXISTS archivos_tipo_check;

ALTER TABLE archivos
  ADD CONSTRAINT archivos_tipo_check
    CHECK (tipo IN (
      'comprobante_pago',
      'formato_firmado',
      'carta_no_adeudo',
      'comprobante_certificado',
      'certificado_emitido',
      'boleta_factura_adjunto'
    ));

-- 3. Comentarios
COMMENT ON COLUMN solicitudes_levantamiento.comprobante_nrodocumento
  IS 'DNI del solicitante (boleta) o RUC de la empresa (factura)';

COMMENT ON COLUMN solicitudes_levantamiento.comprobante_datos
  IS 'Nombres y apellidos (boleta) o razón social (factura)';

COMMENT ON COLUMN solicitudes_levantamiento.comprobante_telefono
  IS 'Teléfono del solicitante (aplica para boleta y factura)';
