-- ============================================================
-- HITO 2: Índices para consultas frecuentes
-- ============================================================

-- Protestos: búsqueda principal del sistema
CREATE INDEX IF NOT EXISTS idx_protestos_numero_documento
  ON protestos (numero_documento);

CREATE INDEX IF NOT EXISTS idx_protestos_estado
  ON protestos (estado);

CREATE INDEX IF NOT EXISTS idx_protestos_fecha_protesto
  ON protestos (fecha_protesto);

-- Consultas: reportes y métricas
CREATE INDEX IF NOT EXISTS idx_consultas_usuario_id
  ON consultas (usuario_id);

CREATE INDEX IF NOT EXISTS idx_consultas_entidad_financiera_id
  ON consultas (entidad_financiera_id);

CREATE INDEX IF NOT EXISTS idx_consultas_fecha_consulta
  ON consultas (fecha_consulta);

-- Solicitudes: gestión por estado
CREATE INDEX IF NOT EXISTS idx_solicitudes_protesto_id
  ON solicitudes_levantamiento (protesto_id);

CREATE INDEX IF NOT EXISTS idx_solicitudes_estado
  ON solicitudes_levantamiento (estado);

-- Auditoría: consultas de trazabilidad
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario_id
  ON auditoria (usuario_id);

CREATE INDEX IF NOT EXISTS idx_auditoria_accion
  ON auditoria (accion);

CREATE INDEX IF NOT EXISTS idx_auditoria_created_at
  ON auditoria (created_at);

-- Usuarios: búsqueda por entidad y estado
CREATE INDEX IF NOT EXISTS idx_usuarios_entidad_financiera_id
  ON usuarios (entidad_financiera_id);

CREATE INDEX IF NOT EXISTS idx_usuarios_estado
  ON usuarios (estado);
