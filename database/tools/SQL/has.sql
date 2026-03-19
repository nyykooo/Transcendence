CREATE OR REPLACE FUNCTION "DBA_human".hash_password_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $BODY$
BEGIN
    -- Hash the password before inserting or updating
    NEW.password := "DBA_human".hash_pass(NEW.password);
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION "DBA_human".hash_password_trigger() OWNER TO postgres;
