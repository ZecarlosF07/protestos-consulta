# Hito 1 – Congelamiento del Dominio y Reglas del Negocio

## 1. Objetivo del hito

Establecer una comprensión única, clara y definitiva del dominio del negocio, los actores del sistema, los flujos principales y las reglas que gobiernan el funcionamiento del SaaS institucional. Este hito busca eliminar ambigüedades antes de iniciar el desarrollo técnico, reduciendo riesgos de retrabajo, inconsistencias funcionales y decisiones técnicas incorrectas.

El resultado de este hito servirá como **base contractual y técnica** para todas las siguientes fases del proyecto.

---

## 2. Tareas del hito

- Identificar y documentar los actores del sistema.
- Definir responsabilidades, permisos y restricciones por tipo de usuario.
- Describir los flujos principales del sistema:
  - Autenticación
  - Consulta de protestos
  - Auditoría
  - Levantamiento de protestos
  - Importación de información
- Definir los estados del protesto y sus transiciones válidas.
- Definir las reglas de auditoría y trazabilidad.
- Establecer reglas de control para evitar abuso del sistema.
- Validar que el sistema no contemple registro público.
- Alinear expectativas del equipo sobre el alcance real del MVP.

---

## 3. Requerimientos funcionales

- El sistema debe contemplar únicamente dos tipos de usuarios: Administrador y Analista.
- Todas las cuentas de analistas deben ser creadas exclusivamente por el Administrador.
- El sistema debe permitir consultas por número de documento sin que el usuario seleccione el tipo (DNI o RUC).
- Cada consulta debe quedar registrada en un módulo de auditoría.
- El sistema debe manejar estados claros para los protestos.
- El sistema debe permitir el levantamiento de protestos bajo un flujo controlado.
- El Administrador debe tener control total sobre usuarios, protestos y auditoría.

---

## 4. Requerimientos técnicos (conceptuales)

> Nota: En este hito no se definen tecnologías específicas, solo criterios técnicos generales.

- El modelo del dominio debe ser independiente de la interfaz gráfica.
- Las reglas de negocio deben estar documentadas y no implícitas en el código.
- Las decisiones tomadas en este hito deben ser fácilmente trazables a requerimientos posteriores.
- El diseño debe considerar desde el inicio la necesidad de auditoría y control.
- El dominio debe ser extensible sin romper reglas existentes.

---

## 5. Definition of Done (DoD)

El Hito 1 se considera completado cuando:

- Existe un documento de análisis funcional validado por los stakeholders.
- Los actores del sistema están claramente definidos y sin ambigüedad.
- Los flujos principales están documentados y aprobados.
- Las reglas de negocio están explícitamente descritas.
- El alcance del MVP está claramente delimitado.
- No existen decisiones funcionales críticas pendientes.
- El equipo de desarrollo tiene una visión común del sistema.

---

## 6. Riesgos mitigados por este hito

- Desarrollo de funcionalidades innecesarias.
- Cambios tardíos en reglas de negocio.
- Mal diseño del modelo de datos.
- Confusión entre roles y permisos.
- Retrabajo en fases avanzadas del proyecto.

---

## Nota final

Este hito no produce código. Su valor radica en **prevenir errores estructurales** que son costosos de corregir en etapas posteriores del desarrollo.

