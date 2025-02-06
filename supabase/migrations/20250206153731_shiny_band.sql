/*
  # Alter usuarios table ID column type

  1. Changes
    - Modify `usua_id` column type from uuid to varchar(6)

  2. Notes
    - This change maintains existing data while changing the column type
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'id'
  ) THEN
    ALTER TABLE usuarios ALTER COLUMN id TYPE character varying(6);
  END IF;
END $$;
