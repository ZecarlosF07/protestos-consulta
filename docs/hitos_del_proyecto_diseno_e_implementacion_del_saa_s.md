# Hitos del Proyecto – Plan de Implementación

Este documento define los **7 hitos oficiales** del proyecto y será utilizado como guía para el equipo de desarrollo. Cada hito representa un entregable funcional y validable, siguiendo un enfoque **data‑first, incremental y orientado a vertical slices**, adecuado para un SaaS institucional.

---

## HITO 1 – Congelamiento del dominio y reglas del negocio

**Objetivo:**
Asegurar que todo el equipo tenga una comprensión única y cerrada del problema, los actores y las reglas del sistema antes de escribir código.

**Alcance:**
- Definición final de roles: Administrador de la Cámara y Analista.
- Confirmación de que no existe registro público.
- Definición de flujos principales (consulta, auditoría, levantamiento, importación).
- Estados del protesto y reglas de cambio de estado.
- Reglas de auditoría y control.

**Entregable:**
- Documento de análisis funcional validado.
- Diagramas de flujo y navegación aprobados.

---

## HITO 2 – Modelo de datos base (núcleo del sistema)

**Objetivo:**
Construir una base de datos sólida que represente correctamente el dominio del negocio y sirva como columna vertebral del sistema.

**Alcance:**
- Diseño e implementación de las tablas núcleo:
  - Usuarios
  - Roles
  - Entidades financieras
  - Protestos
  - Auditoría
- Definición de relaciones y claves foráneas.
- Implementación de soft delete en todas las tablas.
- Definición de estados y campos obligatorios.

**Entregable:**
- Esquema de base de datos funcional en Supabase.
- Migraciones base creadas.

---

## HITO 3 – Autenticación y gestión de usuarios

**Objetivo:**
Garantizar un acceso seguro, controlado y trazable al sistema.

**Alcance:**
- Integración de Supabase Auth.
- Asociación entre auth.users y la tabla de usuarios del sistema.
- Creación de usuarios únicamente por el Administrador.
- Estados de usuario: activo y bloqueado.
- Redirección automática según rol.

**Entregable:**
- Login funcional.
- Protección de rutas por rol.
- Sesión persistente.

---

## HITO 4 – Vertical Slice 1: Login y dashboards base

**Objetivo:**
Validar el flujo completo de acceso y navegación inicial del sistema.

**Alcance:**
- Dashboard del Administrador (estructura base).
- Dashboard del Analista (estructura base).
- Layouts diferenciados por rol.
- Navegación protegida.

**Entregable:**
- Aplicación navegable de extremo a extremo.
- Dashboards operativos aunque sin lógica de negocio avanzada.

---

## HITO 5 – Vertical Slice 2: Consulta de protestos (core del negocio)

**Objetivo:**
Implementar la funcionalidad principal del sistema: la consulta de protestos.

**Alcance:**
- Búsqueda por número de documento (DNI o RUC, identificación automática).
- Visualización de resultados en tiempo real.
- Mostrar datos del protesto:
  - Persona consultada
  - Entidad financiadora
  - Monto
  - Estado
- Registro automático de auditoría por cada consulta.

**Entregable:**
- Sistema usable para analistas.
- Consultas auditadas y trazables.

---

## HITO 6 – Auditoría y levantamiento de protestos

**Objetivo:**
Agregar control institucional y flujo de resolución de protestos.

**Alcance:**
- Dashboard de auditoría para el Administrador.
- Métricas básicas (top analistas, número de consultas).
- Flujo de levantamiento de protesto:
  - Cambio de estado
  - Subida de documentos
  - Registro de la acción
- Visualización de solicitudes.

**Entregable:**
- Trazabilidad completa de acciones.
- Flujo mínimo de levantamiento operativo.

---

## HITO 7 – Importación de protestos vía Excel

**Objetivo:**
Permitir la actualización masiva de información oficial proveniente de la Cámara de Comercio de Lima.

**Alcance:**
- Carga de archivo Excel por el Administrador.
- Validación de estructura y encabezados.
- Inserción únicamente de protestos nuevos.
- Registro de errores y resultados de importación.

**Entregable:**
- Módulo de importación funcional.
- Sistema actualizado con nueva data oficial.

---

## Nota final

Cada hito es **independiente pero acumulativo**. El proyecto puede validarse funcionalmente al finalizar cada uno, reduciendo riesgos, retrabajo y deuda técnica.

Este roadmap debe usarse como referencia oficial para planificación, estimación y seguimiento del desarrollo.

