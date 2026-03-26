-- ============================================================
-- HITO 13: Función RPC para incrementar correlativo de forma atómica
-- Evita duplicados por concurrencia
-- ============================================================

CREATE OR REPLACE FUNCTION incrementar_correlativo(p_formato_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_nuevo_correlativo integer;
BEGIN
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

COMMENT ON FUNCTION incrementar_correlativo IS 'Incrementa atómicamente el correlativo de un formato PDF';
