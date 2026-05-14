-- ============================================================
-- HITO 17: Metadata para emisión dinámica de formatos PDF
-- ============================================================

ALTER TABLE documentos_emitidos
    ADD COLUMN IF NOT EXISTS metadata jsonb;

COMMENT ON COLUMN documentos_emitidos.metadata IS
    'Datos estructurados usados para generar formatos PDF dinámicos, como CONST-ANOTACION';
