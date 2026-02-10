-- ============================================================
-- SCRIPT DE REPARACIÓN COMPLETO
-- Ejecutar en SQL Editor de Supabase (como postgres)
-- ============================================================

-- ========== PARTE 1: LIMPIAR DATOS CORRUPTOS ==========

-- Eliminar registros de la tabla usuarios (depende de auth.users)
DELETE FROM usuarios;

-- Eliminar identidades corruptas
DELETE FROM auth.identities
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email IN ('admin@camaraica.org.pe', 'admin2@camaraica.org.pe')
);

-- Eliminar sesiones de esos usuarios
DELETE FROM auth.sessions
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email IN ('admin@camaraica.org.pe', 'admin2@camaraica.org.pe')
);

-- Eliminar refresh tokens
DELETE FROM auth.refresh_tokens
WHERE user_id::uuid IN (
  SELECT id FROM auth.users
  WHERE email IN ('admin@camaraica.org.pe', 'admin2@camaraica.org.pe')
);

-- Finalmente eliminar los usuarios de auth
DELETE FROM auth.users
WHERE email IN ('admin@camaraica.org.pe', 'admin2@camaraica.org.pe');

-- ========== PARTE 2: BORRAR POLICIES CON RECURSIÓN ==========

DROP POLICY IF EXISTS usuarios_select_own ON usuarios;
DROP POLICY IF EXISTS usuarios_select_admin ON usuarios;
DROP POLICY IF EXISTS usuarios_insert_admin ON usuarios;
DROP POLICY IF EXISTS usuarios_insert_self ON usuarios;
DROP POLICY IF EXISTS usuarios_update_admin ON usuarios;
DROP POLICY IF EXISTS entidades_select_authenticated ON entidades_financieras;
DROP POLICY IF EXISTS entidades_insert_admin ON entidades_financieras;
DROP POLICY IF EXISTS entidades_update_admin ON entidades_financieras;
DROP POLICY IF EXISTS protestos_select_authenticated ON protestos;
DROP POLICY IF EXISTS protestos_insert_admin ON protestos;
DROP POLICY IF EXISTS protestos_update_admin ON protestos;
DROP POLICY IF EXISTS importaciones_select_admin ON importaciones_protestos;
DROP POLICY IF EXISTS importaciones_insert_admin ON importaciones_protestos;
DROP POLICY IF EXISTS importaciones_update_admin ON importaciones_protestos;
DROP POLICY IF EXISTS consultas_select_own ON consultas;
DROP POLICY IF EXISTS consultas_select_admin ON consultas;
DROP POLICY IF EXISTS consultas_insert_authenticated ON consultas;
DROP POLICY IF EXISTS solicitudes_select_own_entidad ON solicitudes_levantamiento;
DROP POLICY IF EXISTS solicitudes_select_admin ON solicitudes_levantamiento;
DROP POLICY IF EXISTS solicitudes_insert_analista ON solicitudes_levantamiento;
DROP POLICY IF EXISTS solicitudes_update_admin ON solicitudes_levantamiento;
DROP POLICY IF EXISTS archivos_select_own_entidad ON archivos;
DROP POLICY IF EXISTS archivos_select_own ON archivos;
DROP POLICY IF EXISTS archivos_select_admin ON archivos;
DROP POLICY IF EXISTS archivos_insert_authenticated ON archivos;
DROP POLICY IF EXISTS auditoria_select_admin ON auditoria;
DROP POLICY IF EXISTS auditoria_insert_authenticated ON auditoria;

-- ========== PARTE 3: FUNCIONES HELPER (SIN RECURSIÓN) ==========

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

-- ========== PARTE 4: HABILITAR RLS ==========

ALTER TABLE entidades_financieras ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE importaciones_protestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_levantamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- ========== PARTE 5: POLICIES CORREGIDAS ==========

-- USUARIOS
CREATE POLICY usuarios_select_own ON usuarios FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY usuarios_select_admin ON usuarios FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY usuarios_insert_self ON usuarios FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY usuarios_insert_admin ON usuarios FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY usuarios_update_admin ON usuarios FOR UPDATE TO authenticated
  USING (is_admin());

-- ENTIDADES FINANCIERAS
CREATE POLICY entidades_select_authenticated ON entidades_financieras FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY entidades_insert_admin ON entidades_financieras FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY entidades_update_admin ON entidades_financieras FOR UPDATE TO authenticated
  USING (is_admin());

-- PROTESTOS
CREATE POLICY protestos_select_authenticated ON protestos FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY protestos_insert_admin ON protestos FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY protestos_update_admin ON protestos FOR UPDATE TO authenticated
  USING (is_admin());

-- IMPORTACIONES
CREATE POLICY importaciones_select_admin ON importaciones_protestos FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY importaciones_insert_admin ON importaciones_protestos FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY importaciones_update_admin ON importaciones_protestos FOR UPDATE TO authenticated
  USING (is_admin());

-- CONSULTAS
CREATE POLICY consultas_select_own ON consultas FOR SELECT TO authenticated
  USING (usuario_id = auth.uid());

CREATE POLICY consultas_select_admin ON consultas FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY consultas_insert_authenticated ON consultas FOR INSERT TO authenticated
  WITH CHECK (usuario_id = auth.uid());

-- SOLICITUDES
CREATE POLICY solicitudes_select_own_entidad ON solicitudes_levantamiento FOR SELECT TO authenticated
  USING (usuario_id = auth.uid());

CREATE POLICY solicitudes_select_admin ON solicitudes_levantamiento FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY solicitudes_insert_analista ON solicitudes_levantamiento FOR INSERT TO authenticated
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY solicitudes_update_admin ON solicitudes_levantamiento FOR UPDATE TO authenticated
  USING (is_admin());

-- ARCHIVOS
CREATE POLICY archivos_select_own ON archivos FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM solicitudes_levantamiento sl
    WHERE sl.id = archivos.solicitud_id AND sl.usuario_id = auth.uid()
  ));

CREATE POLICY archivos_select_admin ON archivos FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY archivos_insert_authenticated ON archivos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM solicitudes_levantamiento sl
    WHERE sl.id = archivos.solicitud_id AND sl.usuario_id = auth.uid()
  ));

-- AUDITORÍA
CREATE POLICY auditoria_select_admin ON auditoria FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY auditoria_insert_authenticated ON auditoria FOR INSERT TO authenticated
  WITH CHECK (usuario_id = auth.uid());

-- ========== PARTE 6: GRANTS ==========

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO anon;
