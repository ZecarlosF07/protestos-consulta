-- ============================================================
-- HITO 3: Habilitar extensión pgcrypto y funciones de usuarios
-- ============================================================

-- Habilitar pgcrypto para crypt() y gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Función para crear usuarios del sistema
-- Asocia auth.users con la tabla usuarios (1:1)
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
  -- Validar rol
  IF p_rol NOT IN ('admin', 'analista') THEN
    RAISE EXCEPTION 'Rol inválido: %', p_rol;
  END IF;

  -- Validar que analista tenga entidad
  IF p_rol = 'analista' AND p_entidad_id IS NULL THEN
    RAISE EXCEPTION 'Un analista debe tener una entidad financiera asignada';
  END IF;

  -- Verificar si ya existe en auth
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    RAISE EXCEPTION 'Ya existe un usuario con el email: %', p_email;
  END IF;

  -- Insertar en auth.users
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

  -- Insertar identidad
  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data,
    provider, last_sign_in_at, created_at, updated_at
  )
  VALUES (
    gen_random_uuid(), v_user_id, p_email,
    jsonb_build_object('sub', v_user_id::text, 'email', p_email),
    'email', now(), now(), now()
  );

  -- Insertar en tabla usuarios del sistema
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

-- Función para resetear contraseña (solo admin)
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

-- Función para cambiar estado de usuario
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
  IF p_estado NOT IN ('activo', 'bloqueado') THEN
    RAISE EXCEPTION 'Estado inválido: %', p_estado;
  END IF;

  UPDATE usuarios
  SET estado = p_estado
  WHERE id = p_user_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
END;
$$;
