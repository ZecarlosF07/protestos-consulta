# Hito 2 – Modelo de Datos Base (Núcleo del Sistema)

## 1. Objetivo del Hito

Construir y dejar operativo el **modelo de datos base del sistema**, asegurando que represente fielmente el dominio del negocio definido en el análisis funcional (Hito 1) y que sirva como **columna vertebral** para todos los hitos posteriores.

Este hito prioriza:
- **Consistencia**: relaciones claras y bien definidas entre entidades
- **Trazabilidad**: campos de auditoría en todas las tablas
- **Integridad**: constraints, claves foráneas y validaciones a nivel de base de datos
- **Control institucional**: soft delete obligatorio, sin eliminación física de datos históricos

> Este hito **no incluye** lógica de negocio, vistas, componentes frontend ni autenticación. Su propósito es dejar listo el núcleo de datos sobre el cual se construirá todo el sistema.

---

## 2. Tareas del Hito

### 2.1 Diseño y validación del modelo lógico

- [ ] Revisar y validar el diccionario de datos contra los flujos funcionales aprobados en el Hito 1.
- [ ] Confirmar que todas las entidades del dominio están representadas.
- [ ] Verificar que las relaciones cubren los flujos de: consulta, auditoría, levantamiento e importación.

### 2.2 Implementación de tablas núcleo

Crear las **8 tablas** del sistema en el siguiente orden (respetando dependencias de FK):

| # | Tabla | Depende de |
|---|-------|------------|
| 1 | `entidades_financieras` | — |
| 2 | `usuarios` | `entidades_financieras` |
| 3 | `protestos` | — |
| 4 | `consultas` | `usuarios`, `entidades_financieras` |
| 5 | `solicitudes_levantamiento` | `protestos`, `usuarios`, `entidades_financieras` |
| 6 | `archivos` | `solicitudes_levantamiento` |
| 7 | `auditoria` | `usuarios`, `entidades_financieras` |
| 8 | `importaciones_protestos` | `usuarios` |

### 2.3 Definición de relaciones y constraints

- [ ] Configurar claves primarias UUID con `gen_random_uuid()`.
- [ ] Establecer claves foráneas explícitas con `REFERENCES`.
- [ ] Aplicar constraints `NOT NULL` en campos obligatorios.
- [ ] Aplicar constraints `CHECK` para estados válidos.
- [ ] Crear índices en campos de búsqueda frecuente.

### 2.4 Campos estándar de auditoría y soft delete

Todas las tablas **críticas** deben incluir:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `created_at` | `timestamptz` | `now()` | Fecha de creación del registro |
| `updated_at` | `timestamptz` | `now()` | Última modificación |
| `deleted_at` | `timestamptz` | `NULL` | Soft delete (NULL = activo) |

### 2.5 Estado de entidades críticas

Los estados deben estar controlados con `CHECK`:

| Entidad | Estados válidos |
|---------|----------------|
| `entidades_financieras.estado` | `activa`, `bloqueada` |
| `usuarios.estado` | `activo`, `bloqueado` |
| `usuarios.rol` | `admin`, `analista` |
| `protestos.estado` | `vigente`, `en_proceso`, `levantado` |
| `solicitudes_levantamiento.estado` | `registrada`, `en_revision`, `aprobada`, `rechazada` |
| `archivos.tipo` | `comprobante_pago`, `formato_firmado` |

### 2.6 Creación de migraciones

- [ ] Crear migración inicial con todas las tablas.
- [ ] Crear migración de índices.
- [ ] Validar ejecución limpia con el CLI de Supabase.

### 2.7 Validación cruzada

- [ ] Verificar que el modelo soporta todos los flujos del Hito 1.
- [ ] Verificar que el modelo es compatible con los Hitos 3 al 7 sin cambios estructurales mayores.

---

## 3. Modelo de Datos Detallado

### 3.1 `entidades_financieras`

Representa a los bancos y cajas afiliados al sistema.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | `gen_random_uuid()` | Identificador único |
| `nombre` | `varchar(255)` | NO | — | Nombre de la entidad |
| `estado` | `varchar(20)` | NO | `'activa'` | Estado: `activa` / `bloqueada` |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de creación |
| `updated_at` | `timestamptz` | NO | `now()` | Última actualización |
| `deleted_at` | `timestamptz` | SÍ | `NULL` | Soft delete |

