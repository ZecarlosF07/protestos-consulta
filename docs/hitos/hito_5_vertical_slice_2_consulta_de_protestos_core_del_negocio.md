## Objetivo del Hito

Implementar la **funcionalidad central del sistema**: la consulta de protestos por número de documento, permitiendo a los usuarios analistas acceder a información confiable, en tiempo real y bajo control institucional, con **auditoría obligatoria de cada consulta**.

Este hito valida el principal caso de uso del negocio y confirma que el sistema genera valor real para las entidades financieras.

---

## Tareas del Hito

1. Implementar el formulario único de búsqueda por número de documento.
2. Validar entrada numérica y longitud del documento.
3. Identificar automáticamente el tipo de documento:
   - DNI (8 dígitos)
   - RUC (11 dígitos)
4. Ejecutar la consulta contra la base de datos de protestos.
5. Mostrar resultados de la consulta:
   - Indicador de existencia o no de protestos
   - Nombre de la persona consultada
   - Número de documento
   - Entidad financiadora (girador)
   - Entidad fuente (EF)
   - Monto del protesto
   - Fecha del protesto
   - Estado del protesto
   - Tarifa de levantamiento
6. Mostrar mensaje informativo cuando no existan protestos.
7. Registrar automáticamente cada consulta en la tabla de consultas.
8. Registrar evento de auditoría asociado a la consulta.
9. Controlar que solo usuarios analistas activos puedan consultar.
10. Validar performance y tiempos de respuesta aceptables.

---

## Requerimientos Técnicos

- Frontend en React con renderizado client-side.
- Conexión directa a Supabase para consultas de lectura.
- Validaciones estrictas de entrada (DNI / RUC).
- Uso del modelo de datos definido en el Hito 2.
- Registro transaccional de la consulta y auditoría.
- Manejo de estados de carga, éxito y error.
- Mensajes de error genéricos para el usuario analista.
- Prevención de exposición de información sensible adicional.

---

## Requerimientos Funcionales

- El sistema debe permitir realizar consultas únicamente por número de documento.
- El usuario no selecciona el tipo de documento.
- Cada consulta realizada debe quedar registrada y auditada.
- Un usuario bloqueado no puede realizar consultas.
- El resultado de la consulta debe ser claro y legible.
- La información mostrada debe corresponder a la data oficial importada.
- Las consultas no deben modificar el estado de los protestos.

---

## Definition of Done (DoD)

- El formulario de consulta es funcional.
- El sistema identifica correctamente DNI y RUC.
- Los resultados se muestran correctamente cuando existen protestos.
- El mensaje informativo se muestra cuando no existen protestos.
- Cada consulta genera un registro en la tabla de consultas.
- Cada consulta genera un registro de auditoría.
- Solo usuarios autorizados pueden consultar.
- La funcionalidad es estable y usable por analistas.
- El sistema está listo para integrar el flujo de levantamiento del Hito 6.

---

> Este hito implementa el **corazón del sistema** y valida el modelo de negocio institucional.