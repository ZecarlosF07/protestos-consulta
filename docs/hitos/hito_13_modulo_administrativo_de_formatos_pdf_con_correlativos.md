# Hito 13 – Módulo administrativo de formatos PDF con correlativos

## Objetivo del hito

Implementar un módulo exclusivamente administrativo para la generación, control y trazabilidad de formatos PDF oficiales con correlativos independientes por plantilla. Este hito busca habilitar una operación formal y segura para la emisión de documentos numerados, manteniendo una secuencia propia por cada formato, registrando los datos del solicitante como respaldo interno y conservando un historial completo de documentos generados y anulados.

El objetivo es dotar al sistema de una funcionalidad administrativa robusta para la gestión de formatos institucionales, asegurando consistencia documental, control de numeración, almacenamiento de archivos emitidos y trazabilidad completa de cada acción realizada sobre los correlativos.

---

## Tareas del hito

### 1. Creación del módulo administrativo de formatos
- Crear un módulo visible únicamente para el administrador.
- Incorporar tres formatos PDF fijos definidos desde desarrollo.
- Mostrar una vista principal con la lista de formatos disponibles.
- Permitir el acceso al historial de correlativos generados por cada formato.

### 2. Generación de documentos con correlativo
- Permitir seleccionar uno de los tres formatos disponibles.
- Solicitar como requisito de registro una de estas dos modalidades:
  - DNI y nombres/apellidos completos, o
  - RUC y razón social.
- Validar que los datos requeridos estén completos antes de generar el documento.
- Obtener automáticamente el siguiente correlativo disponible para el formato seleccionado.
- Generar el PDF tomando como base la plantilla fija del formato.
- Insertar únicamente el correlativo en la parte superior derecha del PDF.
- Guardar el PDF generado en el sistema.
- Registrar el documento emitido en la lista histórica del formato correspondiente.

### 3. Gestión del historial de correlativos
- Mostrar la lista histórica de documentos generados por cada formato.
- Permitir consultar el correlativo, estado, fecha de emisión y datos de registro asociados.
- Permitir descargar el PDF generado desde la lista.
- Mantener diferenciados los estados del documento emitido, como activo o anulado.

### 4. Anulación de correlativos emitidos
- Permitir que el administrador anule un correlativo emitido desde la lista histórica.
- Exigir motivo obligatorio al momento de anular.
- Registrar usuario, fecha y motivo de anulación.
- Mantener el correlativo anulado en historial sin eliminación física.
- Evitar la reutilización de correlativos anulados.

### 5. Auditoría y control de trazabilidad
- Registrar en auditoría la generación de cada documento.
- Registrar en auditoría la descarga del PDF cuando corresponda a la lógica actual del sistema.
- Registrar en auditoría cada anulación realizada.
- Garantizar trazabilidad completa por formato, correlativo y usuario administrador.

---

## Requerimientos funcionales

- El sistema debe contar con un módulo visible únicamente para el administrador.
- El módulo debe trabajar con tres plantillas PDF fijas definidas desde desarrollo.
- El administrador debe poder seleccionar cualquiera de los tres formatos para generar un nuevo documento.
- Antes de generar, el sistema debe exigir el registro de:
  - DNI y nombres/apellidos completos, o
  - RUC y razón social.
- Los datos del solicitante deben guardarse como respaldo interno del registro.
- Ninguno de esos datos debe imprimirse en el PDF final.
- En el PDF generado solo debe insertarse el correlativo.
- El correlativo debe ubicarse en la parte superior derecha del formato.
- Cada formato debe manejar su propio correlativo independiente.
- El correlativo debe generarse automáticamente, sin ingreso manual.
- Cada documento emitido debe quedar almacenado en el sistema.
- Cada documento emitido debe aparecer en la lista histórica del formato correspondiente.
- El administrador debe poder descargar el PDF generado desde la lista.
- El administrador debe poder anular un correlativo emitido.
- La anulación debe exigir motivo obligatorio.
- Un correlativo anulado no debe reutilizarse.
- Los registros anulados deben permanecer visibles en historial con su estado correspondiente.
- Todas las acciones relevantes del módulo deben quedar registradas en auditoría.

---

## Requerimientos técnicos

### Frontend
- Crear un nuevo módulo administrativo para la gestión de formatos PDF con correlativos.
- Construir una vista inicial con los tres formatos disponibles.
- Construir formularios de registro previos a la generación del documento.
- Validar la captura de datos según modalidad de persona natural o jurídica.
- Implementar la vista de historial por formato.
- Incorporar acciones de generación, descarga y anulación de documentos.
- Implementar validación obligatoria del motivo de anulación.
- Mostrar estados del correlativo emitido dentro del listado.

### Backend / lógica de negocio
- Implementar lógica para manejar correlativos independientes por formato.
- Garantizar la asignación segura del siguiente correlativo sin duplicidades, incluso ante concurrencia.
- Procesar la plantilla PDF fija seleccionada e insertar el correlativo en la posición definida.
- Guardar el PDF resultante y registrar sus metadatos.
- Persistir los datos del solicitante como respaldo interno de la emisión.
- Implementar la lógica de anulación sin borrado físico del registro.
- Asegurar que los correlativos anulados no vuelvan a ponerse en circulación.

### Base de datos
- Crear o extender estructuras para representar los formatos PDF fijos.
- Crear o extender estructuras para el historial de documentos emitidos por formato.
- Mantener un mecanismo persistente del último correlativo asignado por cada formato.
- Registrar el estado del correlativo emitido: activo o anulado.
- Registrar usuario emisor, usuario anulador, fecha de emisión, fecha de anulación y motivo de anulación.
- Persistir los datos de registro del solicitante asociados a cada documento emitido.

### Storage y documentos
- Almacenar los PDFs generados en el storage del sistema.
- Mantener rutas y nombres de archivo consistentes para consulta y descarga posterior.
- Asegurar integridad entre el registro del historial y el archivo físico almacenado.

### Seguridad y auditoría
- Restringir todo el módulo exclusivamente al rol administrador.
- Registrar eventos de generación, descarga y anulación de documentos.
- Asegurar control de acceso para impedir operaciones no autorizadas.

---

## Definition of Done

- Existe un módulo visible únicamente para el administrador.
- El módulo muestra los tres formatos PDF definidos por desarrollo.
- El administrador puede seleccionar un formato e iniciar la generación de un nuevo documento.
- El sistema exige el registro de DNI y nombres/apellidos o RUC y razón social antes de emitir.
- La validación de datos obligatorios funciona correctamente.
- El sistema asigna automáticamente el siguiente correlativo del formato seleccionado.
- Cada formato mantiene su correlativo independiente.
- El correlativo se inserta correctamente en la parte superior derecha del PDF.
- El PDF generado se guarda correctamente en el sistema.
- El documento emitido aparece en la lista histórica del formato correspondiente.
- El administrador puede descargar el PDF generado desde la lista.
- El administrador puede anular un correlativo emitido.
- La anulación exige motivo obligatorio.
- El correlativo anulado conserva su registro histórico y cambia de estado correctamente.
- El correlativo anulado no se reutiliza.
- Los datos del solicitante quedan registrados en el sistema, pero no se imprimen en el PDF.
- Los permisos del módulo funcionan correctamente y solo administración puede acceder a él.
- Todas las acciones relevantes quedan registradas en auditoría.
- El módulo funciona sin afectar negativamente el flujo existente del sistema.

