/*
  # Add email check function
  
  1. New Functions
    - `check_email_exists`: Function to check if an email already exists in usuarios table
      - Input: email_to_check (text)
      - Output: integer (count of matching emails)
  
  2. Description
    - Creates a function to safely check for existing email addresses
    - Returns count of matching emails for the given address
    - Case insensitive comparison for reliability
*/

CREATE OR REPLACE FUNCTION check_email_exists(email_to_check TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM usuarios
    WHERE LOWER(usua_email) = LOWER(email_to_check)
  );
END;
$$;