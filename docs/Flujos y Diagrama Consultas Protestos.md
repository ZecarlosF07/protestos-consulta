# Consultas Protestos

Diagrama E-R

```mermaid
erDiagram
    ENTIDADES_FINANCIERAS ||--o{ USUARIOS : tiene
    ENTIDADES_FINANCIERAS ||--o{ CONSULTAS : genera
    ENTIDADES_FINANCIERAS ||--o{ SOLICITUDES_LEVANTAMIENTO : origina
USUARIOS ||--o{ CONSULTAS : realiza
USUARIOS ||--o{ SOLICITUDES_LEVANTAMIENTO : crea
USUARIOS ||--o{ AUDITORIA : ejecuta
USUARIOS ||--o{ IMPORTACIONES_PROTESTOS : importa

PROTESTOS ||--o{ SOLICITUDES_LEVANTAMIENTO : asociado_a

SOLICITUDES_LEVANTAMIENTO ||--o{ ARCHIVOS : contiene

ENTIDADES_FINANCIERAS {
    uuid id PK
    varchar nombre
    varchar estado
    timestamp created_at
    timestamp updated_at
    timestamp deleted_at
}

USUARIOS {
    uuid id PK
    varchar email
    varchar password_hash
    varchar nombre_completo
    varchar dni
    varchar telefono
    varchar cargo
    varchar rol
    uuid entidad_financiera_id FK
    varchar estado
    timestamp created_at
    timestamp updated_at
    timestamp deleted_at
}

PROTESTOS {
    uuid id PK
    varchar secuencia
    varchar tipo_documento
    varchar numero_documento
    varchar nombre_persona
    varchar entidad_financiadora
    varchar entidad_fuente
    numeric monto
    date fecha_protesto
    numeric tarifa_levantamiento
    varchar estado
    timestamp created_at
    timestamp updated_at
    timestamp deleted_at
}

CONSULTAS {
    uuid id PK
    uuid usuario_id FK
    uuid entidad_financiera_id FK
    varchar tipo_documento
    varchar numero_documento
    timestamp fecha_consulta
    timestamp created_at
    timestamp deleted_at
}

SOLICITUDES_LEVANTAMIENTO {
    uuid id PK
    uuid protesto_id FK
    uuid usuario_id FK
    uuid entidad_financiera_id FK
    varchar estado
    timestamp created_at
    timestamp updated_at
    timestamp deleted_at
}

ARCHIVOS {
    uuid id PK
    uuid solicitud_id FK
    varchar tipo
    varchar ruta
    timestamp created_at
    timestamp deleted_at
}

AUDITORIA {
    uuid id PK
    uuid usuario_id FK
    uuid entidad_financiera_id FK
    varchar accion
    text descripcion
    timestamp created_at
    timestamp deleted_at
}

IMPORTACIONES_PROTESTOS {
    uuid id PK
    uuid usuario_id FK
    varchar nombre_archivo
    integer total_registros
    integer registros_exitosos
    integer registros_error
    timestamp created_at
    timestamp deleted_at
}
```

Flujo de la Aplicacion

Administrador de la Camara

```mermaid
flowchart TD
A[Usuario ingresa a la Landing Page] --> B{¿Está autenticado?}
B -- No --> C[Registro / Login]
C --> C1[Ingreso de credenciales]
C1 --> C2[Supabase Auth]
C2 -->|Éxito| D[Dashboard]
C2 -->|Error| C3[Mostrar error]

B -- Sí --> D[Dashboard]

D --> E[Selecciona módulo del sistema]

E --> F[Gestión de Solicitudes]
E --> G[Gestión de Usuarios]
E --> H[Gestión de Documentos]
E --> I[Configuración del Sistema]

%% Flujo de Solicitudes
F --> F1[Crear nueva solicitud]
F1 --> F2[Ingreso de datos]
F2 --> F3[Validaciones frontend]
F3 -->|Correcto| F4[Guardar en Supabase]
F3 -->|Error| F5[Mostrar mensajes de error]
F4 --> F6[Solicitud registrada]
F6 --> F7[Notificación interna]

%% Flujo de Usuarios
G --> G1[Listar usuarios]
G1 --> G2[Crear / Editar usuario]
G2 --> G3[Guardar cambios en Supabase]

%% Flujo de Documentos
H --> H1[Subir documento]
H1 --> H2[Validar formato y tamaño]
H2 -->|Válido| H3[Guardar en Storage Supabase]
H2 -->|Inválido| H4[Mostrar error]
H3 --> H5[Registrar metadata en BD]

%% Configuración
I --> I1[Parámetros generales]
I1 --> I2[Guardar configuración]

%% Soft Delete
F --> SD1[Eliminar solicitud]
SD1 --> SD2[Soft Delete: deleted_at]
SD2 --> SD3[Registro oculto en frontend]

%% Logout
D --> Z[Logout]
Z --> ZA[Cerrar sesión Supabase]
ZA --> A
```

