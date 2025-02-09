/*
  # Add IP tracking and NOT NULL constraints

  1. Changes
    - Add `usua_IP` column to `usuarios` table
    - Make all columns NOT NULL with appropriate default values
    - Add index on `usua_IP` for faster lookups

  2. Security
    - Maintain existing RLS policies
*/

-- Add IP column
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS usua_IP text;

-- Make columns NOT NULL with appropriate defaults
ALTER TABLE usuarios
  ALTER COLUMN usua_email SET NOT NULL,
  ALTER COLUMN usua_nome SET NOT NULL,
  ALTER COLUMN usua_cargo SET NOT NULL,
  ALTER COLUMN usua_data_cadastro SET NOT NULL DEFAULT now(),
  ALTER COLUMN auth_user_id SET NOT NULL,
  ALTER COLUMN usua_senha SET NOT NULL,
  ALTER COLUMN usua_IP SET NOT NULL DEFAULT '0.0.0.0';

-- Add index for IP lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_ip ON usuarios(usua_IP);
