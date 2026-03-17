CREATE TABLE "DBA_human"."Users"
(
    "ID" bigserial NOT NULL,
    name character varying(20) NOT NULL,
    nick character varying(20) NOT NULL UNIQUE,
    password character varying(300) NOT NULL,
    email character varying(100) NOT NULL UNIQUE,
    liked integer[] DEFAULT NULL,
    viewed integer[] DEFAULT NULL,
    PRIMARY KEY ("ID")
);

ALTER TABLE IF EXISTS "DBA_human"."Users"
    OWNER to postgres;

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


ALTER TABLE "DBA_human"."Users"
ADD CONSTRAINT password_format_check
CHECK (password ~ '^SCRAM-SHA-256\$[0-9]+:[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$');

CREATE TRIGGER hash_user_password
    BEFORE INSERT OR UPDATE OF password ON "DBA_human"."Users"
    FOR EACH ROW
    EXECUTE FUNCTION "DBA_human".hash_password_trigger();


CREATE TABLE "DBA_human"."Ingredients"
(
    "ID" bigserial NOT NULL,
    "Name" character varying(30) NOT NULL,
    "Price" numeric(7, 2) NOT NULL CHECK ("Price" >= 0),  -- Added CHECK constraint here
    "Updated" date DEFAULT NULL,
    PRIMARY KEY ("ID"),
    CONSTRAINT "Unique" UNIQUE ("Name")
);

ALTER TABLE IF EXISTS "DBA_human"."Ingredients"
    OWNER to postgres;


CREATE OR REPLACE FUNCTION "DBA_human".update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $BODY$
BEGIN
    -- Set the Updated column to current timestamp
    NEW."Updated" := CURRENT_DATE;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION "DBA_human".update_timestamp() OWNER TO postgres;

CREATE TRIGGER set_updated_timestamp
    BEFORE INSERT OR UPDATE ON "DBA_human"."Ingredients"
    FOR EACH ROW
    EXECUTE FUNCTION "DBA_human".update_timestamp();


CREATE TABLE "DBA_human".all_recipes
(
    id bigserial NOT NULL,
	name character varying(60) NOT NULL,
    diet integer NOT NULL DEFAULT 0,
    ingredients integer[] DEFAULT NULL,
    instructions character varying(2048) DEFAULT NULL,
    url character varying(500) DEFAULT NULL,
    cost numeric(5, 2) DEFAULT 0,
    portions integer DEFAULT 1,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS "DBA_human".all_recipes
    OWNER to postgres;