```mermaid
flowchart TD
    A[Analista accede al sistema] --> B[Login]

    B --> B1[Ingreso de usuario y contraseña]
    B1 --> B2[Validación Supabase Auth]

    B2 -->|Cuenta activa| C[Dashboard Analista]
    B2 -->|Cuenta bloqueada| B3[Acceso denegado]
    B2 -->|Credenciales incorrectas| B4[Error de login]

    C --> D[Consulta por DNI o RUC]
    D --> D1[Ingreso número de documento]
    D1 --> D2[Identificación automática del tipo de documento]
    D2 --> D3[Consulta en base de datos]

    D3 -->|Tiene protestos| E[Mostrar listado de protestos]
    D3 -->|No tiene| F[Mostrar mensaje sin protestos]

    E --> E1[Ver detalle del protesto]
    E1 --> E2[Entidad financiadora]
    E1 --> E3[Monto]
    E1 --> E4[Tarifa de levantamiento]

    E --> G[Levantar protesto]
    G --> G1[Confirmación]
    G1 -->|Confirmado| G2[Cambio de estado del protesto]
    G2 --> G3[Registro de auditoría]

    C --> H[Ver historial de consultas]

    C --> Z[Cerrar sesión]

```

Flujo de navegacion

```mermaid
flowchart TD
    A[Landing Page] --> B[Login]

    %% Autenticación
    B -->|Credenciales válidas| C{Rol del usuario}
    B -->|Credenciales inválidas| B1[Error de autenticación]

    %% Redirección por rol
    C -->|Administrador| D[Admin Dashboard]
    C -->|Analista| E[Analista Dashboard]

    %% =====================
    %% Rutas ADMINISTRADOR
    %% =====================
    D --> D1[Gestión de Analistas]
    D --> D2[Importar Protestos]
    D --> D3[Gestión de Protestos]
    D --> D4[Auditoría]

    %% Subrutas Admin
    D1 --> D1a[Crear Analista]
    D1 --> D1b[Editar Analista]
    D1 --> D1c[Actividad del Analista]

    D2 --> D2a[Cargar Excel]
    D2a --> D2b[Resultado de Importación]

    D3 --> D3a[Detalle de Protesto]
    D3a --> D3b[Levantar Protesto]

    %% =====================
    %% Rutas ANALISTA
    %% =====================
    E --> E1[Consulta de Persona]
    E --> E2[Historial de Consultas]

    %% Subrutas Analista
    E1 --> E1a[Resultado de Consulta]

    %% =====================
    %% Comunes
    %% =====================
    D --> Z[Cerrar Sesión]
    E --> Z[Cerrar Sesión]

```

Estructura de Carpetas

```xml
src/
│
├── app/                    # Bootstrap de la app
│   ├── App.jsx
│   ├── Router.jsx
│   ├── ProtectedRoute.jsx
│   └── index.jsx
│
├── assets/                 # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── styles/
│       ├── globals.css
│       ├── variables.css
│       └── resets.css
│
├── components/             # Atomic Design
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│
├── pages/                  # Páginas (rutas)
│   ├── public/
│   │   ├── Landing.jsx
│   │   └── Login.jsx
│   │
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Analysts.jsx
│   │   ├── AnalystForm.jsx
│   │   ├── ImportProtests.jsx
│   │   ├── Protests.jsx
│   │   └── Audit.jsx
│   │
│   └── analyst/
│       ├── Dashboard.jsx
│       ├── Search.jsx
│       └── History.jsx
│
├── layouts/                # Layouts por rol
│   ├── PublicLayout.jsx
│   ├── AdminLayout.jsx
│   └── AnalystLayout.jsx
│
├── features/               # Lógica de negocio por dominio
│   ├── auth/
│   ├── users/
│   ├── protests/
│   ├── audit/
│   └── imports/
│
├── services/               # Integraciones externas
│   ├── supabase/
│   │   ├── client.js
│   │   ├── auth.service.js
│   │   ├── users.service.js
│   │   ├── protests.service.js
│   │   └── audit.service.js
│   └── storage.service.js
│
├── hooks/                  # Hooks reutilizables
│   ├── useAuth.js
│   ├── useRole.js
│   ├── useDebounce.js
│   └── usePagination.js
│
├── context/                # Context API
│   ├── AuthContext.jsx
│   └── UIContext.jsx
│
├── utils/                  # Utilidades puras
│   ├── validators.js
│   ├── formatters.js
│   ├── constants.js
│   └── permissions.js
│
├── config/                 # Configuración global
│   ├── env.js
│   ├── routes.js
│   └── roles.js
│
└── tests/                  # Tests (opcional en MVP)
    ├── unit/
    └── integration/

```