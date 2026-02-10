## Descripción Global del Proyecto

El presente proyecto consiste en el desarrollo de un **Sistema SaaS institucional de consulta y gestión de protestos y moras**, orientado a entidades financieras (bancos y cajas) que operan en la provincia de Ica, bajo la administración centralizada de la **Cámara de Comercio de Ica**.

La Cámara de Comercio de Ica cuenta con información oficial y consolidada sobre protestos a nivel provincial, la cual constituye una fuente clave para la evaluación crediticia y la gestión de riesgos por parte de las entidades financieras. Sin embargo, el acceso a dicha información suele realizarse mediante procesos poco automatizados, con limitadas capacidades de trazabilidad, control y auditoría. El sistema propuesto busca resolver estas limitaciones mediante una plataforma digital segura, controlada y auditable.

El sistema permitirá que las entidades financieras contraten el servicio y operen a través de **usuarios analistas**, quienes accederán mediante credenciales individuales habilitadas exclusivamente por la Cámara de Comercio. No existirá funcionalidad de auto‑registro, garantizando así un control institucional estricto sobre el acceso y uso del sistema.

Cada analista podrá realizar consultas utilizando un único campo de búsqueda por **número de documento**, el cual será identificado automáticamente por el sistema como DNI o RUC, según su estructura. Como resultado de la consulta, el sistema mostrará si la persona natural o jurídica cuenta o no con protestos registrados, así como la información relevante asociada, incluyendo datos del protesto, entidad financiadora, entidad fuente, monto y tarifa aplicable para el levantamiento.

En caso de detectarse protestos vigentes, el sistema ofrecerá un flujo mínimo para iniciar el **levantamiento de protesto**, el cual contempla la descarga de un formato oficial, la carga del comprobante de pago y la subida del formato debidamente firmado. Todas las solicitudes generadas serán registradas, notificadas al administrador de la Cámara de Comercio y gestionadas desde un listado centralizado, considerando que múltiples analistas de distintas entidades pueden generar solicitudes de forma simultánea.

El sistema incorporará un **módulo de auditoría**, cuyo objetivo es garantizar la trazabilidad y el uso responsable de la información. Dicho módulo permitirá registrar cada consulta realizada, incluyendo el analista responsable, la entidad financiera, el número de documento consultado y la fecha y hora de la operación. A partir de esta información, el administrador podrá visualizar métricas globales, dashboards de uso y rankings de analistas con mayor volumen de consultas.

Asimismo, el sistema contará con una funcionalidad administrativa para la **importación periódica de protestos** mediante archivos Excel proporcionados por la Cámara de Comercio de Lima. Estos archivos contendrán exclusivamente nuevos protestos que alimentarán la base de datos del sistema, asegurando la actualización constante de la información disponible para las consultas.

El alcance del proyecto se encuentra delimitado como un **MVP institucional**, priorizando únicamente las funcionalidades esenciales que permitan validar el modelo de operación, el flujo de consulta, la trazabilidad de uso y el proceso básico de levantamiento de protestos, dejando fuera consideraciones técnicas, de infraestructura o integraciones externas que serán abordadas en fases posteriores.

En conjunto, este sistema busca fortalecer la transparencia, eficiencia y control en el acceso a la información de protestos en la provincia de Ica, brindando a las entidades financieras una herramienta confiable y a la Cámara de Comercio un mecanismo centralizado de administración, supervisión y auditoría.

