-- ============================================================
-- HITO 3: Row Level Security (RLS) Policies
-- CORREGIDO: Usa auth.jwt() para evitar recursión infinita
-- ============================================================

-- Función helper para verificar rol admin desde JWT metadata
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'admin',
    false
  );
$$;

-- Función helper para obtener el user id actual
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

-- =====================
-- 1. HABILITAR RLS
-- =====================
ALTER TABLE entidades_financieras ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE importaciones_protestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_levantamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- =====================
-- 2. USUARIOS
-- =====================

-- Un usuario autenticado puede ver su propio perfil
CREATE POLICY usuarios_select_own
  ON usuarios FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admin puede ver todos los usuarios
CREATE POLICY usuarios_select_admin
  ON usuarios FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin puede insertar usuarios
CREATE POLICY usuarios_insert_admin
  ON usuarios FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Permitir insert del propio registro (auto-registro en signup)
CREATE POLICY usuarios_insert_self
  ON usuarios FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Admin puede actualizar usuarios
CREATE POLICY usuarios_update_admin
  ON usuarios FOR UPDATE
  TO authenticated
  USING (is_admin());

-- =====================
-- 3. ENTIDADES FINANCIERAS
-- =====================

-- Cualquier usuario autenticado puede ver entidades activas
CREATE POLICY entidades_select_authenticated
  ON entidades_financieras FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Admin puede gestionar entidades
CREATE POLICY entidades_insert_admin
  ON entidades_financieras FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY entidades_update_admin
  ON entidades_financieras FOR UPDATE
  TO authenticated
  USING (is_admin());

-- =====================
-- 4. PROTESTOS
-- =====================

-- Usuarios autenticados pueden ver protestos no eliminados
CREATE POLICY protestos_select_authenticated
  ON protestos FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Admin puede insertar protestos (importación)
CREATE POLICY protestos_insert_admin
  ON protestos FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin puede actualizar protestos
CREATE POLICY protestos_update_admin
  ON protestos FOR UPDATE
  TO authenticated
  USING (is_admin());

-- =====================
-- 5. IMPORTACIONES DE PROTESTOS
-- =====================

-- Admin puede ver todas las importaciones
CREATE POLICY importaciones_select_admin
  ON importaciones_protestos FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin puede insertar importaciones
CREATE POLICY importaciones_insert_admin
  ON importaciones_protestos FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin puede actualizar importaciones
CREATE POLICY importaciones_update_admin
  ON importaciones_protestos FOR UPDATE
  TO authenticated
  USING (is_admin());

-- =====================
-- 6. CONSULTAS
-- =====================

-- Analista puede ver sus propias consultas
CREATE POLICY consultas_select_own
  ON consultas FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Admin puede ver todas las consultas
CREATE POLICY consultas_select_admin
  ON consultas FOR SELECT
  TO authenticated
  USING (is_admin());

-- Usuarios autenticados pueden insertar consultas
CREATE POLICY consultas_insert_authenticated
  ON consultas FOR INSERT
  TO authenticated
  WITH CHECK (usuario_id = auth.uid());

-- =====================
-- 7. SOLICITUDES DE LEVANTAMIENTO
-- =====================

-- Analista puede ver solicitudes de su entidad
CREATE POLICY solicitudes_select_own_entidad
  ON solicitudes_levantamiento FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Admin puede ver todas las solicitudes
CREATE POLICY solicitudes_select_admin
  ON solicitudes_levantamiento FOR SELECT
  TO authenticated
  USING (is_admin());

-- Analista puede crear solicitudes
CREATE POLICY solicitudes_insert_analista
  ON solicitudes_levantamiento FOR INSERT
  TO authenticated
  WITH CHECK (usuario_id = auth.uid());

-- Admin puede actualizar estado de solicitudes
CREATE POLICY solicitudes_update_admin
  ON solicitudes_levantamiento FOR UPDATE
  TO authenticated
  USING (is_admin());

-- =====================
-- 8. ARCHIVOS
-- =====================

-- Usuarios pueden ver archivos de sus solicitudes
CREATE POLICY archivos_select_own
  ON archivos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM solicitudes_levantamiento sl
      WHERE sl.id = archivos.solicitud_id
        AND sl.usuario_id = auth.uid()
    )
  );

-- Admin puede ver todos los archivos
CREATE POLICY archivos_select_admin
  ON archivos FOR SELECT
  TO authenticated
  USING (is_admin());

-- Usuarios pueden subir archivos a sus solicitudes
CREATE POLICY archivos_insert_authenticated
  ON archivos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM solicitudes_levantamiento sl
      WHERE sl.id = archivos.solicitud_id
        AND sl.usuario_id = auth.uid()
    )
  );

-- =====================
-- 9. AUDITORÍA
-- =====================

-- Solo admin puede ver auditoría
CREATE POLICY auditoria_select_admin
  ON auditoria FOR SELECT
  TO authenticated
  USING (is_admin());

-- Cualquier usuario autenticado puede insertar registros de auditoría
CREATE POLICY auditoria_insert_authenticated
  ON auditoria FOR INSERT
  TO authenticated
  WITH CHECK (usuario_id = auth.uid());
