# Hito 14 – Corrección de seguridad, auditoría y validación final del sistema operativo

## Objetivo del hito

Corregir las observaciones técnicas detectadas en la revisión del sistema operativo, enfocándose en puntos concretos que pueden afectar la presentación, la auditoría institucional y la seguridad real del backend.

Este hito no agrega nuevos módulos funcionales. Su finalidad es cerrar brechas específicas en autenticación, creación de usuarios, políticas RLS, generación de correlativos PDF y validación técnica del proyecto.

---

## Problemas identificados

Durante la revisión se detectaron los siguientes puntos concretos:

1. `yarn lint` falla por un estado no utilizado en el contexto de autenticación.
2. El hook de autenticación tiene una advertencia de dependencias.
3. El evento `LOGIN_BLOQUEADO` se intenta registrar después de cerrar sesión.
4. La creación de analistas usa `supabase.auth.signUp`, lo que se parece demasiado a un flujo de auto-registro.
5. Existe una política RLS que permite insertar el propio registro en `usuarios`.
6. Las funciones administrativas de usuarios no validan internamente que el ejecutor sea administrador.
7. El módulo de formatos PDF tiene políticas RLS demasiado permisivas.
8. La RPC de correlativos puede endurecerse con validación interna de administrador.
9. El roadmap general debe aclarar que los hitos 1 al 7 fueron el MVP inicial y los hitos posteriores son ampliaciones operativas.

No se incluye migración a TypeScript.

---

## Tareas del hito

### 1. Corregir validaciones de lint en autenticación

1. Revisar `src/features/auth/context/AuthContext.jsx`.
2. Eliminar o reemplazar el estado `session` si no participa en el renderizado ni en la lógica de autenticación.
3. Mantener `sessionTokenRef` como fuente estable para evitar renders innecesarios por refresh de token.
4. Corregir la advertencia de dependencias del `useEffect`.
5. Validar que el flujo de sesión persistente siga funcionando después de una recarga del navegador.

### 2. Corregir auditoría de accesos bloqueados

6. Revisar `src/features/auth/services/auth-flow.service.js`.
7. Mover el registro de auditoría `LOGIN_BLOQUEADO` antes de ejecutar `authSignOut()`.
8. Esperar explícitamente el registro de auditoría antes de cerrar sesión.
9. Mantener el cierre de sesión obligatorio para usuarios bloqueados o entidades bloqueadas.
10. Confirmar que el mensaje mostrado al usuario siga siendo claro y controlado.

### 3. Endurecer creación administrativa de analistas

11. Revisar `src/features/admin/services/analistas.service.js`.
12. Reemplazar el uso de `supabase.auth.signUp` en `crearAnalista`.
13. Usar la función RPC `crear_usuario` para crear simultáneamente el usuario en `auth.users` y en `usuarios`.
14. Asegurar que la función reciba:
    - email
    - password
    - nombre completo
    - DNI
    - teléfono
    - cargo
    - rol `analista`
    - entidad financiera
15. Mantener la respuesta esperada por la UI para que el listado de analistas se actualice sin cambios visuales.
16. Confirmar que no exista pantalla ni flujo público de registro.

### 4. Endurecer funciones administrativas de usuarios

17. Crear una nueva migración en `supabase/migrations/`.
18. Actualizar la función `crear_usuario` para validar internamente que `is_admin()` sea verdadero.
19. Actualizar la función `resetear_password` para validar internamente que `is_admin()` sea verdadero.
20. Actualizar la función `cambiar_estado_usuario` para validar internamente que `is_admin()` sea verdadero.
21. Revocar ejecución pública de estas funciones cuando corresponda.
22. Conceder ejecución únicamente al rol `authenticated`.
23. Confirmar que un analista autenticado no pueda ejecutar estas funciones con éxito.

### 5. Corregir políticas RLS de usuarios

24. Crear o ampliar una migración de seguridad.
25. Eliminar la política `usuarios_insert_self` si sigue existiendo.
26. Mantener la política que permite al administrador insertar usuarios.
27. Confirmar que un usuario autenticado no administrador no pueda insertar registros en `usuarios`.
28. Confirmar que el administrador pueda seguir creando analistas mediante la RPC administrativa.

### 6. Endurecer seguridad del módulo de formatos PDF

29. Crear una migración específica para el módulo de formatos PDF.
30. Ajustar las políticas RLS de `formatos_pdf`.
31. Ajustar las políticas RLS de `documentos_emitidos`.
32. Reemplazar políticas permisivas con validaciones basadas en `is_admin()`.
33. Permitir que solo el administrador pueda:
    - listar formatos PDF
    - listar documentos emitidos
    - registrar documentos emitidos
    - actualizar documentos emitidos
    - anular documentos emitidos
