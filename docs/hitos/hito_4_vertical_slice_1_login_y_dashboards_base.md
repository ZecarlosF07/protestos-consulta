## Objetivo del Hito

Validar el **flujo completo de acceso y navegación inicial** del sistema, entregando una aplicación usable de extremo a extremo una vez autenticado el usuario, con **dashboards base diferenciados por rol** y una estructura de navegación protegida.

Este hito no profundiza en la lógica de negocio, pero confirma que la arquitectura, el ruteo y la experiencia inicial del usuario funcionan correctamente.

---

## Tareas del Hito

1. Definir layouts base diferenciados por rol:
   - Layout Administrador
   - Layout Analista
2. Implementar dashboard base del Administrador:
   - Estructura visual inicial
   - Secciones reservadas para métricas futuras
3. Implementar dashboard base del Analista:
   - Vista inicial post-login
   - Acceso a módulos futuros (consulta, levantamiento)
4. Configurar sistema de navegación interna protegida.
5. Implementar redirección automática post-login hacia el dashboard correspondiente.
6. Bloquear acceso directo a rutas internas sin sesión válida.
7. Implementar componentes base reutilizables (header, sidebar, footer).
8. Aplicar Atomic Design en la construcción de componentes.
9. Validar experiencia completa desde login hasta dashboard.

---

## Requerimientos Técnicos

- Frontend desarrollado en React.
- Sistema de ruteo con protección por sesión y rol.
- Uso de layouts compartidos por rol.
- Componentes construidos siguiendo Atomic Design.
- Separación clara entre vistas, layouts y componentes.
- Manejo de estado de sesión desde el cliente.
- Renderizado client-side para dashboards.
- Estilos consistentes y escalables.

---

## Requerimientos Funcionales

- Un usuario autenticado debe:
  - Acceder automáticamente a su dashboard según rol.
  - Ver únicamente las vistas permitidas para su rol.
- Un usuario no autenticado:
  - No puede acceder a ninguna ruta interna.
  - Es redirigido siempre al login.
- El Administrador y el Analista deben percibir interfaces claramente diferenciadas.
- El sistema debe ser navegable sin errores de ruteo.

---

## Definition of Done (DoD)

- El flujo login → dashboard funciona de extremo a extremo.
- Existen dashboards base para Administrador y Analista.
- Los layouts están correctamente separados por rol.
- La navegación interna está protegida.
- No es posible acceder a rutas internas sin autenticación.
- La estructura de componentes sigue Atomic Design.
- La aplicación es navegable y estable.
- El sistema está listo para incorporar lógica de negocio del Hito 5 sin refactor mayor.

---

> Este hito valida la **estructura navegable del sistema**, sin implementar aún funcionalidades core.

