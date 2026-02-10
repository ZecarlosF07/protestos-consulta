-- ============================================================
-- HITO 2: Trigger automático para actualizar updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas con campo updated_at
CREATE TRIGGER trg_entidades_financieras_updated_at
  BEFORE UPDATE ON entidades_financieras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_protestos_updated_at
  BEFORE UPDATE ON protestos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_solicitudes_levantamiento_updated_at
  BEFORE UPDATE ON solicitudes_levantamiento
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
