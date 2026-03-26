# Hito 12 – Ampliación del flujo de levantamiento y control documental

## Objetivo del hito

Implementar mejoras funcionales sobre el flujo existente de levantamiento de protestos para adaptarlo a nuevos requerimientos documentales y operativos. Este hito busca personalizar la captura de información según el tipo de comprobante seleccionado, reforzar la gestión de archivos adjuntos dentro de la solicitud y ampliar las capacidades del módulo de auditoría mediante exportación en Excel por entidad financiera.

El objetivo es fortalecer la trazabilidad del proceso, mantener consistencia con los componentes ya existentes del sistema y mejorar la capacidad operativa del administrador y del analista en la gestión de solicitudes de levantamiento.

---

## Tareas del hito

### 1. Personalización del formulario según tipo de comprobante
- Mantener la selección del tipo de comprobante entre boleta y factura.
- Implementar comportamiento condicional en el formulario de levantamiento.
- Si se selecciona factura, mostrar y validar los campos de RUC y razón social.
- Si se selecciona boleta, mostrar y validar los campos de DNI, nombres, apellidos completos y teléfono.
- Guardar la información registrada como parte de la solicitud de levantamiento.
- Asegurar que la información mostrada y validada dependa exclusivamente del tipo de comprobante elegido.

### 2. Ajuste del encabezado del formulario
- Cambiar el texto visible del encabezado de “Formato de solicitud” a “Formato de solicitud (Adjuntar DNI)”.
- Verificar que el nuevo encabezado se visualice correctamente en el flujo correspondiente.

### 3. Gestión de comprobante adjunto en la solicitud
- Incorporar una sección de comprobante adjunto en la solicitud de levantamiento.
- Permitir que el administrador cargue el archivo de boleta o factura asociado a la solicitud.
- Permitir que el administrador reemplace el archivo previamente cargado.
- Permitir que el analista pueda visualizar o descargar el comprobante adjunto.
- Mantener el mismo patrón funcional y visual usado actualmente para el certificado de regularización.
- Registrar en auditoría la carga inicial y los reemplazos realizados.

### 4. Exportación en Excel desde auditoría
- Agregar una opción de exportación a Excel en el módulo de auditoría.
- Permitir exportar las solicitudes realizadas por entidad financiera.
- Incluir en la exportación la información relevante de la solicitud y del estado del trámite.
- Respetar filtros aplicados en la vista, si existieran.

---

## Requerimientos funcionales

- El sistema debe permitir seleccionar entre boleta y factura dentro del formulario de levantamiento.
- El formulario debe mostrar únicamente los campos que correspondan al tipo de comprobante seleccionado.
- Si el comprobante es factura, deben registrarse obligatoriamente RUC y razón social.
- Si el comprobante es boleta, deben registrarse obligatoriamente DNI, nombres, apellidos completos y teléfono.
- La información ingresada debe quedar asociada a la solicitud de levantamiento.
- El encabezado del formulario debe mostrarse como “Formato de solicitud (Adjuntar DNI)”.
- El administrador debe poder cargar un archivo de boleta o factura en la solicitud.
- El administrador debe poder reemplazar un archivo previamente cargado.
- El analista debe poder visualizar y descargar el comprobante adjunto.
- La experiencia de uso del comprobante adjunto debe seguir la misma lógica del certificado de regularización.
- En auditoría debe existir una opción para exportar en Excel las solicitudes hechas por entidad financiera.
- La exportación debe considerar los filtros activos de la vista, si existen.
- Todas las acciones relevantes del flujo deben dejar trazabilidad en auditoría.

---

## Requerimientos técnicos

### Frontend
- Actualizar el formulario de levantamiento para soportar renderizado condicional según tipo de comprobante.
- Implementar validaciones dinámicas para boleta y factura.
- Ajustar el encabezado visible del formulario.
- Incorporar en la interfaz de la solicitud una sección de comprobante adjunto reutilizando el patrón del certificado de regularización.
- Permitir acciones de carga, reemplazo, visualización y descarga según permisos de rol.
- Agregar en auditoría la opción de exportación a Excel.

### Backend / lógica de negocio
- Extender la lógica de persistencia de solicitudes de levantamiento para almacenar los datos específicos de boleta o factura.
- Implementar soporte para carga y reemplazo del archivo adjunto vinculado a la solicitud.
- Permitir consulta y descarga controlada del comprobante adjunto.
- Generar el archivo Excel con base en las solicitudes filtradas por entidad.
- Registrar en auditoría eventos de carga, reemplazo y descarga cuando corresponda.

### Base de datos
- Extender la estructura de solicitudes de levantamiento con campos para tipo de comprobante y datos del solicitante.
- Mantener relación entre la solicitud y el archivo de boleta o factura adjunto.
- Asegurar persistencia adecuada para reemplazo del archivo, sin perder trazabilidad histórica si aplica la lógica actual del sistema.

### Storage y seguridad
- Almacenar boletas y facturas en el storage del sistema bajo una estructura consistente.
- Respetar permisos diferenciados entre administrador y analista.
- Mantener control de acceso para evitar carga o descarga no autorizada.

---

## Definition of Done

- El formulario de levantamiento permite seleccionar boleta o factura.
- El sistema muestra campos diferentes según la opción seleccionada.
- La validación de campos obligatorios funciona correctamente para ambos casos.
- La información del comprobante queda correctamente guardada en la solicitud.
- El encabezado fue actualizado a “Formato de solicitud (Adjuntar DNI)”.
- El administrador puede subir una boleta o factura dentro de la solicitud.
- El administrador puede reemplazar el archivo cargado.
- El analista puede visualizar y descargar el comprobante adjunto.
- La funcionalidad del comprobante sigue el patrón del certificado de regularización.
- En auditoría existe una exportación válida a Excel por entidad financiera.
- El Excel exportado refleja la información esperada de las solicitudes.
- Los filtros activos de auditoría se respetan en la exportación, si existen.
- Los permisos por rol funcionan correctamente.
- Todas las acciones relevantes quedan registradas en auditoría.
- El flujo actual de levantamiento no se rompe con estas mejoras.

