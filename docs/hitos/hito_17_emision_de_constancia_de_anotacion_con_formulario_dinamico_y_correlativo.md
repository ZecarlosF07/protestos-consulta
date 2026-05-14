# Hito 17 – Emisión de Constancia de Anotación con formulario dinámico y correlativo

## Objetivo del hito

Implementar el flujo administrativo para emitir la **Constancia de Anotación de Títulos Valores en Mora** usando la plantilla `CONST-ANOTACION.pdf`, permitiendo que el administrador complete los datos requeridos en un formulario, genere el documento con su correlativo correspondiente y descargue el PDF final.

Este hito se enfoca únicamente en la constancia de anotación. No incluye flujo de aprobación dentro del sistema, ya que la validación por alta dirección ocurre fuera de la aplicación.

---

## Contexto funcional

La constancia de anotación no se genera a partir de protestos ya existentes en la base de datos. Es un documento cuya información se ingresa al momento de la emisión, con datos nuevos relacionados al título valor en mora.

El sistema debe agilizar la emisión del documento, reduciendo el trabajo manual sobre el PDF y manteniendo el control de correlativos, historial y auditoría ya existente en el módulo de formatos.

---

## Problemas o riesgos identificados

1. Actualmente el módulo de formatos inserta principalmente el correlativo, pero no completa los datos propios del documento.
2. Llenar el PDF manualmente fuera del sistema puede generar errores de transcripción.
3. La constancia contiene campos con espacios reducidos y líneas específicas que requieren control exacto de ubicación.
4. El bloque del deudor no debe comportarse como un texto libre multilínea, porque cada línea tiene un significado distinto.
5. El correlativo debe seguir siendo automático, único y no reutilizable.
6. El documento emitido debe quedar registrado en historial y auditoría.
7. No debe agregarse un flujo de aprobación dentro del sistema.

---

## Tareas del hito

### 1. Definir el flujo funcional de emisión

1. Mantener la emisión dentro del módulo administrativo de formatos.
2. Permitir seleccionar el formato `CONST-ANOTACION`.
3. Al generar este formato, abrir un formulario específico para constancia de anotación.
4. No solicitar aprobación interna dentro del sistema.
5. Permitir descargar el PDF generado con la información ingresada.
6. Registrar el documento emitido en el historial de `documentos_emitidos`.
7. Registrar auditoría de la generación.

### 2. Crear formulario específico para Constancia de Anotación

8. Crear un formulario propio para `CONST-ANOTACION`.
9. Mantener componentes pequeños y separados.
10. Validar campos obligatorios antes de generar el PDF.
11. Mostrar errores claros por campo.
12. Mantener una UI sobria y administrativa.

### 3. Definir campos del formulario

13. Incluir los siguientes campos obligatorios:
    - `denominacion_titulo`
    - `lugar_fecha_emision_titulo`
    - `lugar_pago`
    - `clase_serie_numero_titulo`
    - `vencimiento`
    - `monto_moneda`
    - `deudor_documento`
    - `deudor_nombre_completo`
    - `deudor_domicilio`
    - `acreedor_titular_beneficiario`
    - `fecha_anotacion_dia`
    - `fecha_anotacion_mes`
    - `fecha_anotacion_anio`
    - `comprobantes_pago`
14. Incluir los siguientes campos opcionales:
    - `garantes_aval`
    - `endosatario_cesionario`
    - `otros_datos_adicionales`
15. No agrupar el bloque del deudor como un único `textarea`.
16. Separar el bloque del deudor en tres campos distintos:
    - documento de identidad
    - nombres completos o razón social
    - domicilio

### 4. Renderizar correctamente el bloque del deudor

17. El campo visual “Deudor u obligado, documento de identidad y domicilio” debe renderizarse en tres líneas fijas.
18. La primera línea debe contener únicamente el documento, por ejemplo:
    - `DNI N° 43134781`
    - `RUC N° 20481234567`
19. La segunda línea debe contener los nombres completos o razón social.
20. La tercera línea debe contener la dirección de domicilio.
21. Cada línea debe tener coordenada inicial propia.
22. No usar centrado automático para este bloque.
23. Usar coordenadas de inicio del texto, no coordenadas al centro del campo.
24. Definir `maxWidth`, `fontSize`, `minFontSize` y `shrinkToFit` por línea.

### 5. Configurar posiciones de campos en la plantilla PDF

25. Usar la plantilla `public/templates/CONST-ANOTACION.pdf`.
26. Crear una configuración de campos y posiciones para `CONST-ANOTACION`.
27. Cada campo debe tener:
    - página
    - coordenada `x`
    - coordenada `y`
    - ancho máximo
    - tamaño de fuente
    - tamaño mínimo de fuente cuando aplique
    - comportamiento de ajuste
28. El correlativo debe insertarse en la posición definida para el formato.
29. Los campos con líneas largas deben reducir fuente si no entran.
30. Los campos opcionales deben omitirse del PDF si están vacíos.
31. Evitar que un texto se salga del espacio disponible.

### 6. Ampliar el generador PDF

