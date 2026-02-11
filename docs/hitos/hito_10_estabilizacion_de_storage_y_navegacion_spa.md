## Objetivo del Hito

Corregir y estabilizar dos aspectos críticos de la experiencia de usuario y operación del sistema:

1. **Subida de archivos en el flujo de levantamiento de protestos**, asegurando que los documentos (comprobante de pago y formato firmado) se almacenen correctamente en Supabase Storage.
2. **Comportamiento de navegación SPA**, eliminando recargas completas de página (efecto F5) al entrar y salir de la aplicación, garantizando una experiencia fluida y profesional.

Este hito mejora la confiabilidad técnica y la percepción de calidad del sistema.

---

## Tareas del Hito

### Subida de Archivos (Storage)

1. Definir estructura oficial de buckets para el sistema.
2. Crear bucket de Storage requerido en Supabase.
3. Estandarizar nombres de bucket y rutas de almacenamiento.
4. Ajustar el código de subida de archivos para usar el bucket correcto.
5. Implementar validaciones de tipo y tamaño de archivo.
6. Manejar errores de subida de forma controlada y clara.
7. Verificar asociación correcta de archivos con solicitudes de levantamiento.
8. Registrar eventos de carga de archivos en auditoría.

### Navegación y Sesión (SPA)

9. Revisar lógica de control de sesión en frontend.
10. Eliminar uso de `window.location`, `location.reload` o equivalentes.
11. Implementar redirecciones mediante el router de la aplicación.
12. Centralizar el manejo de sesión en un estado global.
13. Ajustar listeners de cambios de autenticación.
14. Validar navegación entre login y vistas internas sin recarga.

---

## Requerimientos Técnicos

- Uso de Supabase Storage con buckets predefinidos.
- Acceso a buckets restringido a usuarios autenticados.
- Rutas de archivos organizadas por solicitud.
- Manejo de sesión en frontend sin recargas de página.
- Uso correcto del sistema de ruteo (SPA).
- Manejo de errores y estados de carga.
- Registro de auditoría para operaciones críticas.

---

## Requerimientos Funcionales

- El Analista debe poder subir:
  - Comprobante de pago
  - Formato de levantamiento firmado
- Los archivos deben almacenarse correctamente y quedar disponibles para revisión administrativa.
- El usuario no debe percibir recargas completas al navegar.
- Al cerrar sesión o expirar la sesión, el sistema debe redirigir correctamente al login.
- La experiencia debe ser consistente y estable.

---

## Definition of Done (DoD)

- Los buckets de Storage existen y son accesibles.
- Los archivos se suben sin errores.
- El error "Bucket not found" no vuelve a presentarse.
- Los documentos quedan asociados a la solicitud correcta.
- No se producen recargas completas de página al navegar.
- El flujo login → app → logout es fluido.
- Los cambios no afectan la lógica de negocio existente.
- La experiencia del analista es estable y profesional.

---

> Este hito se enfoca en **calidad técnica y experiencia de usuario**, consolidando el sistema para uso real.

