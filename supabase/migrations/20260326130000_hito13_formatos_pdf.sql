-- ============================================================
-- HITO 13: Módulo administrativo de formatos PDF con correlativos
-- Tablas: formatos_pdf y documentos_emitidos
-- ============================================================

-- 1. FORMATOS PDF (plantillas fijas definidas desde desarrollo)
CREATE TABLE IF NOT EXISTS formatos_pdf (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre              varchar(100) NOT NULL,
    codigo              varchar(20)  NOT NULL UNIQUE,
    descripcion         text,
    ultimo_correlativo  integer      NOT NULL DEFAULT 0,
    activo              boolean      NOT NULL DEFAULT true,
    created_at          timestamptz  NOT NULL DEFAULT now(),
    updated_at          timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE formatos_pdf IS 'Plantillas PDF fijas con correlativo independiente por formato';

-- Trigger updated_at
CREATE TRIGGER trg_formatos_pdf_updated_at
    BEFORE UPDATE ON formatos_pdf
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. DOCUMENTOS EMITIDOS (historial de correlativos)
CREATE TABLE IF NOT EXISTS documentos_emitidos (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    formato_id          uuid         NOT NULL REFERENCES formatos_pdf(id),
    correlativo         integer      NOT NULL,
    -- Datos del solicitante (respaldo interno, no se imprimen en el PDF)
    tipo_solicitante    varchar(10)  NOT NULL
                          CHECK (tipo_solicitante IN ('persona', 'empresa')),
    nro_documento       varchar(20)  NOT NULL,
    nombre_solicitante  varchar(255) NOT NULL,
    -- PDF generado
    pdf_ruta            varchar(500),
    -- Estado
    estado              varchar(20)  NOT NULL DEFAULT 'activo'
                          CHECK (estado IN ('activo', 'anulado')),
    -- Emisión
    emitido_por         uuid         NOT NULL REFERENCES usuarios(id),
    -- Anulación
    anulado_por         uuid         REFERENCES usuarios(id),
    fecha_anulacion     timestamptz,
    motivo_anulacion    text,
    -- Auditoría
    created_at          timestamptz  NOT NULL DEFAULT now(),
    UNIQUE (formato_id, correlativo)
);

COMMENT ON TABLE documentos_emitidos IS 'Historial de documentos PDF generados con correlativos';

-- Índices
CREATE INDEX IF NOT EXISTS idx_documentos_formato_id
    ON documentos_emitidos (formato_id);

CREATE INDEX IF NOT EXISTS idx_documentos_estado
    ON documentos_emitidos (estado);

CREATE INDEX IF NOT EXISTS idx_documentos_emitido_por
    ON documentos_emitidos (emitido_por);

-- 3. SEED: 3 formatos fijos
INSERT INTO formatos_pdf (nombre, codigo, descripcion)
VALUES
    ('Certificado de Búsqueda',
     'CERT-BUSQUEDA',
     'Certificado oficial de búsqueda de protestos emitido por la Cámara de Comercio de Ica'),
    ('Certificado de No Protesto',
     'CERT-NO-PROTESTO',
     'Certificado que acredita la inexistencia de protestos registrados a nombre del solicitante'),
    ('Constancia de Levantamiento',
     'CONST-LEVANTAMIENTO',
     'Constancia oficial que acredita el levantamiento de un protesto registrado')
ON CONFLICT (codigo) DO NOTHING;

-- 4. RLS
ALTER TABLE formatos_pdf ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_emitidos ENABLE ROW LEVEL SECURITY;

-- Políticas: solo admin puede leer y gestionar
CREATE POLICY formatos_pdf_select ON formatos_pdf
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY documentos_emitidos_select ON documentos_emitidos
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY documentos_emitidos_insert ON documentos_emitidos
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY documentos_emitidos_update ON documentos_emitidos
    FOR UPDATE TO authenticated
    USING (true);

CREATE POLICY formatos_pdf_update ON formatos_pdf
    FOR UPDATE TO authenticated
    USING (true);
