## Objetivo del Hito

Permitir la **actualización masiva y controlada** de la base de datos de protestos mediante la importación de archivos Excel oficiales, garantizando **integridad de la información, trazabilidad del proceso y control institucional** por parte de la Cámara de Comercio.

Este hito asegura que el sistema se mantenga actualizado con data oficial sin comprometer la consistencia histórica.

---

## Tareas del Hito

1. Implementar interfaz administrativa para carga de archivos Excel.
2. Restringir la funcionalidad exclusivamente al rol Administrador.
3. Validar estructura del archivo Excel:
   - Encabezados esperados
   - Tipos de datos
4. Validar el archivo completo antes de insertar datos.
5. Ignorar campos no relevantes definidos en el análisis (IdSec, TPG).
6. Validar campos obligatorios del protesto:
   - Secuencia
   - Número de documento
   - Entidad financiadora
   - Entidad fuente
   - Monto
   - Fecha de protesto
7. Prevenir duplicados mediante validación por secuencia.
8. Insertar únicamente protestos nuevos.
9. Registrar errores de importación y rechazar el archivo completo si existe cualquier error.
10. Registrar el resultado de cada importación.
11. Generar registros de auditoría asociados a la carga.

---

## Requerimientos Técnicos

- Procesamiento de archivos Excel desde el frontend o API protegida.
- Validación estricta de encabezados y formato.
- Inserción controlada en la tabla de protestos.
- Prevención de duplicados a nivel de lógica de aplicación.
- Registro en tabla de importaciones de protestos.
- Registro de auditoría por cada proceso de carga.
- Manejo de errores por fila, columna, campo y valor observado.
- Inserción atómica de protestos: todo el archivo se importa o no se importa ningún registro.
- Mensajes claros de resultado de importación para el Administrador.

---

## Requerimientos Funcionales

- Solo el Administrador puede importar protestos.
- El sistema debe permitir cargar únicamente archivos Excel válidos.
- Los protestos existentes no deben ser sobrescritos.
- El sistema debe mostrar:
  - Total de registros procesados
  - Registros importados correctamente
  - Registros con error
- Los errores deben ser informativos y revisables.
- Si existe cualquier error, no debe insertarse ningún protesto.
- La información importada debe quedar disponible inmediatamente para consultas.

---

## Definition of Done (DoD)

- El Administrador puede cargar archivos Excel.
- El sistema valida correctamente la estructura del archivo.
- Solo se insertan protestos nuevos.
- Los duplicados rechazan la importación completa.
- Los errores de filas detienen la importación completa antes de insertar datos.
- El resultado de la importación queda registrado.
- El proceso genera registros de auditoría.
- Los nuevos protestos pueden consultarse desde el Hito 5.
- El MVP queda funcionalmente completo.

---

> Este hito cierra el **ciclo operativo del MVP**, asegurando actualización continua de la información oficial.
>
> **Actualización operativa:** El Hito 15 reemplaza la importación parcial por una importación atómica. Desde ese ajuste, un archivo con errores queda rechazado completo para evitar cargas parciales difíciles de auditar.