34. Confirmar que el analista no pueda consultar ni modificar datos del módulo de formatos desde la API.

### 7. Endurecer RPC de correlativos

35. Actualizar la función `incrementar_correlativo`.
36. Agregar validación interna de administrador antes de incrementar el correlativo.
37. Mantener el incremento atómico mediante `UPDATE ... RETURNING`.
38. Confirmar que cada formato conserve su correlativo independiente.
39. Confirmar que un correlativo anulado no se reutilice.
40. Confirmar que el módulo siga generando PDF correctamente para el administrador.

### 8. Ajustar roadmap documental

41. Revisar `docs/hitos_del_proyecto_diseno_e_implementacion_del_saa_s.md`.
42. Cambiar la descripción inicial para aclarar que los hitos 1 al 7 corresponden al MVP original.
43. Agregar una nota indicando que los hitos 8 al 14 son ampliaciones y estabilizaciones posteriores al MVP.
44. No eliminar ni reescribir los hitos históricos.
45. Mantener los documentos individuales de `docs/hitos/` como detalle operativo de cada ampliación.

---

## Requerimientos funcionales

- El administrador puede iniciar sesión y operar todos sus módulos.
- El analista puede iniciar sesión y operar únicamente sus módulos permitidos.
- Un usuario bloqueado no puede ingresar.
- Un analista de entidad bloqueada no puede ingresar.
- Los intentos de acceso bloqueado quedan registrados en auditoría.
- El administrador puede crear analistas desde el dashboard.
- Un analista no puede crear usuarios ni insertar registros propios en `usuarios`.
- El administrador puede resetear contraseñas de analistas.
- El administrador puede generar documentos PDF con correlativo.
- El administrador puede anular documentos emitidos indicando motivo obligatorio.
- Un analista no puede acceder ni operar el módulo de formatos PDF.
- Los flujos existentes de consulta, levantamiento, importación, auditoría y solicitudes no se rompen.

---

## Requerimientos técnicos

- Mantener React + Supabase como arquitectura actual.
- Mantener JavaScript con JSDoc; no migrar a TypeScript.
- Las migraciones nuevas deben vivir en `supabase/migrations/`.
- Las funciones administrativas sensibles deben validar permisos internamente.
- Las políticas RLS deben reflejar permisos reales por rol.
- Las RPC sensibles no deben depender únicamente de la protección visual del frontend.
- La auditoría debe registrar eventos críticos antes de cerrar la sesión del usuario.
- El proyecto debe compilar usando Yarn.

---

## Archivos esperados a revisar o modificar

- `src/features/auth/context/AuthContext.jsx`
- `src/features/auth/services/auth-flow.service.js`
- `src/features/admin/services/analistas.service.js`
- `supabase/migrations/20260210152502_pgcrypto_y_funciones.sql` o una migración correctiva posterior
- `supabase/migrations/20260210180800_rls_policies.sql` o una migración correctiva posterior
- `supabase/migrations/20260326130000_hito13_formatos_pdf.sql` o una migración correctiva posterior
- `supabase/migrations/20260326130001_hito13_rpc_correlativo.sql` o una migración correctiva posterior
- `docs/hitos_del_proyecto_diseno_e_implementacion_del_saa_s.md`

---

## Definition of Done

El hito se considera completado cuando:

- `yarn lint` finaliza sin errores.
- `yarn build` finaliza correctamente.
- El login de usuario activo funciona.
- El login de usuario bloqueado es rechazado.
- El login de analista con entidad bloqueada es rechazado.
- Los accesos bloqueados quedan registrados en `auditoria`.
- La creación de analistas ya no usa `supabase.auth.signUp`.
- La creación de analistas se realiza mediante una función administrativa controlada.
- La política `usuarios_insert_self` ya no permite inserción propia no administrativa.
- Las funciones `crear_usuario`, `resetear_password` y `cambiar_estado_usuario` validan que el ejecutor sea administrador.
- Un analista no puede ejecutar correctamente funciones administrativas de usuarios.
- Las políticas RLS de `formatos_pdf` y `documentos_emitidos` están restringidas a administrador.
- La función `incrementar_correlativo` valida internamente permisos de administrador.
- El administrador puede generar un PDF y el correlativo aumenta correctamente.
- El administrador puede anular un documento emitido con motivo obligatorio.
- El analista no puede acceder al módulo de formatos por ruta ni por API.
- El roadmap general aclara la diferencia entre MVP inicial e hitos posteriores.
- No se rompe ningún flujo completado en los hitos 1 al 13.

---

## Nota final

Este hito debe tratarse como una corrección de cierre técnico antes de presentación. No busca ampliar el alcance funcional del SaaS, sino asegurar que lo ya implementado esté protegido, auditado y validado de forma consistente con el uso institucional esperado.
