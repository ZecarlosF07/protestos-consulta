-- ============================================================
-- HITO 11 FIX: Permitir que el Admin inserte archivos (certificado emitido)
-- La política anterior solo permitía al dueño de la solicitud (analista).
-- ============================================================

-- Admin puede insertar archivos en cualquier solicitud
CREATE POLICY archivos_insert_admin
  ON archivos FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());
