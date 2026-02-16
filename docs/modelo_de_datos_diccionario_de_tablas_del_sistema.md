# Diccionario de Datos – Modelo de Base de Datos

## Consideraciones Generales

- Todas las tablas críticas implementan **Soft Delete** mediante el campo `deleted_at`.
- Ningún registro histórico se elimina físicamente.
- Se utilizan claves primarias tipo UUID.
- Se incluyen campos de auditoría básicos (`created_at`, `updated_at`).

---

## 1. entidades_financieras

Representa a los bancos y cajas afiliados al sistema.

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador único |
| nombre | varchar | Nombre de la entidad |
| estado | varchar | Activa / Bloqueada |
| created_at | timestamp | Fecha de creación |
| updated_at | timestamp | Última actualización |
| deleted_at | timestamp | Soft delete |

---

## 2. usuarios

Usuarios del sistema (administradores y analistas).

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador del usuario |
| email | varchar | Correo institucional |
| password_hash | varchar | Hash de contraseña |
| nombre_completo | varchar | Nombre completo |
| dni | varchar(8) | DNI del usuario |
| telefono | varchar | Teléfono |
| cargo | varchar | Cargo institucional |
| rol | varchar | ADMIN / ANALISTA |
| entidad_financiera_id | uuid (FK) | Entidad asociada |
| estado | varchar | Activo / Bloqueado |
| created_at | timestamp | Fecha de creación |
| updated_at | timestamp | Última actualización |
| deleted_at | timestamp | Soft delete |

---

## 3. protestos

Registro central de protestos importados.

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador |
| secuencia | varchar | Secuencia oficial |
| tipo_documento | varchar | DNI / RUC |
| numero_documento | varchar | Documento consultado |
| nombre_persona | varchar | Nombre completo |
| entidad_financiadora | varchar | Girador |
| entidad_fuente | varchar | EF (notaría u origen) |
| monto | numeric | Monto del protesto |
| fecha_protesto | date | Fecha del protesto |
| tarifa_levantamiento | numeric | Tarifa vigente |
| estado | varchar | Vigente / En proceso / Levantado |
| created_at | timestamp | Fecha de registro |
| updated_at | timestamp | Última actualización |
| deleted_at | timestamp | Soft delete |

---

## 4. consultas

Auditoría de búsquedas realizadas por analistas.

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador |
| usuario_id | uuid (FK) | Analista |
| entidad_financiera_id | uuid (FK) | Entidad |
| tipo_documento | varchar | DNI / RUC |
| numero_documento | varchar | Documento consultado |
| fecha_consulta | timestamp | Fecha y hora |
| created_at | timestamp | Registro |
| deleted_at | timestamp | Soft delete |

---

## 5. solicitudes_levantamiento

Solicitudes generadas para levantar protestos.

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador |
| protesto_id | uuid (FK) | Protesto asociado |
| usuario_id | uuid (FK) | Analista solicitante |
| entidad_financiera_id | uuid (FK) | Entidad |
| observaciones | text | Observaciones del administrador |
| tipo_comprobante | varchar | boleta / factura |
| requiere_certificado | boolean | Si requiere Certificado de Título Regularizado |
| estado | varchar | Registrada / En revisión / Aprobada / Rechazada |
| created_at | timestamp | Fecha de solicitud |
| updated_at | timestamp | Última actualización |
| deleted_at | timestamp | Soft delete |

---

## 6. archivos

Documentos cargados para solicitudes.

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador |
| solicitud_id | uuid (FK) | Solicitud asociada |
| tipo | varchar | comprobante_pago / formato_firmado / carta_no_adeudo / comprobante_certificado / certificado_emitido |
| nombre_archivo | varchar | Nombre original del archivo |
| ruta | varchar | Ruta en storage |
| tamano_bytes | bigint | Tamaño del archivo en bytes |
| created_at | timestamp | Fecha de carga |
| deleted_at | timestamp | Soft delete |

---

## 7. auditoria

Registro transversal de eventos del sistema.

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador |
| usuario_id | uuid (FK) | Usuario responsable |
| entidad_financiera_id | uuid (FK) | Entidad |
| accion | varchar | Acción realizada |
| descripcion | text | Detalle |
| created_at | timestamp | Fecha del evento |
| deleted_at | timestamp | Soft delete |

---

## 8. importaciones_protestos

Historial de cargas de Excel.

| Campo | Tipo | Descripción |
|-----|-----|-------------|
| id | uuid (PK) | Identificador |
| usuario_id | uuid (FK) | Administrador |
| nombre_archivo | varchar | Archivo importado |
| total_registros | integer | Filas procesadas |
| registros_exitosos | integer | Importados |
| registros_error | integer | Con error |
| created_at | timestamp | Fecha de importación |
| deleted_at | timestamp | Soft delete |

