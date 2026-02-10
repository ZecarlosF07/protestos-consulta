-- ============================================================
-- HITO 2: Modelo de datos base - Tablas núcleo del sistema
-- Sistema SaaS de Consulta y Levantamiento de Protestos
-- Cámara de Comercio de Ica
-- ============================================================

-- 1. ENTIDADES FINANCIERAS
CREATE TABLE IF NOT EXISTS entidades_financieras (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        varchar(255) NOT NULL,
  estado        varchar(20)  NOT NULL DEFAULT 'activa'
                  CHECK (estado IN ('activa', 'bloqueada')),
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

COMMENT ON TABLE entidades_financieras IS 'Bancos y cajas afiliados al sistema';

-- 2. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id                    uuid PRIMARY KEY,  -- = auth.users.id
  email                 varchar(255) NOT NULL,
  nombre_completo       varchar(255) NOT NULL,
  dni                   varchar(8)   NOT NULL,
  telefono              varchar(20),
  cargo                 varchar(100),
  rol                   varchar(20)  NOT NULL DEFAULT 'analista'
                          CHECK (rol IN ('admin', 'analista')),
  entidad_financiera_id uuid REFERENCES entidades_financieras(id),
  estado                varchar(20)  NOT NULL DEFAULT 'activo'
                          CHECK (estado IN ('activo', 'bloqueado')),
  created_at            timestamptz  NOT NULL DEFAULT now(),
  updated_at            timestamptz  NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

COMMENT ON TABLE usuarios IS 'Usuarios del sistema (admin y analistas). ID vinculado 1:1 con auth.users';

-- Unique parciales (solo registros no eliminados)
CREATE UNIQUE INDEX uq_usuarios_email_activo ON usuarios (email)  WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_usuarios_dni_activo   ON usuarios (dni)    WHERE deleted_at IS NULL;

-- 3. IMPORTACIONES DE PROTESTOS (antes de protestos por la FK)
CREATE TABLE IF NOT EXISTS importaciones_protestos (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id          uuid         NOT NULL REFERENCES usuarios(id),
  nombre_archivo      varchar(255) NOT NULL,
  total_registros     integer      NOT NULL DEFAULT 0,
  registros_exitosos  integer      NOT NULL DEFAULT 0,
  registros_error     integer      NOT NULL DEFAULT 0,
  estado              varchar(20)  NOT NULL DEFAULT 'procesando'
                        CHECK (estado IN ('procesando', 'completada', 'completada_con_errores', 'fallida')),
  errores_detalle     jsonb,
  created_at          timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE importaciones_protestos IS 'Historial de cargas masivas de archivos Excel';

-- 4. PROTESTOS
CREATE TABLE IF NOT EXISTS protestos (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secuencia             varchar(50)    NOT NULL,
  tipo_documento        varchar(5)     NOT NULL
                          CHECK (tipo_documento IN ('DNI', 'RUC')),
  numero_documento      varchar(11)    NOT NULL,
  nombre_persona        varchar(255)   NOT NULL,
  entidad_financiadora  varchar(255)   NOT NULL,
  entidad_fuente        varchar(255)   NOT NULL,
  monto                 numeric(12,2)  NOT NULL CHECK (monto > 0),
  fecha_protesto        date           NOT NULL,
  tarifa_levantamiento  numeric(12,2),
  estado                varchar(20)    NOT NULL DEFAULT 'vigente'
                          CHECK (estado IN ('vigente', 'en_proceso', 'levantado')),
  importacion_id        uuid REFERENCES importaciones_protestos(id),
  created_at            timestamptz    NOT NULL DEFAULT now(),
  updated_at            timestamptz    NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

COMMENT ON TABLE protestos IS 'Registro central de protestos importados';

CREATE UNIQUE INDEX uq_protestos_secuencia_activo ON protestos (secuencia) WHERE deleted_at IS NULL;

-- 5. CONSULTAS
CREATE TABLE IF NOT EXISTS consultas (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id             uuid         NOT NULL REFERENCES usuarios(id),
  entidad_financiera_id  uuid         NOT NULL REFERENCES entidades_financieras(id),
  tipo_documento         varchar(5)   NOT NULL
                           CHECK (tipo_documento IN ('DNI', 'RUC')),
  numero_documento       varchar(11)  NOT NULL,
  resultados_encontrados integer      NOT NULL DEFAULT 0,
  fecha_consulta         timestamptz  NOT NULL DEFAULT now(),
  created_at             timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE consultas IS 'Auditoría de búsquedas realizadas por analistas (append-only, sin soft delete)';

-- 6. SOLICITUDES DE LEVANTAMIENTO
CREATE TABLE IF NOT EXISTS solicitudes_levantamiento (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protesto_id           uuid         NOT NULL REFERENCES protestos(id),
  usuario_id            uuid         NOT NULL REFERENCES usuarios(id),
  entidad_financiera_id uuid         NOT NULL REFERENCES entidades_financieras(id),
  observaciones         text,
  estado                varchar(20)  NOT NULL DEFAULT 'registrada'
                          CHECK (estado IN ('registrada', 'en_revision', 'aprobada', 'rechazada')),
  created_at            timestamptz  NOT NULL DEFAULT now(),
  updated_at            timestamptz  NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

COMMENT ON TABLE solicitudes_levantamiento IS 'Solicitudes para levantar protestos';

-- 7. ARCHIVOS
CREATE TABLE IF NOT EXISTS archivos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id    uuid         NOT NULL REFERENCES solicitudes_levantamiento(id),
  tipo            varchar(30)  NOT NULL
                    CHECK (tipo IN ('comprobante_pago', 'formato_firmado')),
  nombre_archivo  varchar(255) NOT NULL,
  ruta            varchar(500) NOT NULL,
  tamano_bytes    bigint,
  created_at      timestamptz  NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

COMMENT ON TABLE archivos IS 'Documentos cargados para solicitudes de levantamiento';

-- 8. AUDITORÍA
CREATE TABLE IF NOT EXISTS auditoria (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id            uuid         NOT NULL REFERENCES usuarios(id),
  entidad_financiera_id uuid REFERENCES entidades_financieras(id),
  accion                varchar(100) NOT NULL,
  entidad_afectada      varchar(100),
  entidad_afectada_id   uuid,
  descripcion           text,
  metadata              jsonb,
  created_at            timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE auditoria IS 'Registro transversal de eventos del sistema (append-only, sin soft delete)';