32. Revisar `src/features/formatos/services/pdf-generator.service.js`.
33. Mantener compatibilidad con los formatos actuales.
34. Agregar capacidad para dibujar campos dinámicos sobre una plantilla.
35. Mantener el correlativo automático existente.
36. Implementar helper para texto de una sola línea con reducción de fuente.
37. Implementar helper para bloques de líneas fijas cuando el formato lo requiera.
38. Evitar lógica específica del formulario dentro del generador base.

### 7. Registrar datos de emisión

39. Revisar `documentos_emitidos`.
40. Guardar como metadata o campo equivalente los datos usados para generar la constancia, si la estructura actual lo permite.
41. Si la tabla actual no tiene campo adecuado, crear una migración para agregar `metadata jsonb`.
42. No modificar ni reiniciar correlativos existentes.
43. Mantener la regla de que un correlativo anulado no se reutiliza.
44. Mantener el PDF generado en Storage según el flujo actual del módulo de formatos.

### 8. Auditoría y trazabilidad

45. Registrar auditoría al generar la constancia.
46. La auditoría debe incluir:
    - código del formato
    - correlativo emitido
    - administrador emisor
    - datos principales del documento
47. Mantener trazabilidad en historial de documentos emitidos.
48. No registrar aprobaciones ni decisiones externas a la aplicación.

### 9. Validaciones funcionales

49. Validar que los campos obligatorios no estén vacíos.
50. Validar que el documento del deudor tenga formato claro.
51. Validar que la fecha de anotación esté completa.
52. Validar que `comprobantes_pago` no esté vacío.
53. Permitir campos opcionales vacíos sin bloquear la generación.
54. Mostrar mensaje claro si la generación del PDF falla.

### 10. Actualizar documentación

55. Documentar el flujo de emisión de `CONST-ANOTACION`.
56. Documentar los campos obligatorios y opcionales.
57. Documentar la regla especial del bloque del deudor en tres líneas.
58. Documentar que no existe aprobación dentro del sistema.
59. Documentar que el correlativo se mantiene automático.

---

## Requerimientos funcionales

- El administrador puede emitir una Constancia de Anotación desde el módulo de formatos.
- El sistema muestra un formulario específico para `CONST-ANOTACION`.
- El sistema valida campos obligatorios antes de generar.
- El sistema permite dejar vacíos los campos opcionales:
  - `garantes_aval`
  - `endosatario_cesionario`
  - `otros_datos_adicionales`
- El sistema genera el PDF usando `CONST-ANOTACION.pdf`.
- El PDF contiene el correlativo automático correspondiente.
- El PDF contiene los datos ingresados en el formulario.
- El bloque del deudor se imprime en tres líneas fijas:
  - primera línea: documento
  - segunda línea: nombres completos o razón social
  - tercera línea: domicilio
- El administrador puede descargar el PDF generado.
- El documento emitido queda en el historial.
- La generación queda registrada en auditoría.
- El sistema no incluye aprobación interna para este flujo.

---

## Requerimientos técnicos

- Mantener React + Supabase como arquitectura actual.
- Mantener JavaScript con JSDoc; no migrar a TypeScript.
- Usar `pdf-lib` como generador PDF actual.
- Usar la plantilla `public/templates/CONST-ANOTACION.pdf`.
- Crear configuración separada de campos y posiciones por formato.
- Usar coordenadas de inicio del texto.
- Mantener componentes pequeños, idealmente menores a 120 líneas.
- Extraer lógica de negocio a services/utils.
- Validar datos de entrada en funciones críticas.
- Mantener el sistema de correlativos existente.
- No modificar correlativos históricos.
- Crear migraciones en `supabase/migrations/` si se requiere guardar metadata.
- Compilar siempre con Yarn.

---

## Archivos esperados a revisar o modificar

- `src/features/formatos/components/GenerarDocumentoModal.jsx`
- `src/features/formatos/services/pdf-generator.service.js`
- `src/features/formatos/services/formatos.service.js`
- `src/features/formatos/hooks/useDocumentosEmitidos.js`
- `src/features/formatos/types/formatos.types.js`
- `src/features/formatos/utils/`
- `src/features/formatos/components/`
- `public/templates/CONST-ANOTACION.pdf`
- `supabase/migrations/`
- `docs/modelo_de_datos_diccionario_de_tablas_del_sistema.md`

---

## Definition of Done

El hito se considera completado cuando:

- `yarn lint` finaliza sin errores.
- `yarn build` finaliza correctamente.
- El administrador puede abrir el formulario de `CONST-ANOTACION`.
- Los campos obligatorios se validan correctamente.
- Los campos opcionales pueden quedar vacíos.
- El correlativo se genera automáticamente.
- El correlativo aparece en el PDF descargado.
- Los datos ingresados aparecen en el PDF descargado.
- El bloque del deudor respeta las tres líneas fijas.
- La primera línea del deudor contiene el documento.
- La segunda línea del deudor contiene el nombre completo o razón social.
- La tercera línea del deudor contiene el domicilio.
- El texto no se sale del espacio disponible en los campos principales.
- El documento emitido se registra en historial.
- La auditoría registra la generación.
- No se agrega flujo de aprobación dentro del sistema.
- Los formatos existentes no se rompen.

---

## Nota final

Este hito debe priorizar precisión documental. La constancia de anotación requiere ubicar textos sobre una plantilla oficial con poco margen de error, por lo que cada campo debe tratarse como una posición controlada, especialmente el bloque del deudor dividido en tres líneas.