**Constraints:**
- `CHECK (estado IN ('activa', 'bloqueada'))`

---

### 3.2 `usuarios`

Usuarios del sistema (administradores y analistas). Asociados 1:1 con `auth.users` de Supabase.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | — | ID del usuario (= `auth.users.id`) |
| `email` | `varchar(255)` | NO | — | Correo institucional (UNIQUE) |
| `nombre_completo` | `varchar(255)` | NO | — | Nombre completo |
| `dni` | `varchar(8)` | NO | — | DNI del usuario (UNIQUE) |
| `telefono` | `varchar(20)` | SÍ | — | Teléfono |
| `cargo` | `varchar(100)` | SÍ | — | Cargo institucional |
| `rol` | `varchar(20)` | NO | `'analista'` | Rol: `admin` / `analista` |
| `entidad_financiera_id` | `uuid` (FK) | SÍ | — | Entidad asociada (NULL para admin) |
| `estado` | `varchar(20)` | NO | `'activo'` | Estado: `activo` / `bloqueado` |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de creación |
| `updated_at` | `timestamptz` | NO | `now()` | Última actualización |
| `deleted_at` | `timestamptz` | SÍ | `NULL` | Soft delete |

**Constraints:**
- `CHECK (rol IN ('admin', 'analista'))`
- `CHECK (estado IN ('activo', 'bloqueado'))`
- `UNIQUE (email)` donde `deleted_at IS NULL`
- `UNIQUE (dni)` donde `deleted_at IS NULL`
- `FOREIGN KEY (entidad_financiera_id) REFERENCES entidades_financieras(id)`

> **Nota:** Se elimina `password_hash` del diccionario original porque la autenticación se gestiona completamente con Supabase Auth (`auth.users`). El `id` de esta tabla será el mismo que `auth.users.id`.

---

### 3.3 `protestos`

Registro central de protestos importados desde los archivos Excel de la Cámara de Comercio de Lima.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | `gen_random_uuid()` | Identificador |
| `secuencia` | `varchar(50)` | NO | — | Secuencia oficial (UNIQUE) |
| `tipo_documento` | `varchar(5)` | NO | — | Tipo: `DNI` / `RUC` |
| `numero_documento` | `varchar(11)` | NO | — | Documento de la persona |
| `nombre_persona` | `varchar(255)` | NO | — | Nombre completo |
| `entidad_financiadora` | `varchar(255)` | NO | — | Girador |
| `entidad_fuente` | `varchar(255)` | NO | — | EF (notaría u origen) |
| `monto` | `numeric(12,2)` | NO | — | Monto del protesto |
| `fecha_protesto` | `date` | NO | — | Fecha del protesto |
| `tarifa_levantamiento` | `numeric(12,2)` | SÍ | — | Tarifa vigente |
| `estado` | `varchar(20)` | NO | `'vigente'` | Estado: `vigente` / `en_proceso` / `levantado` |
| `importacion_id` | `uuid` (FK) | SÍ | — | Referencia a la importación origen |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de registro |
| `updated_at` | `timestamptz` | NO | `now()` | Última actualización |
| `deleted_at` | `timestamptz` | SÍ | `NULL` | Soft delete |

**Constraints:**
- `CHECK (tipo_documento IN ('DNI', 'RUC'))`
- `CHECK (estado IN ('vigente', 'en_proceso', 'levantado'))`
- `CHECK (monto > 0)`
- `UNIQUE (secuencia)` donde `deleted_at IS NULL`
- `FOREIGN KEY (importacion_id) REFERENCES importaciones_protestos(id)`

**Índices:**
- `idx_protestos_numero_documento` en `(numero_documento)` — campo de búsqueda principal del sistema
- `idx_protestos_estado` en `(estado)` — filtrado frecuente

---

### 3.4 `consultas`

