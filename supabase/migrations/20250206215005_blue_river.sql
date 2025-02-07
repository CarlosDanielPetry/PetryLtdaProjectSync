/*
  # Ajuste dos tipos de colunas da tabela produtos

  1. Alterações
    - Define os tipos corretos para todas as colunas
    - Adiciona as constraints necessárias
    - Evita ambiguidade de nomes de colunas
*/

DO $$ 
DECLARE
  col record;
BEGIN
  -- Verifica cada coluna individualmente e faz a alteração se existir
  FOR col IN 
    SELECT information_schema.columns.column_name as col_name
    FROM information_schema.columns 
    WHERE table_name = 'produtos'
  LOOP
    CASE col.col_name
      WHEN 'prod_descricao' THEN
        EXECUTE 'ALTER TABLE produtos ALTER COLUMN prod_descricao TYPE varchar(100)';
      WHEN 'prod_codBarras' THEN
        EXECUTE 'ALTER TABLE produtos ALTER COLUMN "prod_codBarras" TYPE varchar(13)';
      WHEN 'prod_Estoque' THEN
        EXECUTE 'ALTER TABLE produtos ALTER COLUMN "prod_Estoque" TYPE numeric(15,5)';
      WHEN 'prod_Grupo' THEN
        EXECUTE 'ALTER TABLE produtos ALTER COLUMN "prod_Grupo" TYPE varchar(30)';
      WHEN 'prod_marca' THEN
        EXECUTE 'ALTER TABLE produtos ALTER COLUMN prod_marca TYPE varchar(30)';
      WHEN 'prod_situacao' THEN
        EXECUTE 'ALTER TABLE produtos ALTER COLUMN prod_situacao TYPE char(1)';
      WHEN 'prod_vmd' THEN
        EXECUTE 'ALTER TABLE produtos ALTER COLUMN prod_vmd TYPE numeric(12,3)';
      ELSE
        NULL;
    END CASE;
  END LOOP;

  -- Remove a constraint antiga se existir
  ALTER TABLE produtos DROP CONSTRAINT IF EXISTS check_prod_situacao;
    
  -- Adiciona a nova constraint
  ALTER TABLE produtos
    ADD CONSTRAINT check_prod_situacao 
    CHECK (prod_situacao IN ('A', 'I'));
END $$;
