# Hito 16 – Módulo administrativo de exportación segura de protestos vigentes y levantados

## Objetivo del hito

Implementar un módulo exclusivamente administrativo para exportar protestos según una opción controlada de estado: **vigentes** o **levantados**, permitiendo a la Cámara de Comercio generar archivos de respaldo o trabajo operativo sin exponer protestos en proceso ni datos fuera del corte seleccionado.

Por tratarse de una exportación sensible, este hito debe incorporar controles de seguridad, auditoría y confirmación antes de entregar el archivo al administrador.

---

## Problemas o riesgos identificados

1. La exportación de protestos puede exponer información sensible de personas y entidades.
2. Un archivo exportado puede circular fuera del sistema sin control.
3. Exportar estados incorrectos o mezclar vigentes con levantados puede generar confusión operativa.
4. Un botón de descarga sin confirmación puede provocar exportaciones accidentales.
5. Si no queda auditoría, no se puede saber quién exportó, cuándo y cuántos registros descargó.
6. Si la exportación depende solo de filtros del frontend, un usuario no autorizado podría intentar forzar consultas desde la API.
7. Una exportación masiva puede afectar rendimiento si no se controla la consulta.

---

## Tareas del hito

### 1. Definir alcance de datos exportables

1. Permitir que el administrador elija el tipo de exportación:
   - protestos vigentes
   - protestos levantados
2. Exportar únicamente registros de `protestos` cuyo estado coincida con la opción seleccionada.
3. Excluir registros con `deleted_at IS NOT NULL`.
4. No exportar protestos en estado `en_proceso`.
5. No mezclar protestos vigentes y levantados en el mismo archivo.
6. Definir columnas permitidas para el archivo:
   - secuencia
   - tipo documento
   - número documento
   - nombre o razón social
   - entidad financiadora
   - entidad fuente
   - monto
   - fecha de protesto
   - tarifa de levantamiento
   - tipo de valor
7. Evitar incluir campos técnicos internos innecesarios como `id`, `importacion_id`, `created_at`, `updated_at` o `deleted_at`.

### 2. Crear acceso administrativo al módulo

8. Agregar una ruta exclusiva para administrador.
9. Agregar una opción en la navegación administrativa.
10. Bloquear acceso visual y funcional a usuarios analistas.
11. Reutilizar `ProtectedRoute` y la configuración de roles existente.
12. Mostrar el módulo solo dentro del layout administrativo.

### 3. Implementar servicio de exportación segura

13. Crear un servicio de exportación dentro de `src/features/admin/services/` o un submódulo específico.
14. Consultar únicamente protestos del estado seleccionado desde Supabase.
15. Aplicar paginación interna o consulta por rangos si el volumen crece.
16. Generar archivo Excel usando la dependencia actual `xlsx`.
17. Usar nombre de archivo descriptivo, por ejemplo:
    - `protestos_vigentes_YYYY-MM-DD.xlsx`
    - `protestos_levantados_YYYY-MM-DD.xlsx`
18. Incluir una hoja única con datos normalizados.
19. Formatear montos y fechas de forma consistente.

### 4. Endurecer seguridad en base de datos

20. Crear una RPC administrativa para exportación o conteo previo, si corresponde.
21. La RPC debe validar internamente `is_admin()`.
22. La consulta no debe depender únicamente de que el frontend filtre el estado.
23. La RPC o servicio debe limitar el resultado a:
    - `estado IN ('vigente', 'levantado')`
    - estado exacto seleccionado por el administrador
    - `deleted_at IS NULL`
24. La RPC debe rechazar cualquier estado no permitido, incluyendo `en_proceso`.
25. Revocar permisos públicos de cualquier RPC sensible.
26. Conceder ejecución solo al rol `authenticated`.
27. Confirmar que un analista no pueda obtener la exportación mediante llamada directa.

### 5. Agregar controles de confirmación

28. Antes de descargar, mostrar un modal de confirmación.
29. El modal debe indicar:
    - estado seleccionado para exportar
    - cantidad estimada de protestos a exportar
    - fecha y hora de generación
    - advertencia de confidencialidad
30. Requerir que el administrador confirme explícitamente la descarga.
31. Opcionalmente solicitar un motivo de exportación.
32. No iniciar la descarga hasta que el administrador confirme.

### 6. Registrar auditoría obligatoria

33. Registrar auditoría antes o inmediatamente después de generar el archivo.
34. Usar una acción específica, por ejemplo `EXPORTAR_PROTESTOS`.
35. Registrar en metadata:
    - cantidad de registros exportados
    - nombre del archivo
    - fecha de corte
    - estado exportado (`vigente` o `levantado`)
    - motivo de exportación, si aplica
    - filtros aplicados, aunque sean fijos
