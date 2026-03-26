-- ============================================================
-- HITO 13: Corrección de formatos PDF
-- Actualizar nombres, códigos y correlativos iniciales
-- ============================================================

-- 1. Eliminar los registros seed incorrectos
DELETE FROM formatos_pdf
WHERE codigo IN ('CERT-BUSQUEDA', 'CERT-NO-PROTESTO', 'CONST-LEVANTAMIENTO');

-- 2. Insertar los formatos correctos con correlativos iniciales
--    ultimo_correlativo = N-1 para que el próximo generado sea el valor indicado
--    Constancia de Anotación    → primer correlativo: Nº013075
--    Cert. Títulos Regularizados → primer correlativo: Nº008141
--    Certificado Negativo        → primer correlativo: Nº002855

INSERT INTO formatos_pdf (nombre, codigo, descripcion, ultimo_correlativo)
VALUES
    ('Constancia de Anotación',
     'CONST-ANOTACION',
     'Constancia oficial de anotación emitida por la Cámara de Comercio de Ica',
     13074),
    ('Certificado de Títulos Regularizados',
     'CERT-TITULOS',
     'Certificado que acredita la regularización de títulos registrados',
     8140),
    ('Certificado Negativo',
     'CERT-NEGATIVO',
     'Certificado que acredita la inexistencia de registros a nombre del solicitante',
     2854)
ON CONFLICT (codigo) DO NOTHING;