Auditoría de búsquedas realizadas por analistas. Esta tabla es **append-only** (solo inserciones).

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | `gen_random_uuid()` | Identificador |
| `usuario_id` | `uuid` (FK) | NO | — | Analista que realizó la consulta |
| `entidad_financiera_id` | `uuid` (FK) | NO | — | Entidad del analista |
| `tipo_documento` | `varchar(5)` | NO | — | Tipo: `DNI` / `RUC` |
| `numero_documento` | `varchar(11)` | NO | — | Documento consultado |
| `resultados_encontrados` | `integer` | NO | `0` | Cantidad de protestos encontrados |
| `fecha_consulta` | `timestamptz` | NO | `now()` | Fecha y hora de la consulta |
| `created_at` | `timestamptz` | NO | `now()` | Registro |

**Constraints:**
- `CHECK (tipo_documento IN ('DNI', 'RUC'))`
- `FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`
- `FOREIGN KEY (entidad_financiera_id) REFERENCES entidades_financieras(id)`

**Índices:**
- `idx_consultas_usuario_id` en `(usuario_id)`
- `idx_consultas_entidad_financiera_id` en `(entidad_financiera_id)`
- `idx_consultas_fecha_consulta` en `(fecha_consulta)`

> **Nota:** Se eliminó `deleted_at` de esta tabla. Las consultas son registros de auditoría y **nunca deben eliminarse**, ni siquiera lógicamente. Se agregó `resultados_encontrados` para métricas del dashboard.

---

### 3.5 `solicitudes_levantamiento`

Solicitudes generadas por analistas para levantar protestos.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | `gen_random_uuid()` | Identificador |
| `protesto_id` | `uuid` (FK) | NO | — | Protesto asociado |
| `usuario_id` | `uuid` (FK) | NO | — | Analista solicitante |
| `entidad_financiera_id` | `uuid` (FK) | NO | — | Entidad del analista |
| `observaciones` | `text` | SÍ | — | Notas del admin al revisar |
| `estado` | `varchar(20)` | NO | `'registrada'` | Estado de la solicitud |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de solicitud |
| `updated_at` | `timestamptz` | NO | `now()` | Última actualización |
| `deleted_at` | `timestamptz` | SÍ | `NULL` | Soft delete |

**Constraints:**
- `CHECK (estado IN ('registrada', 'en_revision', 'aprobada', 'rechazada'))`
- `FOREIGN KEY (protesto_id) REFERENCES protestos(id)`
- `FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`
- `FOREIGN KEY (entidad_financiera_id) REFERENCES entidades_financieras(id)`

**Índices:**
- `idx_solicitudes_protesto_id` en `(protesto_id)`
- `idx_solicitudes_estado` en `(estado)`

---

### 3.6 `archivos`

Documentos cargados por los analistas como parte de una solicitud de levantamiento.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | `gen_random_uuid()` | Identificador |
| `solicitud_id` | `uuid` (FK) | NO | — | Solicitud asociada |
| `tipo` | `varchar(30)` | NO | — | Tipo de archivo |
| `nombre_archivo` | `varchar(255)` | NO | — | Nombre original del archivo |
| `ruta` | `varchar(500)` | NO | — | Ruta en Supabase Storage |
| `tamano_bytes` | `bigint` | SÍ | — | Tamaño del archivo |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de carga |
| `deleted_at` | `timestamptz` | SÍ | `NULL` | Soft delete |

**Constraints:**
- `CHECK (tipo IN ('comprobante_pago', 'formato_firmado'))`
- `FOREIGN KEY (solicitud_id) REFERENCES solicitudes_levantamiento(id)`

---

### 3.7 `auditoria`

Registro transversal de eventos del sistema. Tabla **append-only**.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | `gen_random_uuid()` | Identificador |
| `usuario_id` | `uuid` (FK) | NO | — | Usuario que ejecutó la acción |
| `entidad_financiera_id` | `uuid` (FK) | SÍ | — | Entidad del usuario (NULL para admin) |
| `accion` | `varchar(100)` | NO | — | Acción realizada |
| `entidad_afectada` | `varchar(100)` | SÍ | — | Tabla/entidad afectada |
| `entidad_afectada_id` | `uuid` | SÍ | — | ID del registro afectado |
| `descripcion` | `text` | SÍ | — | Detalle de la acción |
| `metadata` | `jsonb` | SÍ | — | Datos adicionales (cambios, IP, etc.) |
| `created_at` | `timestamptz` | NO | `now()` | Fecha del evento |