36. Si la exportación falla, registrar o mostrar el error de forma explícita.
37. El evento debe quedar visible en el módulo de auditoría.

### 7. Proteger el archivo generado

38. Generar el archivo en memoria desde el navegador y no almacenarlo permanentemente en Storage, salvo que exista una razón operativa.
39. Si se decide almacenar el archivo, usar un bucket privado y URLs firmadas de corta duración.
40. No dejar archivos exportados públicamente accesibles.
41. Evitar incluir datos fuera del alcance definido.
42. Mostrar advertencia visual de confidencialidad en la pantalla del módulo.

### 8. Mejorar experiencia administrativa

43. Mostrar un resumen antes de exportar:
    - estado seleccionado
    - total de protestos encontrados
    - fecha del último protesto del estado seleccionado
    - monto total del estado seleccionado, si aplica
44. Agregar estado de carga durante la generación.
45. Bloquear doble clic o múltiples exportaciones simultáneas.
46. Mostrar resultado exitoso o error claro.
47. Mantener una UI sobria y administrativa.

### 9. Actualizar documentación

48. Documentar que solo el administrador puede exportar protestos.
49. Documentar que la exportación permite elegir entre vigentes o levantados.
50. Documentar que la exportación no incluye protestos en proceso.
51. Documentar el evento de auditoría `EXPORTAR_PROTESTOS`.
52. Documentar la estrategia de seguridad elegida:
    - RPC con validación admin
    - auditoría obligatoria
    - confirmación explícita
    - no almacenamiento público del archivo

---

## Requerimientos funcionales

- El administrador puede acceder al módulo de exportación.
- El analista no puede ver ni acceder al módulo.
- El administrador puede elegir exportar protestos vigentes o protestos levantados.
- El sistema exporta únicamente protestos del estado seleccionado.
- El sistema excluye protestos en proceso y eliminados lógicamente.
- El sistema no mezcla vigentes y levantados en el mismo archivo.
- El administrador ve un resumen antes de descargar.
- El administrador debe confirmar la exportación.
- El sistema genera un archivo Excel descargable.
- La exportación queda registrada en auditoría.
- La auditoría registra quién exportó, cuándo, qué estado exportó y cuántos registros fueron exportados.
- El sistema evita múltiples exportaciones simultáneas desde la misma pantalla.

---

## Requerimientos técnicos

- Mantener React + Supabase como arquitectura actual.
- Mantener JavaScript con JSDoc; no migrar a TypeScript.
- Usar la dependencia existente `xlsx` para generar el archivo.
- Crear services o hooks separados para la lógica de exportación.
- Mantener componentes pequeños y reutilizar componentes existentes.
- Validar permisos en frontend y en backend/RPC.
- La exportación debe usar filtros seguros desde backend o RPC y permitir solo estados autorizados.
- Registrar auditoría mediante el servicio existente de auditoría.
- No almacenar archivos exportados públicamente.
- El proyecto debe compilar usando Yarn.

---

## Archivos esperados a revisar o modificar

- `src/config/routes.js`
- `src/config/navigation.js`
- `src/app/Router.jsx`
- `src/features/admin/components/AdminLayout.jsx`
- `src/features/admin/components/`
- `src/features/admin/hooks/`
- `src/features/admin/services/`
- `src/features/admin/types/`
- `src/services/supabase/audit.service.js`
- `supabase/migrations/`
- `docs/modelo_de_datos_diccionario_de_tablas_del_sistema.md`

---

## Definition of Done

El hito se considera completado cuando:

- `yarn lint` finaliza sin errores.
- `yarn build` finaliza correctamente.
- El administrador puede acceder al módulo de exportación.
- El analista no puede acceder al módulo por navegación ni por ruta directa.
- Un analista no puede ejecutar la RPC o consulta de exportación desde la API.
- La exportación permite elegir únicamente `vigente` o `levantado`.
- La exportación contiene únicamente protestos del estado seleccionado.
- La exportación excluye protestos con `deleted_at IS NOT NULL`.
- La exportación no incluye protestos `en_proceso`.
- La exportación no mezcla protestos vigentes y levantados.
- El archivo Excel se genera correctamente.
- El archivo contiene solo columnas permitidas.
- El administrador debe confirmar antes de descargar.
- La UI bloquea múltiples exportaciones simultáneas.
- Cada exportación queda registrada en `auditoria`.
- La auditoría incluye cantidad de registros, nombre de archivo, fecha de corte y estado exportado.
- No se almacenan archivos exportados en un bucket público.
- La documentación queda actualizada con el flujo y controles de seguridad.

---

## Nota final

Este hito debe tratarse como una función sensible. La exportación de protestos vigentes o levantados puede ser necesaria para operación o respaldo, pero debe quedar limitada, confirmada y auditada para reducir riesgos de exposición, mezcla de estados o uso indebido de información.
