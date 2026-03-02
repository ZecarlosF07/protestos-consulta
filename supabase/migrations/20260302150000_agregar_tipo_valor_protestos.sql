-- ============================================================
-- Agregar campo tipo_valor (TV) a la tabla protestos
-- Representa el tipo de valor: Letra, Pagaré, etc.
-- ============================================================

ALTER TABLE protestos
  ADD COLUMN IF NOT EXISTS tipo_valor varchar(50);

COMMENT ON COLUMN protestos.tipo_valor IS 'Tipo de valor del protesto: Letra, Pagaré, etc.';

-- Actualizar la función RPC para que devuelva el nuevo campo automáticamente
-- (ya usa RETURNS SETOF protestos, así que retorna todas las columnas)
