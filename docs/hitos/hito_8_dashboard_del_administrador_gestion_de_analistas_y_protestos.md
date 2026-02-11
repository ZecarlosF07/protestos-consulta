## Objetivo del Hito

Completar el **Dashboard del Administrador** incorporando los **módulos faltantes de gestión de Analistas y Protestos**, permitiendo a la Cámara de Comercio ejercer control operativo total sobre usuarios, entidades y registros de protestos desde una única interfaz administrativa.

Este hito transforma el dashboard administrativo de informativo a **operativo y resolutivo**.

---

## Tareas del Hito

### Módulo de Gestión de Analistas

1. Implementar listado de usuarios analistas.
2. Mostrar información clave del analista:
   - Nombre completo
   - DNI
   - Email
   - Entidad financiera
   - Estado
3. Filtros por entidad financiera y estado.
4. Crear nuevos analistas desde el dashboard.
5. Editar datos básicos del analista.
6. Bloquear y desbloquear analistas.
7. Resetear contraseña de analistas.
8. Registrar acciones administrativas en auditoría.

### Módulo de Gestión de Protestos

9. Implementar listado administrativo de protestos.
10. Mostrar información clave del protesto:
    - Secuencia
    - Número de documento
    - Nombre
    - Entidad financiadora
    - Monto
    - Fecha
    - Estado
11. Filtros por estado, fecha y entidad financiadora.
12. Visualizar historial del protesto.
13. Cambiar estado del protesto (según reglas del negocio).
14. Bloquear acciones inválidas según estado.
15. Registrar cambios de estado en auditoría.

---

## Requerimientos Técnicos

- Acceso exclusivo para rol Administrador.
- Uso del modelo de datos existente sin cambios estructurales.
- Componentes reutilizables (tablas, filtros, modales).
- Paginación y filtros del lado del cliente o base de datos.
- Validaciones estrictas de estados.
- Registro obligatorio de auditoría por cada acción.
- Manejo de errores controlado y mensajes claros.

---

## Requerimientos Funcionales

- El Administrador debe poder:
  - Gestionar completamente a los analistas.
  - Controlar el estado operativo de los usuarios.
  - Visualizar y gestionar protestos existentes.
  - Cambiar estados respetando reglas del negocio.
- Las acciones administrativas deben impactar inmediatamente en la operación del sistema.
- Ninguna acción debe eliminar información histórica.

---

## Definition of Done (DoD)

- El dashboard del Administrador incluye módulos de Analistas y Protestos.
- Es posible crear, editar, bloquear y resetear analistas.
- Es posible listar y filtrar protestos.
- Los estados de protestos se gestionan correctamente.
- Todas las acciones quedan registradas en auditoría.
- El dashboard administrativo es completamente operativo.
- No se requieren cambios en el modelo de datos.

---

> Este hito completa el **control administrativo integral** del sistema y fortalece el rol institucional de la Cámara de Comercio.