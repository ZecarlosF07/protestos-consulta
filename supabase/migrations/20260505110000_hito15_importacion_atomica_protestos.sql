-- ============================================================
-- HITO 15: Importacion atomica de protestos
-- ============================================================
-- Inserta todos los protestos validados en una unica operacion.
-- Si cualquier fila falla, PostgreSQL revierte toda la funcion.

CREATE OR REPLACE FUNCTION importar_protestos_atomicos(
  p_importacion_id uuid,
  p_protestos jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_insertados integer;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'No autorizado: solo el administrador puede importar protestos';
  END IF;

  IF p_importacion_id IS NULL THEN
    RAISE EXCEPTION 'La importacion es obligatoria';
  END IF;

  IF p_protestos IS NULL OR jsonb_typeof(p_protestos) <> 'array' THEN
    RAISE EXCEPTION 'La lista de protestos debe ser un arreglo JSON';
  END IF;

  SELECT count(*)::integer
  INTO v_insertados
  FROM jsonb_array_elements(p_protestos);

  IF v_insertados = 0 THEN
    RAISE EXCEPTION 'No hay protestos validos para importar';
  END IF;

  PERFORM 1
  FROM importaciones_protestos
  WHERE id = p_importacion_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Importacion no encontrada';
  END IF;

  INSERT INTO protestos (
    secuencia,
    tipo_documento,
    numero_documento,
    nombre_persona,
    entidad_financiadora,
    entidad_fuente,
    monto,
    fecha_protesto,
    tarifa_levantamiento,
    tipo_valor,
    importacion_id,
    estado
  )
  SELECT
    row_data.secuencia,
    row_data.tipo_documento,
    row_data.numero_documento,
    row_data.nombre_persona,
    row_data.entidad_financiadora,
    row_data.entidad_fuente,
    row_data.monto,
    row_data.fecha_protesto,
    row_data.tarifa_levantamiento,
    row_data.tipo_valor,
    p_importacion_id,
    'vigente'
  FROM jsonb_to_recordset(p_protestos) AS row_data (
    secuencia varchar(50),
    tipo_documento varchar(5),
    numero_documento varchar(11),
    nombre_persona varchar(255),
    entidad_financiadora varchar(255),
    entidad_fuente varchar(255),
    monto numeric(12,2),
    fecha_protesto date,
    tarifa_levantamiento numeric(12,2),
    tipo_valor varchar(50)
  );

  GET DIAGNOSTICS v_insertados = ROW_COUNT;

  UPDATE importaciones_protestos
  SET
    total_registros = v_insertados,
    registros_exitosos = v_insertados,
    registros_error = 0,
    estado = 'completada',
    errores_detalle = '[]'::jsonb
  WHERE id = p_importacion_id;

  RETURN v_insertados;
END;
$$;

REVOKE EXECUTE ON FUNCTION importar_protestos_atomicos(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION importar_protestos_atomicos(uuid, jsonb) TO authenticated;
