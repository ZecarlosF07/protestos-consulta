## Objetivo del Hito

Implementar un **acceso seguro, controlado y trazable** al sistema, garantizando que únicamente usuarios autorizados por la Cámara de Comercio puedan operar, y que cada acción quede correctamente asociada a una identidad, rol y entidad financiera.

Este hito habilita el uso real del sistema y sienta las bases para la auditoría institucional.

---

## Tareas del Hito

1. Integrar Supabase Auth como mecanismo único de autenticación.
2. Configurar login mediante email y contraseña.
3. Asociar la tabla `auth.users` de Supabase con la tabla `usuarios` del sistema.
4. Implementar la creación de usuarios **exclusivamente por el Administrador**.
5. Definir y aplicar roles del sistema:
   - Administrador de la Cámara de Comercio
   - Usuario Analista
6. Implementar estados de usuario:
   - Activo
   - Bloqueado
7. Validar estado del usuario en cada inicio de sesión.
8. Implementar redirección automática post‑login según rol.
9. Proteger rutas y vistas según rol del usuario.
10. Registrar eventos relevantes en la tabla de auditoría:
    - Inicio de sesión
    - Intentos de acceso bloqueados

---

## Requerimientos Técnicos

- Uso de Supabase Auth (email / password).
- Sin funcionalidad de auto‑registro.
- Asociación 1‑a‑1 entre `auth.users.id` y `usuarios.id`.
- Control de permisos implementado en la lógica de aplicación.
- Manejo de sesión persistente.
- Validación de estado del usuario antes de permitir acceso.
- Middleware o guards para protección de rutas.
- Registro de auditoría para eventos de autenticación.
- Mensajes de error genéricos para analistas.

---

## Requerimientos Funcionales

- Solo usuarios creados por el Administrador pueden iniciar sesión.
- Un usuario bloqueado no puede acceder al sistema.
- El bloqueo de una entidad financiera bloquea operativamente a todos sus analistas.
- El Administrador accede a vistas administrativas.
- El Analista accede únicamente a vistas operativas.
- No existe recuperación de contraseña pública (reset solo administrativo).
- Cada inicio de sesión queda auditado.

---

## Definition of Done (DoD)

- El login es funcional y estable.
- Supabase Auth está integrado correctamente.
- Los usuarios pueden iniciar sesión solo si están activos.
- No existe flujo de auto‑registro.
- Las rutas están protegidas según rol.
- La sesión se mantiene activa entre recargas.
- Los accesos bloqueados son rechazados correctamente.
- Los eventos de autenticación se registran en auditoría.
- El sistema permite continuar con los dashboards del Hito 4 sin cambios estructurales.

---

> Este hito no incluye dashboards completos ni lógica de negocio avanzada. Su propósito es **habilitar el acceso controlado y trazable al sistema**.

