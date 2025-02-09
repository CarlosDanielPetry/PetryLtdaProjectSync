/*
  # Create new products table with specific columns

  1. New Tables
    - `produtos`
      - `id` (uuid, primary key)
      - `prod_descricao` (text)
      - `prod_codBarras` (text)
      - `prod_Estoque` (integer)
      - `prod_Grupo` (text)
      - `prod_marca` (text)
      - `prod_situacao` (char(1))
      - `prod_vmd` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for product management
*/

CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prod_descricao text NOT NULL,
  prod_codBarras text UNIQUE,
  prod_Estoque integer NOT NULL DEFAULT 0,
  prod_Grupo text,
  prod_marca text,
  prod_situacao char(1) NOT NULL CHECK (prod_situacao IN ('A', 'I')) DEFAULT 'A',
  prod_vmd numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Staff can view products"
  ON produtos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE auth.uid() = auth_user_id
      AND usua_cargo IN ('D', 'A', 'F')
    )
  );

CREATE POLICY "Staff can manage products"
  ON produtos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE auth.uid() = auth_user_id
      AND usua_cargo IN ('D', 'A', 'F')
    )
  );
