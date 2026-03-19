CREATE OR REPLACE FUNCTION dev_dba.hash_password_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $BODY$
BEGIN
    -- Hash the password before inserting or updating
    NEW.password := dev_dba.hash_pass(NEW.password);
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION dev_dba.hash_password_trigger() OWNER TO postgres;
