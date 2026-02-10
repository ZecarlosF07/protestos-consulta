## Objetivo del Hito

Incorporar **control institucional y trazabilidad completa** sobre el uso del sistema, habilitando el **flujo mínimo de levantamiento de protestos** y proporcionando al Administrador herramientas de auditoría y supervisión.

Este hito consolida el rol de la Cámara de Comercio como ente administrador, garante de control y transparencia.

---

## Tareas del Hito

1. Implementar dashboard de auditoría para el Administrador.
2. Visualizar métricas básicas de uso del sistema:
   - Total de consultas realizadas
   - Consultas por entidad financiera
   - Consultas por analista
   - Top 10 analistas con mayor número de consultas
3. Implementar listado centralizado de solicitudes de levantamiento.
4. Habilitar el inicio del levantamiento desde una consulta con protestos vigentes.
5. Implementar acciones del Analista:
   - Descargar formato oficial de levantamiento
   - Subir comprobante de pago
   - Subir formato de levantamiento firmado
6. Registrar solicitudes de levantamiento con estado inicial.
7. Implementar gestión administrativa de solicitudes:
   - Revisión de documentos
   - Cambio de estado de la solicitud
   - Cambio de estado del protesto
8. Controlar transiciones válidas de estados.
9. Registrar en auditoría todas las acciones relevantes.
10. Validar concurrencia de solicitudes desde múltiples entidades.

---

## Requerimientos Técnicos

- Uso del modelo de datos definido en el Hito 2.
- Manejo de estados explícitos:
  - Estados del protesto: Vigente / En proceso / Levantado
  - Estados de la solicitud: Registrada / En revisión / Aprobada / Rechazada
- Control de permisos por rol para cada acción.
- Manejo de carga de archivos con validaciones:
  - Tipos permitidos
  - Tamaño máximo
- Asociación de archivos a solicitudes.
- Persistencia segura de documentos.
- Cálculo de métricas a partir de datos auditados.
- Manejo de errores controlado.

---

## Requerimientos Funcionales

- El Administrador debe poder:
  - Visualizar métricas globales de uso.
  - Acceder a un listado completo de solicitudes.
  - Revisar documentación cargada.
  - Aprobar o rechazar solicitudes.
  - Cambiar el estado de los protestos.
- El Analista debe poder:
  - Iniciar levantamientos solo cuando existan protestos vigentes.
  - Subir documentación requerida.
- Un protesto levantado no puede volver a gestionarse.
- Las solicitudes no eliminan información histórica.
- Todas las acciones deben quedar auditadas.

---

## Definition of Done (DoD)

- El dashboard de auditoría es visible y funcional para el Administrador.
- Las métricas se muestran correctamente.
- El Analista puede iniciar solicitudes de levantamiento.
- Los documentos pueden cargarse y asociarse a solicitudes.
- El Administrador puede gestionar el estado de solicitudes y protestos.
- Las transiciones de estado están controladas y validadas.
- Todas las acciones generan registros de auditoría.
- El flujo completo de levantamiento es operativo.
- El sistema queda listo para la importación masiva del Hito 7.

---

> Este hito introduce el **control institucional completo** y cierra el ciclo operativo del sistema.