-- ============================================================
-- HITO 6: Storage bucket para documentos de levantamiento
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
ON CONFLICT (id) DO NOTHING;

-- =====================
-- Políticas de Storage
-- =====================

-- Analistas pueden subir archivos en sus propias solicitudes
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
