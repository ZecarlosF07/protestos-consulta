-- ============================================================
-- Restringir acceso a protestos: solo Admin puede listar.
-- Los analistas consultan mediante la función RPC buscar_protestos.
-- ============================================================

-- 1. Eliminar política permisiva actual
DROP POLICY IF EXISTS protestos_select_authenticated ON protestos;

-- 2. Solo Admin puede ver todos los protestos
CREATE POLICY protestos_select_admin_only
  ON protestos FOR SELECT
  TO authenticated
  USING (is_admin());

-- 3. Analista puede ver protestos vinculados a sus propias solicitudes
--    (necesario para el JOIN en la query de solicitudes_levantamiento)
CREATE POLICY protestos_select_own_solicitudes
  ON protestos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM solicitudes_levantamiento sl
      WHERE sl.protesto_id = protestos.id
        AND sl.usuario_id  = auth.uid()
        AND sl.deleted_at IS NULL
    )
  );

-- 4. Función RPC para que el analista busque por documento
--    Usa SECURITY DEFINER para leer protestos sin depender de RLS.
CREATE OR REPLACE FUNCTION buscar_protestos_por_documento(
  p_numero_documento text,
  p_tipo_documento text
)
RETURNS SETOF protestos
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM protestos
  WHERE numero_documento = p_numero_documento
    AND tipo_documento   = p_tipo_documento
    AND deleted_at IS NULL
  ORDER BY fecha_protesto DESC;
$$;

GRANT EXECUTE ON FUNCTION buscar_protestos_por_documento(text, text) TO authenticated;

-- 5. Función RPC para verificar si un protesto está vigente (usada al crear solicitud)
CREATE OR REPLACE FUNCTION verificar_protesto_vigente(p_protesto_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_protesto record;
BEGIN
  SELECT id, estado INTO v_protesto
  FROM protestos
  WHERE id = p_protesto_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN json_build_object('encontrado', false, 'vigente', false);
  END IF;

  RETURN json_build_object(
    'encontrado', true,
    'vigente', v_protesto.estado = 'vigente'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION verificar_protesto_vigente(uuid) TO authenticated;

-- 6. Función RPC para cambiar estado del protesto desde el flujo de solicitud
--    Solo permite transiciones válidas del flujo de levantamiento.
CREATE OR REPLACE FUNCTION cambiar_estado_protesto_solicitud(
  p_protesto_id uuid,
  p_nuevo_estado text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_nuevo_estado NOT IN ('en_proceso', 'vigente') THEN
    RAISE EXCEPTION 'Estado no permitido desde solicitud: %', p_nuevo_estado;
  END IF;

  UPDATE protestos
  SET estado = p_nuevo_estado, updated_at = now()
  WHERE id = p_protesto_id AND deleted_at IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION cambiar_estado_protesto_solicitud(uuid, text) TO authenticated;

