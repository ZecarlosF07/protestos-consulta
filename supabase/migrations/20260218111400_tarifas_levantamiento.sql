-- ============================================================
-- Tabla de tarifas por rango de monto + cálculo automático
-- Escala por Título Valor – Nueva Tarifa 2024
-- ============================================================

-- 1. Tabla configurable de tarifas
CREATE TABLE IF NOT EXISTS tarifas_levantamiento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monto_hasta numeric(12,2),  -- NULL = sin límite superior ("Mayor de...")
  tarifa numeric(12,2) NOT NULL,
  orden smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE tarifas_levantamiento
  IS 'Escala de tarifas de levantamiento por rango de monto del protesto';
COMMENT ON COLUMN tarifas_levantamiento.monto_hasta
  IS 'Límite superior del rango (inclusive). NULL = sin límite (mayor de)';
COMMENT ON COLUMN tarifas_levantamiento.orden
  IS 'Orden de evaluación ascendente (se evalúa el primer rango que aplique)';

-- 2. Seed de tarifas 2024
INSERT INTO tarifas_levantamiento (monto_hasta, tarifa, orden) VALUES
  (5000.00,   58.00,  1),
  (10000.00,  68.00,  2),
  (15000.00,  78.00,  3),
  (20000.00,  88.00,  4),
  (30000.00,  98.00,  5),
  (50000.00, 108.00,  6),
  (NULL,     118.00,  7);  -- Mayor de S/ 50,000

-- 3. Función que calcula la tarifa dado un monto
CREATE OR REPLACE FUNCTION calcular_tarifa_levantamiento(p_monto numeric)
RETURNS numeric
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT tarifa
  FROM tarifas_levantamiento
  WHERE monto_hasta >= p_monto OR monto_hasta IS NULL
  ORDER BY orden ASC
  LIMIT 1;
$$;

-- 4. Trigger que asigna tarifa automáticamente al insertar o actualizar monto
CREATE OR REPLACE FUNCTION trigger_calcular_tarifa()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Solo recalcular si el monto cambió o la tarifa está vacía
  IF TG_OP = 'INSERT' OR NEW.monto IS DISTINCT FROM OLD.monto OR NEW.tarifa_levantamiento IS NULL THEN
    NEW.tarifa_levantamiento := calcular_tarifa_levantamiento(NEW.monto);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calcular_tarifa ON protestos;

CREATE TRIGGER trg_calcular_tarifa
  BEFORE INSERT OR UPDATE ON protestos
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calcular_tarifa();

-- 5. Actualizar protestos existentes que no tengan tarifa calculada
UPDATE protestos
SET tarifa_levantamiento = calcular_tarifa_levantamiento(monto)
WHERE tarifa_levantamiento IS NULL
  AND monto IS NOT NULL
  AND deleted_at IS NULL;

-- 6. RLS para tarifas_levantamiento
ALTER TABLE tarifas_levantamiento ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede ver las tarifas
CREATE POLICY tarifas_select_authenticated
  ON tarifas_levantamiento FOR SELECT
  TO authenticated
  USING (true);

-- Solo admin puede gestionar tarifas
CREATE POLICY tarifas_insert_admin
  ON tarifas_levantamiento FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY tarifas_update_admin
  ON tarifas_levantamiento FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY tarifas_delete_admin
  ON tarifas_levantamiento FOR DELETE
  TO authenticated
  USING (is_admin());

-- 7. Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON tarifas_levantamiento TO authenticated;
GRANT SELECT ON tarifas_levantamiento TO anon;
