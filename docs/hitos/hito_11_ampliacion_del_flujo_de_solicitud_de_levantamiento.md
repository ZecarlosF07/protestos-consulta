## Objetivo del Hito

Ampliar el flujo de **Solicitud de Levantamiento de Protestos** incorporando nuevos campos, opciones condicionales y mejoras en la experiencia del usuario, fortaleciendo el proceso documental y administrativo sin alterar la estructura central del sistema.

Este hito mejora el nivel de formalidad, control y completitud del proceso institucional.

---

## Tareas del Hito

### 1. Nuevos Campos en la Solicitud

1. Agregar campo para adjuntar **Carta de No Adeudo**.
2. Agregar campo descriptivo para **Cuenta de depósito** (visible al registrar comprobante de pago).
3. Agregar opción de selección para tipo de comprobante:
   - Boleta
   - Factura
4. Persistir nuevos campos en base de datos.
5. Validar obligatoriedad según reglas del negocio.

---

### 2. Certificado de Título Regularizado (Campo Condicional)

6. Agregar opción tipo checkbox o selector:
   - “¿Se requiere Certificado de Título Regularizado?”
7. Si la respuesta es “Sí”:
   - Habilitar campo para subir comprobante adicional.
   - Mostrar mensaje informativo: "Costo del certificado: S/ 30".
8. Validar que el comprobante sea obligatorio cuando la opción esté activada.
9. En el módulo del Administrador, si la solicitud requiere certificado:
   - Habilitar campo para que el Administrador adjunte el **Certificado de Título Regularizado emitido**.
   - Asociar el certificado a la solicitud correspondiente.
   - Registrar en auditoría la carga del certificado por parte del Administrador.

---

### 3. Descarga de Formato Oficial

9. Agregar botón visible en el encabezado del módulo de solicitudes:
   - "Descargar Formato de Protesto"
10. Configurar redirección al enlace oficial proporcionado.
11. Asegurar que el botón esté disponible únicamente para usuarios autenticados.

---

## Requerimientos Técnicos

- Actualización del modelo de datos para incluir:
  - Campo carta_no_adeudo (archivo)
  - Campo cuenta_deposito (texto)
  - Campo tipo_comprobante (enum: boleta / factura)
  - Campo requiere_certificado (boolean)
  - Campo comprobante_certificado (archivo - analista)
  - Campo certificado_emitido (archivo - administrador)
- Manejo de campos condicionales en el frontend.
- Validaciones dinámicas según selección del usuario.
- Integración con Supabase Storage para nuevos archivos.
- Separación clara entre archivos cargados por Analista y por Administrador.
- Registro en auditoría de nuevos documentos cargados.
- Sin eliminación física de información existente.

---

## Requerimientos Funcionales

- El analista debe poder:
  - Adjuntar carta de no adeudo.
  - Indicar cuenta de depósito asociada al pago.
  - Seleccionar entre boleta o factura.
  - Indicar si requiere certificado de título regularizado.
- Si requiere certificado:
  - Debe subir comprobante de pago adicional.
  - Debe visualizar que el costo es S/ 30.
- El Administrador debe poder:
  - Visualizar todos los nuevos campos y documentos.
  - Adjuntar el Certificado de Título Regularizado cuando corresponda.
  - Confirmar que el certificado fue emitido y asociado correctamente.
- El botón de descarga debe estar siempre visible dentro del módulo.

---

## Definition of Done (DoD)

- Los nuevos campos existen en base de datos y frontend.
- La carta de no adeudo puede subirse correctamente.
- El campo cuenta de depósito se guarda correctamente.
- La opción boleta / factura se registra correctamente.
- El campo condicional del certificado funciona dinámicamente.
- El comprobante de S/ 30 es obligatorio cuando corresponde.
- El Administrador puede adjuntar el Certificado de Título Regularizado.
- El certificado queda correctamente asociado a la solicitud.
- El botón de descarga redirige correctamente al documento oficial.
- Todos los nuevos eventos generan registro en auditoría.
- No se rompe el flujo existente de levantamiento.

---

> Este hito fortalece la formalidad documental y amplía la cobertura administrativa del proceso de levantamiento.

