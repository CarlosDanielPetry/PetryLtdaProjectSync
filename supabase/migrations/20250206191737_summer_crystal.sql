/*
  # Add IP tracking and NOT NULL constraints

  1. Changes
    - Add `usua_IP` column to `usuarios` table
    - Make all columns NOT NULL with appropriate default values
    - Add index on `usua_IP` for faster lookups

  2. Security
    - Maintain existing RLS policies
*/

-- First set default values for existing NULL values
UPDATE usuarios SET
  usua_data_cadastro = now() WHERE usua_data_cadastro IS NULL;

UPDATE usuarios SET
  usua_senha = '' WHERE usua_senha IS NULL;

-- Add IP column with default
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS usua_IP text DEFAULT '0.0.0.0';

-- Update any existing NULL IPs
UPDATE usuarios SET usua_IP = '0.0.0.0' WHERE usua_IP IS NULL;

-- Now make columns NOT NULL
ALTER TABLE usuarios
  ALTER COLUMN usua_email SET NOT NULL,
  ALTER COLUMN usua_nome SET NOT NULL,
  ALTER COLUMN usua_cargo SET NOT NULL,
  ALTER COLUMN usua_data_cadastro SET NOT NULL,
  ALTER COLUMN auth_user_id SET NOT NULL,
  ALTER COLUMN usua_senha SET NOT NULL,
  ALTER COLUMN usua_IP SET NOT NULL;

-- Add default constraints separately
ALTER TABLE usuarios
  ALTER COLUMN usua_data_cadastro SET DEFAULT now(),
  ALTER COLUMN usua_IP SET DEFAULT '0.0.0.0';

-- Add index for IP lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_ip ON usuarios(usua_IP);