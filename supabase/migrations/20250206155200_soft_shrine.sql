/*
  # Add password column to usuarios table

  1. Changes
    - Add `usua_senha` column to `usuarios` table to store hashed passwords
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'usua_senha'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN usua_senha text;
  END IF;
END $$;