-- ============================================================
-- HITO 11: Ampliación del flujo de solicitud de levantamiento
-- Nuevos campos, opciones condicionales y mejoras documentales
-- ============================================================

-- 1. Nuevos campos en solicitudes_levantamiento
ALTER TABLE solicitudes_levantamiento
  ADD COLUMN IF NOT EXISTS tipo_comprobante varchar(10)
    CHECK (tipo_comprobante IN ('boleta', 'factura')),
  ADD COLUMN IF NOT EXISTS requiere_certificado boolean NOT NULL DEFAULT false;

-- 2. Ampliar tipos permitidos en tabla archivos
-- Primero eliminar constraint existente y recrear con nuevos valores
ALTER TABLE archivos
  DROP CONSTRAINT IF EXISTS archivos_tipo_check;

ALTER TABLE archivos
  ADD CONSTRAINT archivos_tipo_check
    CHECK (tipo IN (
      'comprobante_pago',
      'formato_firmado',
      'carta_no_adeudo',
      'comprobante_certificado',
      'certificado_emitido'
    ));

-- 3. Comentarios actualizados
COMMENT ON COLUMN solicitudes_levantamiento.tipo_comprobante
  IS 'Tipo de comprobante: boleta o factura';

COMMENT ON COLUMN solicitudes_levantamiento.requiere_certificado
  IS 'Indica si la solicitud requiere Certificado de Título Regularizado (costo adicional S/ 30)';
