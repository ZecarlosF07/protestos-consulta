# Hito 15 – Importación atómica de protestos y diagnóstico detallado de errores Excel

## Objetivo del hito

Corregir el flujo de importación de protestos para que los archivos Excel oficiales se procesen bajo una regla institucional de **todo o nada**: si el archivo contiene cualquier error, no se inserta ningún protesto; si todo el archivo es válido, se registra la importación completa.

Además, el sistema debe mostrar errores claros indicando **fila, columna, campo, valor observado y motivo del rechazo**, evitando mensajes genéricos de base de datos como `value too long for type character varying(20)`.

Este hito reemplaza el comportamiento de importación parcial por un flujo más seguro y auditable.

---

## Problemas identificados

Durante la importación de un Excel con cientos de registros se detectaron estos problemas:

1. El sistema permite importaciones parcialmente exitosas.
2. Si algunas filas fallan y otras se insertan, luego es difícil saber qué quedó realmente importado y qué debe corregirse.
3. Reintentar el mismo archivo puede generar duplicados por secuencia.
4. Algunos errores técnicos de Supabase/PostgreSQL no indican al usuario qué columna del Excel originó el problema.
5. La validación actual no cubre explícitamente todas las longitudes máximas de columnas de base de datos.
6. El estado `completada_con_errores` representaba una importación parcial y queda eliminado de la lógica activa.
7. La inserción fila por fila desde frontend no garantiza atomicidad si ocurre un error o corte durante el proceso.

---

## Tareas del hito

### 1. Definir la nueva regla de negocio de importación

1. Establecer que una importación oficial de protestos debe ser atómica.
2. Si existe al menos un error de estructura, formato, duplicado, longitud o dato inválido, la importación debe quedar como `fallida`.
3. Cuando la importación queda `fallida`, no debe insertarse ningún registro en `protestos`.
4. El estado `completada_con_errores` debe eliminarse de la lógica activa de importaciones.
5. Mantener el historial de importaciones para auditar intentos fallidos.

### 2. Mejorar validación previa del Excel

6. Revisar `src/features/admin/utils/importacion-excel.utils.js`.
7. Validar encabezados obligatorios antes de procesar filas.
8. Validar duplicados de `secuencia` dentro del propio archivo.
9. Validar secuencias ya existentes en base de datos antes de insertar.
10. Validar tipo y número de documento:
    - DNI: 8 dígitos.
    - RUC: 11 dígitos.
11. Validar fecha de protesto con formato aceptado.
12. Validar monto y tarifa como números válidos.
13. Validar que los campos obligatorios no estén vacíos.
14. Validar longitudes máximas antes de llegar a Supabase:
    - `secuencia`: máximo 50 caracteres.
    - `tipo_documento`: máximo 5 caracteres.
    - `numero_documento`: máximo 11 caracteres.
    - `nombre_persona`: máximo 255 caracteres.
    - `entidad_financiadora`: máximo 255 caracteres.
    - `entidad_fuente`: máximo 255 caracteres.
    - `tipo_valor`: máximo 50 caracteres.
15. Si un valor excede el límite, reportar el error indicando columna, campo y longitud permitida.

### 3. Reportar errores por fila y columna

16. Ampliar la estructura de errores de importación.
17. Cada error debe incluir:
    - número de fila del Excel
    - nombre de columna original si existe
    - campo interno normalizado
    - valor observado
    - mensaje claro
18. Mostrar errores en la UI de importación de manera legible.
19. Evitar mostrar errores crudos de PostgreSQL cuando puedan traducirse a una validación de negocio.
20. Mantener el número de secuencia en el error cuando esté disponible.

### 4. Implementar flujo todo o nada en frontend

21. Revisar `src/features/admin/hooks/useImportacionProtestos.js`.
22. Separar claramente la fase de validación de la fase de inserción.
23. Si la validación produce errores, registrar la importación como `fallida` y detener el proceso.
24. No ejecutar ningún insert en `protestos` si hay errores de validación.
25. Mostrar al administrador el resumen:
    - total de filas revisadas
    - registros válidos
    - registros con error
    - detalle de errores
26. Mantener auditoría del intento fallido.

### 5. Garantizar atomicidad real en base de datos

27. Crear una migración nueva en `supabase/migrations/`.
28. Implementar una RPC transaccional para insertar protestos de forma atómica.
29. La RPC debe recibir el `importacion_id` y el arreglo de registros validados.
30. La RPC debe insertar todos los registros dentro de una única transacción.
31. Si cualquier insert falla, la transacción completa debe revertirse.
32. La RPC debe validar internamente que el usuario ejecutor sea administrador.
33. La RPC no debe permitir inserciones parciales.
34. El frontend debe seguir siendo el punto de entrada de la importación y de la auditoría, pero la base de datos debe garantizar la atomicidad.

