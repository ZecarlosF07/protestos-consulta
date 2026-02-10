# Documento de Análisis del Proyecto

## 1. Introducción

El presente documento de análisis describe de manera integral los requerimientos funcionales, reglas de negocio, actores, flujos principales y consideraciones de uso del **Sistema SaaS institucional de Consulta y Levantamiento de Protestos**, administrado por la Cámara de Comercio de Ica y orientado a entidades financieras que operan en la provincia.

Este documento tiene como finalidad servir como base para las siguientes etapas del proyecto (diseño y desarrollo), delimitando claramente el alcance del sistema en su primera versión (MVP institucional), sin abordar aspectos tecnológicos, de infraestructura o arquitectura.

---

## 2. Objetivo del Sistema

El sistema tiene como objetivo principal **centralizar, controlar y auditar el acceso a la información de protestos y moras**, permitiendo a las entidades financieras realizar consultas confiables y gestionar, de forma digital, el flujo mínimo de levantamiento de protestos, bajo la supervisión de la Cámara de Comercio de Ica.

---

## 3. Alcance del Proyecto (MVP)

El alcance del sistema en su versión inicial comprende exclusivamente:

- Gestión básica de usuarios y accesos
- Consulta de protestos y moras por número de documento
- Registro y auditoría de consultas
- Flujo mínimo de levantamiento de protestos
- Importación de protestos desde archivos Excel
- Revisión y gestión administrativa de solicitudes
- Visualización de métricas básicas y dashboards

Quedan explícitamente fuera de alcance:
- Integraciones con sistemas externos
- Pagos en línea
- Automatización con sistemas nacionales
- Gestión documental avanzada
- Configuraciones complejas por entidad

---

## 4. Actores del Sistema

### 4.1 Administrador de la Cámara de Comercio

Actor principal responsable de la administración total del sistema.

Funciones:
- Crear, habilitar, bloquear y eliminar entidades financieras
- Crear, habilitar, bloquear y eliminar usuarios analistas
- Resetear contraseñas de analistas
- Importar protestos desde archivos Excel
- Visualizar dashboards y métricas globales
- Revisar solicitudes de levantamiento
- Cambiar el estado de los protestos
- Garantizar la auditoría y trazabilidad del sistema

---

### 4.2 Entidad Financiera

Actor organizacional que agrupa a los usuarios analistas. No accede directamente al sistema.

Características:
- Puede ser habilitada o bloqueada por el administrador
- Al ser bloqueada, todos sus analistas quedan automáticamente bloqueados

---

### 4.3 Usuario Analista

Usuario operativo perteneciente a una entidad financiera.

Funciones:
- Iniciar sesión con credenciales asignadas
- Realizar consultas por número de documento
- Visualizar resultados en tiempo real
- Iniciar solicitudes de levantamiento de protestos
- Subir documentación requerida

Restricciones:
- No puede registrarse
- No puede gestionar otros usuarios
- No puede modificar información de protestos

---

## 5. Gestión de Usuarios y Accesos

- El sistema contará únicamente con **login por usuario analista**
- No existirá funcionalidad de auto‑registro
- Todas las cuentas serán creadas y habilitadas por el administrador
- Los estados de usuario serán: Activo, Bloqueado y Eliminado
- El administrador podrá resetear contraseñas en cualquier momento

Datos básicos del analista:
- Nombre completo
- DNI
- Teléfono
- Cargo
- Entidad financiera
- Estado

---

## 6. Consulta de Protestos y Moras

### 6.1 Mecanismo de Consulta

El sistema contará con un único campo de búsqueda denominado **“Número de documento”**.

- El usuario no seleccionará el tipo de documento
- El sistema identificará automáticamente si se trata de DNI (8 dígitos) o RUC (11 dígitos)
- Solo se permitirán valores numéricos válidos

### 6.2 Resultados de la Consulta

El sistema mostrará:
- Indicador de existencia o no de protestos
- Nombre completo de la persona consultada
- Número de documento
- Entidad financiadora (Girador)
- Entidad fuente del protesto (EF)
- Monto del protesto
- Fecha de protesto
- Tarifa aplicable para levantamiento

Si no existen protestos, el sistema mostrará un mensaje genérico informativo.

---

## 7. Auditoría de Consultas

Cada consulta realizada será registrada automáticamente, almacenando:
- Usuario analista
- Entidad financiera
- Número de documento consultado
- Fecha y hora

El administrador podrá visualizar:
- Cantidad total de consultas
- Consultas por entidad
- Consultas por analista
- Ranking de los 10 analistas con mayor número de consultas

---

## 8. Flujo de Levantamiento de Protestos

### 8.1 Inicio del Proceso

Cuando una consulta presenta protestos vigentes, el sistema mostrará la opción **“Iniciar levantamiento de protesto”**.

### 8.2 Acciones del Analista

- Descargar formato oficial de levantamiento
- Subir comprobante de pago
- Subir formato de levantamiento firmado

### 8.3 Registro de Solicitud

El sistema registrará:
- Analista solicitante
- Entidad financiera
- Protesto asociado (Secuencia)
- Fecha y hora
- Estado de la solicitud

---

## 9. Gestión de Solicitudes de Levantamiento

El administrador podrá:
- Visualizar un listado centralizado de solicitudes
- Revisar la documentación enviada
- Cambiar el estado del protesto
- Marcar solicitudes como atendidas

Las solicitudes podrán generarse de forma simultánea por múltiples entidades.

---

## 10. Importación de Protestos desde Excel

El sistema permitirá al administrador importar archivos Excel que contengan **exclusivamente protestos nuevos**.

Campos relevantes:
- Secuencia
- Número de documento
- Girador (Entidad financiadora)
- EF (Entidad fuente del protesto)
- Importe
- Fecha de protesto

Los campos IdSec y TPG serán ignorados.

La información importada alimentará la base de datos del sistema sin sobrescribir registros existentes.

---

## 11. Reglas de Negocio Principales

- Toda consulta debe estar asociada a un analista activo
- Toda consulta debe ser auditada
- No se permite acceso sin autenticación
- El bloqueo de una entidad bloquea a todos sus analistas
- Un protesto levantado cambia su estado y no puede ser gestionado nuevamente
- Las solicitudes no eliminan información histórica

---

## 12. Riesgos Funcionales y Controles

Riesgos identificados:
- Uso excesivo o indebido de consultas
- Acceso no autorizado a información sensible
- Carga incorrecta de protestos

Controles propuestos:
- Auditoría obligatoria de todas las acciones
- Bloqueo manual de usuarios y entidades
- Validación estricta de documentos
- Importación controlada solo por administrador

---

## 13. Consideraciones Finales

El presente análisis define de manera clara y delimitada el funcionamiento del sistema en su primera versión, permitiendo avanzar con seguridad a las siguientes etapas del proyecto. El enfoque institucional, la trazabilidad de uso y el control centralizado constituyen los pilares fundamentales del sistema propuesto.

