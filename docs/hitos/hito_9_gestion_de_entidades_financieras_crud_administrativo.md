## Objetivo del Hito

Implementar un **CRUD completo de Entidades Financieras** dentro del Dashboard del Administrador, permitiendo a la Cámara de Comercio **registrar, administrar y controlar** las entidades que operan en el sistema, asegurando coherencia operativa, control institucional y trazabilidad total.

Este hito consolida el control jerárquico del sistema: **Entidad → Analistas → Operación**.

---

## Tareas del Hito

1. Implementar listado administrativo de entidades financieras.
2. Mostrar información clave de cada entidad:
   - Nombre de la entidad
   - Estado (Activa / Bloqueada)
   - Fecha de creación
3. Implementar creación de nuevas entidades financieras.
4. Implementar edición del nombre de la entidad.
5. Implementar bloqueo y desbloqueo de entidades financieras.
6. Aplicar impacto automático del bloqueo:
   - Bloqueo operativo de todos los analistas asociados
7. Prevenir eliminación física de entidades (soft delete).
8. Implementar validaciones para evitar duplicados por nombre.
9. Registrar todas las acciones administrativas en auditoría.
10. Reflejar cambios en tiempo real en los módulos dependientes (analistas, consultas).

---

## Requerimientos Técnicos

- Acceso exclusivo para rol Administrador.
- Uso de la tabla `entidades_financieras` existente.
- Implementación de soft delete mediante `deleted_at`.
- Relaciones íntegras con la tabla de usuarios.
- Validaciones de unicidad a nivel de lógica de aplicación.
- Registro obligatorio de auditoría por cada acción.
- Manejo de errores controlado y mensajes claros.

---

## Requerimientos Funcionales

- El Administrador debe poder:
  - Crear nuevas entidades financieras.
  - Editar entidades existentes.
  - Bloquear y desbloquear entidades.
  - Visualizar el estado operativo de cada entidad.
- Una entidad bloqueada:
  - No puede operar en el sistema.
  - Bloquea automáticamente a todos sus analistas.
- Ninguna entidad puede eliminar información histórica.
- Las entidades deben estar disponibles para asignación al crear analistas.

---

## Definition of Done (DoD)

- El dashboard del Administrador incluye el módulo de Entidades Financieras.
- Es posible crear, editar y bloquear entidades financieras.
- El bloqueo impacta automáticamente a los analistas asociados.
- No existe eliminación física de entidades.
- Todas las acciones quedan registradas en auditoría.
- El módulo se integra sin cambios al modelo de datos existente.
- El control jerárquico del sistema queda completamente operativo.

---

> Este hito completa el **control administrativo estructural del sistema**, dejando el MVP institucional totalmente gobernable.