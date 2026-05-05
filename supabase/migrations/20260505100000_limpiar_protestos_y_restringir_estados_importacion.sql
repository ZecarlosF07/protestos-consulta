-- ============================================================
-- Limpiar datos operativos de protestos y restringir estados
-- ============================================================
-- Alcance de limpieza:
-- - archivos ligados a solicitudes de levantamiento
-- - solicitudes de levantamiento
-- - protestos
-- - importaciones de protestos
-- - consultas
-- - auditoria ligada a protestos, importaciones, solicitudes, archivos y consultas
--
-- No toca:
-- - usuarios
-- - entidades_financieras
-- - tarifas_levantamiento
-- - formatos_pdf
-- - documentos_emitidos y correlativos

BEGIN;

DELETE FROM archivos
WHERE solicitud_id IN (
  SELECT id
  FROM solicitudes_levantamiento
);

DELETE FROM solicitudes_levantamiento;

DELETE FROM protestos;

DELETE FROM importaciones_protestos;

DELETE FROM consultas;

DELETE FROM auditoria
WHERE entidad_afectada IN (
    'protesto',
    'protestos',
    'importaciones_protestos',
    'solicitud_levantamiento',
    'solicitudes_levantamiento',
    'archivo',
    'archivos',
    'consulta',
    'consultas'
  )
  OR accion IN (
    'CONSULTA_PROTESTO',
    'SOLICITAR_LEVANTAMIENTO',
    'CAMBIAR_ESTADO_SOLICITUD',
    'SUBIR_ARCHIVO',
    'SUBIR_CERTIFICADO_LEVANTAMIENTO',
    'SUBIR_COMPROBANTE_PAGO',
    'IMPORTAR_PROTESTOS_EXCEL',
    'CAMBIAR_ESTADO_PROTESTO'
  );

ALTER TABLE importaciones_protestos
  DROP CONSTRAINT IF EXISTS importaciones_protestos_estado_check;

ALTER TABLE importaciones_protestos
  ADD CONSTRAINT importaciones_protestos_estado_check
  CHECK (estado IN ('procesando', 'completada', 'fallida'));

COMMENT ON COLUMN importaciones_protestos.estado IS
  'Estado de la importacion: procesando, completada o fallida';

COMMIT;
