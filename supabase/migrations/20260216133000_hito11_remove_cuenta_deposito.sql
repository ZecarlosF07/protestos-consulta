-- Eliminar columna cuenta_deposito de solicitudes_levantamiento
-- Esta columna se eliminó del requerimiento ya que es información fija informativa (cuenta institucional)
-- y no un dato ingresado por el usuario.

ALTER TABLE solicitudes_levantamiento
DROP COLUMN IF EXISTS cuenta_deposito;
