-- ============================================================
-- HITO 3: Seed del administrador inicial del sistema
-- ============================================================

SELECT crear_usuario(
  p_email    := 'admin@camaraica.org.pe',
  p_password := 'Admin2026!',
  p_nombre   := 'Administrador Cámara de Comercio',
  p_dni      := '00000001',
  p_telefono := NULL,
  p_cargo    := 'Administrador del Sistema',
  p_rol      := 'admin',
  p_entidad_id := NULL
);