### 6. Ajustar estados de importación

35. Revisar los estados usados en `importaciones_protestos`.
36. Usar `procesando` al iniciar la carga.
37. Usar `completada` solo cuando todos los registros fueron insertados correctamente.
38. Usar `fallida` cuando el archivo tenga errores o falle la inserción transaccional.
39. Eliminar `completada_con_errores` de la lógica activa del frontend.
40. Ajustar el constraint de `importaciones_protestos.estado` para permitir solo `procesando`, `completada` y `fallida`.

### 7. Actualizar UI de resultado de importación

41. Revisar `src/features/admin/components/ImportacionResultadoCard.jsx`.
42. Mostrar claramente cuando un archivo fue rechazado completo.
43. Indicar que no se importó ningún registro cuando existan errores.
44. Mostrar tabla o listado de errores con fila, columna, campo y motivo.
45. Evitar que el administrador interprete una importación fallida como parcialmente aplicada.

### 8. Actualizar documentación técnica

46. Actualizar el hito 7 o el documento de modelo de datos si corresponde.
47. Documentar que las importaciones oficiales son atómicas.
48. Documentar que la importación parcial queda descontinuada para el flujo operativo.
49. Documentar los límites de longitud relevantes para el Excel.
50. Documentar la RPC o mecanismo transaccional usado para garantizar todo o nada.

---

## Requerimientos funcionales

- El administrador puede subir un archivo Excel de protestos.
- El sistema valida todo el archivo antes de insertar datos.
- Si existe cualquier error, no se inserta ningún protesto.
- Si el archivo es completamente válido, se insertan todos los registros.
- El administrador ve un resumen claro del resultado.
- Los errores indican fila, columna, campo y motivo.
- Los errores por longitud de campo se muestran antes de llegar a un error crudo de base de datos.
- Las secuencias duplicadas dentro del archivo bloquean toda la importación.
- Las secuencias ya existentes en base de datos bloquean toda la importación.
- El intento de importación queda registrado aunque falle.
- La auditoría registra importaciones exitosas y fallidas.

---

## Requerimientos técnicos

- Mantener React + Supabase como arquitectura actual.
- Mantener JavaScript con JSDoc; no migrar a TypeScript.
- El frontend debe seguir siendo el punto de inicio de la importación.
- La atomicidad real debe resolverse con una operación transaccional en Supabase.
- Las migraciones nuevas deben vivir en `supabase/migrations/`.
- Las RPC sensibles deben validar internamente que el usuario sea administrador.
- La UI no debe depender de mensajes crudos de PostgreSQL para explicar errores de Excel.
- Las validaciones deben centralizarse para evitar reglas duplicadas e inconsistentes.
- El proyecto debe compilar usando Yarn.

---

## Archivos esperados a revisar o modificar

- `src/features/admin/utils/importacion-excel.utils.js`
- `src/features/admin/hooks/useImportacionProtestos.js`
- `src/features/admin/services/importacion.service.js`
- `src/features/admin/types/importacion.types.js`
- `src/features/admin/components/ImportacionResultadoCard.jsx`
- `src/features/admin/components/ImportacionesHistorialTable.jsx`
- `supabase/migrations/`
- `docs/hitos/hito_7_importacion_de_protestos_via_excel.md`
- `docs/modelo_de_datos_diccionario_de_tablas_del_sistema.md`

---

## Definition of Done

El hito se considera completado cuando:

- `yarn lint` finaliza sin errores.
- `yarn build` finaliza correctamente.
- Un Excel completamente válido importa todos sus registros.
- Un Excel con un solo error no inserta ningún protesto.
- Un Excel con secuencias duplicadas dentro del archivo no inserta ningún protesto.
- Un Excel con secuencias ya existentes en base de datos no inserta ningún protesto.
- Un Excel con un campo demasiado largo muestra el campo y la columna que fallaron.
- Los errores de importación muestran fila, columna, campo, valor observado y mensaje.
- La importación fallida queda registrada en `importaciones_protestos`.
- La importación exitosa queda registrada en `importaciones_protestos`.
- La auditoría registra el intento de importación fallido.
- La auditoría registra la importación exitosa.
- La inserción de protestos se realiza de forma atómica.
- No existe un escenario donde el sistema reporte falla y deje registros parcialmente insertados.
- El administrador puede corregir el Excel y reintentar sin chocar con datos importados parcialmente.
- La documentación refleja que la importación operativa es todo o nada.

---

## Nota final

Este hito prioriza integridad operativa sobre flexibilidad. En un sistema institucional de protestos, es preferible rechazar un archivo completo con errores claros que aceptar una carga parcial difícil de auditar y reconciliar.