**Constraints:**
- `FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`
- `FOREIGN KEY (entidad_financiera_id) REFERENCES entidades_financieras(id)`

**Índices:**
- `idx_auditoria_usuario_id` en `(usuario_id)`
- `idx_auditoria_accion` en `(accion)`
- `idx_auditoria_created_at` en `(created_at)`

> **Nota:** Se eliminó `deleted_at`. Los registros de auditoría **nunca deben eliminarse**. Se agregaron `entidad_afectada`, `entidad_afectada_id` y `metadata` para trazabilidad más completa.

---

### 3.8 `importaciones_protestos`

Historial de cargas masivas de archivos Excel.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | `uuid` (PK) | NO | `gen_random_uuid()` | Identificador |
| `usuario_id` | `uuid` (FK) | NO | — | Administrador que realizó la importación |
| `nombre_archivo` | `varchar(255)` | NO | — | Nombre del archivo importado |
| `total_registros` | `integer` | NO | `0` | Filas procesadas |
| `registros_exitosos` | `integer` | NO | `0` | Registros importados correctamente |
| `registros_error` | `integer` | NO | `0` | Registros con error |
| `estado` | `varchar(20)` | NO | `'procesando'` | Estado de la importación |
| `errores_detalle` | `jsonb` | SÍ | — | Detalle de errores por fila |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de importación |

**Constraints:**
- `CHECK (estado IN ('procesando', 'completada', 'completada_con_errores', 'fallida'))`
- `FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`

> **Nota:** Se eliminó `deleted_at`. Las importaciones son registros históricos que no deben eliminarse. Se agregaron `estado` y `errores_detalle` para mejor trazabilidad.

---

## 4. Migración SQL

La migración debe ejecutarse con el CLI de Supabase y almacenarse en la carpeta `supabase/migrations/`.

### 4.1 Migración: Tablas núcleo

**Archivo:** `supabase/migrations/20260210_001_tablas_nucleo.sql`

```sql
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
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id            uuid         NOT NULL REFERENCES usuarios(id),
  entidad_financiera_id uuid         NOT NULL REFERENCES entidades_financieras(id),
  tipo_documento        varchar(5)   NOT NULL
                          CHECK (tipo_documento IN ('DNI', 'RUC')),
  numero_documento      varchar(11)  NOT NULL,
  resultados_encontrados integer     NOT NULL DEFAULT 0,
  fecha_consulta        timestamptz  NOT NULL DEFAULT now(),
  created_at            timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE consultas IS 'Auditoría de búsquedas realizadas por analistas (append-only)';

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

COMMENT ON TABLE auditoria IS 'Registro transversal de eventos del sistema (append-only)';
```

### 4.2 Migración: Índices

**Archivo:** `supabase/migrations/20260210_002_indices.sql`

```sql
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
```

### 4.3 Migración: Trigger de updated_at

**Archivo:** `supabase/migrations/20260210_003_trigger_updated_at.sql`

```sql
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
```

---

## 5. Diagrama de Relaciones (Resumen)

```
entidades_financieras (1) ──┬── (N) usuarios
                            ├── (N) consultas
                            └── (N) solicitudes_levantamiento

usuarios (1) ──┬── (N) consultas
               ├── (N) solicitudes_levantamiento
               ├── (N) auditoria
               └── (N) importaciones_protestos

importaciones_protestos (1) ── (N) protestos

protestos (1) ── (N) solicitudes_levantamiento

solicitudes_levantamiento (1) ── (N) archivos
```

---

## 6. Requerimientos Técnicos

- Base de datos **PostgreSQL** gestionada por Supabase.
- UUID como clave primaria en todas las tablas (`gen_random_uuid()`).
- Soft delete obligatorio en tablas transaccionales mediante `deleted_at`.
- Tablas de auditoría y consultas son **append-only** (sin `deleted_at`).
- Relaciones explícitas mediante claves foráneas.
- Estados controlados con `CHECK` constraints a nivel de base de datos.
- No eliminación física de registros históricos.
- Migraciones versionadas en `supabase/migrations/`, ejecutables con el CLI.
- Trigger automático para `updated_at`.
- Índices en campos de búsqueda y filtrado frecuente.

---

## 7. Requerimientos Funcionales

