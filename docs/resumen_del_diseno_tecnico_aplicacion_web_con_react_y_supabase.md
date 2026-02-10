# Resumen del Diseño Técnico de la Aplicación

## 1. Introducción

El presente documento describe el **diseño técnico de la aplicación**, estableciendo los lineamientos de implementación que guiarán el desarrollo del sistema. Este diseño se basa en los requerimientos funcionales previamente definidos y en las aclaraciones técnicas proporcionadas, priorizando simplicidad, rapidez de desarrollo y control institucional.

El objetivo de este documento es definir **cómo se construirá el sistema a nivel técnico**, sin entrar aún en detalles de código ni configuraciones específicas, sirviendo como referencia para el equipo de desarrollo y para la toma de decisiones técnicas futuras.

---

## 2. Enfoque General de Arquitectura

La aplicación seguirá un enfoque **frontend‑first**, donde el cliente web realizará consultas directas a Supabase como plan principal (Plan A). El uso de rutas API propias se limitará únicamente a escenarios donde sea estrictamente necesario, como:

- Ocultamiento de API keys sensibles
- Procesos que requieran lógica no expuesta al cliente
- Integraciones con servicios externos

Este enfoque reduce complejidad, acelera el desarrollo y aprovecha las capacidades nativas de Supabase como backend y base de datos.

---

## 3. Renderizado y Estrategia de Carga

Se adoptará una estrategia híbrida de renderizado:

- **Landing Page**:
  - Renderizado del lado del servidor (Server Side Rendering)
  - Enfocada en SEO, carga inicial rápida y presentación institucional

- **Resto de páginas del sistema**:
  - Renderizado del lado del cliente (Client Side Rendering)
  - Prioridad en agilidad, interactividad y experiencia de usuario

Esta decisión equilibra visibilidad pública y rendimiento interno del sistema.

---

## 4. Diseño de Datos: Usuarios, Doctores y Pacientes

### 4.1 Tabla `profiles`

La tabla `profiles` se utilizará para almacenar la información de los **usuarios autenticados**, principalmente:

- Doctores
- Administradores

Esta tabla contendrá datos asociados directamente a cuentas con acceso al sistema.

---

### 4.2 Tabla `patients`

La tabla `patients` se mantendrá como una entidad independiente y representará a los **pacientes invitados**, es decir, personas que no requieren autenticación ni acceso directo al sistema.

Características clave:

- Los pacientes no inician sesión
- No se duplicarán registros innecesarios
- El campo **teléfono será UNIQUE**

Regla principal:
> Al crear una cita, si el teléfono ya existe en la tabla `patients`, el sistema reutilizará el registro existente en lugar de crear uno nuevo.

Esto permitirá:
- Evitar duplicidad de datos
- Consultar fácilmente el historial de citas de un paciente

---

## 5. Gestión de Citas y Slots de Tiempo

No se generarán registros de slots de 30 minutos de manera previa en la base de datos.

Decisión técnica:
- Los **slots de tiempo se manejarán de forma lógica**, calculándose dinámicamente en el frontend según la disponibilidad y reglas de negocio
- Solo las **citas efectivamente creadas** se almacenarán como registros persistentes

Este enfoque evita:
- Inflar innecesariamente la base de datos
- Complejidad adicional en la gestión de horarios

---

## 6. Seguridad y Políticas RLS

En esta etapa del proyecto:

- No se implementarán políticas RLS (Row Level Security)
- El control de acceso se manejará inicialmente a nivel de lógica de aplicación

Las políticas RLS serán definidas y configuradas en una fase posterior, una vez que el modelo de datos y los flujos estén completamente estabilizados.

---

## 7. Uso de API Routes

El uso de rutas API propias será **mínimo y controlado**.

Ruta considerada necesaria:
- `/api/chat/assistant`

Esta ruta se utilizará para manejar la comunicación con el asistente de IA, ocultando credenciales sensibles y centralizando la lógica asociada.

El resto de operaciones (CRUD, consultas, filtros) se realizarán directamente desde el frontend hacia Supabase.

---

## 8. Diseño de Componentes (Atomic Design)

El desarrollo del frontend seguirá estrictamente la metodología **Atomic Design**, considerándola un requisito obligatorio.

Principios aplicados:

- Componentes lo más atómicos posible
- Separación clara entre:
  - Atoms
  - Molecules
  - Organisms
  - Templates
  - Pages

Beneficios esperados:
- Alta reutilización de componentes
- Mantenimiento sencillo
- Escalabilidad del frontend
- Consistencia visual y funcional

---

## 9. Auditoría y Registro de Eventos

El sistema incorporará un registro técnico de eventos clave, tales como:

- Creación de citas
- Reutilización de pacientes existentes
- Uso del asistente

Estos registros servirán como base para monitoreo, análisis y futuras optimizaciones del sistema.

---

## 10. Consideraciones Finales

El diseño técnico propuesto prioriza:

- Simplicidad arquitectónica
- Rapidez de desarrollo
- Control de datos
- Escalabilidad progresiva

Las decisiones aquí documentadas permiten avanzar con seguridad hacia la etapa de desarrollo, manteniendo la flexibilidad necesaria para incorporar mejoras técnicas como RLS, optimizaciones de rendimiento o nuevas integraciones en fases posteriores.