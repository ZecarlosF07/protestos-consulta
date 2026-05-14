-- ============================================================
-- HITO 17: Emisión transaccional de documentos con correlativo
-- ============================================================

ALTER TABLE documentos_emitidos
    ADD COLUMN IF NOT EXISTS metadata jsonb;

CREATE OR REPLACE FUNCTION generar_documento_emitido(
    p_formato_id uuid,
    p_tipo_solicitante varchar,
    p_nro_documento varchar,
    p_nombre_solicitante varchar,
    p_pdf_ruta varchar,
    p_emitido_por uuid,
    p_metadata jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_nuevo_correlativo integer;
    v_documento_id uuid;
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'No autorizado: solo el administrador puede generar documentos';
    END IF;

    IF p_emitido_por IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'No autorizado: el emisor debe ser el usuario autenticado';
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

    INSERT INTO documentos_emitidos (
        formato_id,
        correlativo,
        tipo_solicitante,
        nro_documento,
        nombre_solicitante,
        pdf_ruta,
        emitido_por,
        metadata
    )
    VALUES (
        p_formato_id,
        v_nuevo_correlativo,
        p_tipo_solicitante,
        p_nro_documento,
        p_nombre_solicitante,
        p_pdf_ruta,
        p_emitido_por,
        p_metadata
    )
    RETURNING id INTO v_documento_id;

    RETURN v_documento_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION generar_documento_emitido(
    uuid, varchar, varchar, varchar, varchar, uuid, jsonb
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION generar_documento_emitido(
    uuid, varchar, varchar, varchar, varchar, uuid, jsonb
) TO authenticated;

COMMENT ON FUNCTION generar_documento_emitido IS
    'Genera un documento emitido e incrementa el correlativo dentro de la misma transacción';