El modelo debe permitir:

- ✅ Asociar usuarios a entidades financieras (FK `entidad_financiera_id`).
- ✅ Registrar consultas realizadas por analistas con trazabilidad completa.
- ✅ Registrar protestos importados y gestionar su estado (`vigente` → `en_proceso` → `levantado`).
- ✅ Gestionar solicitudes de levantamiento sin perder historial (soft delete + auditoría).
- ✅ Asociar documentos (archivos) a solicitudes de levantamiento.
- ✅ Auditar todas las acciones relevantes del sistema con metadata enriquecida.
- ✅ Rastrear importaciones masivas con detalle de errores.
- ✅ El bloqueo lógico de una entidad debe impactar operativamente a sus usuarios (lógica de aplicación en Hito 3).
- ✅ Un protesto `levantado` no puede ser gestionado nuevamente (lógica de aplicación + constraint de estado).
- ✅ El historial de consultas y solicitudes es íntegro y consultable (append-only, sin eliminación).

---

## 8. Decisiones Técnicas y Notas

| Decisión | Justificación |
|----------|---------------|
| Se eliminó `password_hash` de `usuarios` | La autenticación la gestiona Supabase Auth |
| `usuarios.id` = `auth.users.id` | Asociación directa 1:1 sin tabla intermedia |
| `consultas` sin `deleted_at` | Son registros de auditoría, nunca deben eliminarse |
| `auditoria` sin `deleted_at` | Registros de trazabilidad, inmutables por definición |
| `importaciones_protestos` sin `deleted_at` | Historial de cargas, inmutable |
| Se agregó `resultados_encontrados` a `consultas` | Permite métricas en dashboard sin JOINs adicionales |
| Se agregó `observaciones` a `solicitudes_levantamiento` | El admin necesita comunicar feedback al analista |
| Se agregó `importacion_id` a `protestos` | Trazabilidad: saber de qué importación proviene cada protesto |
| Se agregó `metadata` (jsonb) a `auditoria` | Flexibilidad para registrar datos de contexto variables |
| Se agregó `errores_detalle` (jsonb) a `importaciones` | Detalle granular de errores por fila del Excel |
| Se agregó `nombre_archivo` y `tamano_bytes` a `archivos` | Mejor UX y control de almacenamiento |
| Se agregó `estado` a `importaciones_protestos` | Tracking del proceso de importación |
| Unique parciales con `WHERE deleted_at IS NULL` | Permite reutilizar emails/DNI después de soft delete |
| Trigger `update_updated_at_column` | Automatiza la actualización de timestamps |

---

## 9. Definition of Done (DoD)

- [ ] El esquema completo de base de datos está creado en Supabase.
- [ ] Las 8 tablas núcleo existen con todos sus campos definidos.
- [ ] Todas las relaciones y claves foráneas están correctamente implementadas.
- [ ] Todas las tablas transaccionales incluyen soft delete y campos de auditoría.
- [ ] Las tablas append-only (consultas, auditoría, importaciones) NO tienen `deleted_at`.
- [ ] Los estados definidos en el análisis funcional están reflejados como `CHECK` constraints.
- [ ] Los índices están creados para las consultas frecuentes del sistema.
- [ ] El trigger de `updated_at` funciona correctamente.
- [ ] Las 3 migraciones están creadas en `supabase/migrations/` y ejecutadas sin errores.
- [ ] El modelo ha sido validado contra los flujos principales del sistema.
- [ ] El modelo soporta los Hitos 3 a 7 sin cambios estructurales mayores.

---

## 10. Riesgos mitigados por este hito

- Inconsistencia en la estructura de datos que afecte hitos posteriores.
- Pérdida de datos históricos por eliminación física.
- Falta de trazabilidad por ausencia de campos de auditoría.
- Consultas lentas por falta de índices en campos críticos.
- Estados inválidos por falta de constraints a nivel de base de datos.
- Dificultad de debugging en importaciones por falta de detalle en errores.

---

> **Siguiente paso:** Una vez completado este hito, se procederá con el [Hito 3 – Autenticación y Gestión de Usuarios](./hito_3_autenticacion_y_gestion_de_usuarios.md), que implementará Supabase Auth y la lógica de acceso controlado sobre este modelo de datos.
