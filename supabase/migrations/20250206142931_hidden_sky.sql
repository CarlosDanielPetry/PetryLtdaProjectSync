/*
  # Create users table with role management

  1. New Tables
    - `usuarios`
      - `id` (uuid, primary key)
      - `usua_email` (text, unique)
      - `usua_nome` (text)
      - `usua_cargo` (char(1))
      - `usua_data_cadastro` (timestamptz)
      - `auth_user_id` (uuid) - reference to auth.users
  
  2. Security
    - Enable RLS on `usuarios` table
    - Add policies for user access
*/

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usua_email text UNIQUE NOT NULL,
  usua_nome text NOT NULL,
  usua_cargo char(1) NOT NULL CHECK (usua_cargo IN ('C', 'F', 'D', 'A')),
  usua_data_cadastro timestamptz DEFAULT now(),
  auth_user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON usuarios
  FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile"
  ON usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile"
  ON usuarios
  FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);