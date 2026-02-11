-- ============================================================
-- HITO 10: Storage estabilizado para documentos de levantamiento
-- ============================================================

-- Crear bucket para documentos si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documentos',
    'documentos',
    false,
    5242880, -- 5MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================
-- Políticas de Storage
-- =====================

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS storage_documentos_insert ON storage.objects;
DROP POLICY IF EXISTS storage_documentos_select ON storage.objects;
DROP POLICY IF EXISTS storage_documentos_update ON storage.objects;
DROP POLICY IF EXISTS storage_documentos_delete ON storage.objects;

-- Analistas pueden subir archivos en el bucket documentos
CREATE POLICY storage_documentos_insert
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documentos'
  );

-- Usuarios autenticados pueden ver archivos del bucket documentos
CREATE POLICY storage_documentos_select
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documentos'
  );

-- Usuarios autenticados pueden actualizar archivos del bucket documentos
CREATE POLICY storage_documentos_update
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documentos'
  );

-- Admin puede eliminar archivos
CREATE POLICY storage_documentos_delete
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documentos'
    AND (
      SELECT COALESCE(
        (auth.jwt() -> 'user_metadata' ->> 'rol') = 'admin',
        false
      )
    )
  );
