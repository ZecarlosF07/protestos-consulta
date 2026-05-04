-- ============================================================
-- HITO 14: Corrección de seguridad, auditoría y validación final
-- Endurece creación de usuarios, RLS y correlativos PDF.
-- ============================================================

-- 1. USUARIOS: eliminar inserción propia tipo auto-registro
DROP POLICY IF EXISTS usuarios_insert_self ON usuarios;

DROP POLICY IF EXISTS usuarios_insert_admin ON usuarios;
CREATE POLICY usuarios_insert_admin
  ON usuarios FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- 2. FUNCIONES ADMINISTRATIVAS DE USUARIOS
CREATE OR REPLACE FUNCTION crear_usuario(
  p_email         varchar,
  p_password      varchar,
  p_nombre        varchar,
  p_dni           varchar,
  p_telefono      varchar DEFAULT NULL,
  p_cargo         varchar DEFAULT NULL,
  p_rol           varchar DEFAULT 'analista',
  p_entidad_id    uuid    DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'No autorizado: solo el administrador puede crear usuarios';
  END IF;

  IF p_rol NOT IN ('admin', 'analista') THEN
    RAISE EXCEPTION 'Rol inválido: %', p_rol;
  END IF;

  IF p_rol = 'analista' AND p_entidad_id IS NULL THEN
    RAISE EXCEPTION 'Un analista debe tener una entidad financiera asignada';
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    RAISE EXCEPTION 'Ya existe un usuario con el email: %', p_email;
  END IF;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at, confirmation_token,
    raw_app_meta_data, raw_user_meta_data
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated', p_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(), now(), now(), '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('nombre_completo', p_nombre, 'rol', p_rol)
  )
  RETURNING id INTO v_user_id;

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data,
    provider, last_sign_in_at, created_at, updated_at
  )
  VALUES (
    gen_random_uuid(), v_user_id, p_email,
    jsonb_build_object('sub', v_user_id::text, 'email', p_email),
    'email', now(), now(), now()
  );

  INSERT INTO usuarios (
    id, email, nombre_completo, dni, telefono,
    cargo, rol, entidad_financiera_id, estado
  )
  VALUES (
    v_user_id, p_email, p_nombre, p_dni, p_telefono,
    p_cargo, p_rol, p_entidad_id, 'activo'
  );

  RETURN v_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION resetear_password(
  p_user_id  uuid,
  p_password varchar
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'No autorizado: solo el administrador puede resetear contraseñas';
  END IF;

  UPDATE auth.users
  SET
    encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
    updated_at = now()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION cambiar_estado_usuario(
  p_user_id uuid,
  p_estado  varchar
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'No autorizado: solo el administrador puede cambiar estados de usuario';
  END IF;

  IF p_estado NOT IN ('activo', 'bloqueado') THEN
    RAISE EXCEPTION 'Estado inválido: %', p_estado;
  END IF;

  UPDATE usuarios
  SET estado = p_estado, updated_at = now()
  WHERE id = p_user_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION crear_usuario(varchar, varchar, varchar, varchar, varchar, varchar, varchar, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION resetear_password(uuid, varchar) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION cambiar_estado_usuario(uuid, varchar) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION crear_usuario(varchar, varchar, varchar, varchar, varchar, varchar, varchar, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION resetear_password(uuid, varchar) TO authenticated;
GRANT EXECUTE ON FUNCTION cambiar_estado_usuario(uuid, varchar) TO authenticated;

-- 3. FORMATOS PDF: RLS exclusivamente administrativo
DROP POLICY IF EXISTS formatos_pdf_select ON formatos_pdf;
DROP POLICY IF EXISTS formatos_pdf_update ON formatos_pdf;
DROP POLICY IF EXISTS documentos_emitidos_select ON documentos_emitidos;
DROP POLICY IF EXISTS documentos_emitidos_insert ON documentos_emitidos;
DROP POLICY IF EXISTS documentos_emitidos_update ON documentos_emitidos;

CREATE POLICY formatos_pdf_select
  ON formatos_pdf FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY formatos_pdf_update
  ON formatos_pdf FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY documentos_emitidos_select
  ON documentos_emitidos FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY documentos_emitidos_insert
  ON documentos_emitidos FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY documentos_emitidos_update
  ON documentos_emitidos FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

ALTER TABLE documentos_emitidos
  DROP CONSTRAINT IF EXISTS chk_documentos_emitidos_anulacion_completa;

ALTER TABLE documentos_emitidos
  ADD CONSTRAINT chk_documentos_emitidos_anulacion_completa
  CHECK (
    estado <> 'anulado'
    OR (
      anulado_por IS NOT NULL
      AND fecha_anulacion IS NOT NULL
      AND motivo_anulacion IS NOT NULL
      AND btrim(motivo_anulacion) <> ''
    )
  ) NOT VALID;

-- 4. CORRELATIVOS: validar admin dentro de la RPC sensible
CREATE OR REPLACE FUNCTION incrementar_correlativo(p_formato_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nuevo_correlativo integer;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'No autorizado: solo el administrador puede generar correlativos';
  END IF;

  UPDATE formatos_pdf
  SET ultimo_correlativo = ultimo_correlativo + 1,
      updated_at = now()
  WHERE id = p_formato_id
    AND activo = true
  RETURNING ultimo_correlativo INTO v_nuevo_correlativo;

  IF v_nuevo_correlativo IS NULL THEN
    RAISE EXCEPTION 'Formato no encontrado o inactivo';
  END IF;

  RETURN v_nuevo_correlativo;
END;
$$;

REVOKE EXECUTE ON FUNCTION incrementar_correlativo(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION incrementar_correlativo(uuid) TO authenticated;
