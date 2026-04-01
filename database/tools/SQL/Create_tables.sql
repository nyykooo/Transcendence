

CREATE TABLE dev_dba.users
(
	id bigserial NOT NULL,
	role TEXT DEFAULT 'user' CHECK (role IN('user', 'admin', 'moderator')),
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    liked integer[] DEFAULT '{}',
    viewed integer[] DEFAULT '{}',
	created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp with time zone,
	last_login timestamp with time zone,
	is_active boolean DEFAULT false,
	avatar TEXT,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS dev_dba.users
    OWNER to dev_dba;


CREATE TABLE dev_dba.ingredients
(
    id bigserial NOT NULL,
    name TEXT NOT NULL,
    price_per_kg numeric(7, 2) NOT NULL CHECK (price_per_kg >= 0),
    last_update date DEFAULT NULL,
	unit TEXT DEFAULT 'g',
    PRIMARY KEY (id),
    CONSTRAINT "Unique" UNIQUE (name)
);

ALTER TABLE IF EXISTS dev_dba.ingredients
    OWNER to dev_dba;


CREATE OR REPLACE FUNCTION dev_dba.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $BODY$
BEGIN
    -- Set the Updated column to current timestamp
    NEW.last_update := CURRENT_DATE;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION dev_dba.update_timestamp() OWNER TO dev_dba;
-- ALTER FUNCTION dev_dba.update_timestamp() OWNER TO dev_dba;

CREATE TRIGGER set_updated_timestamp
    BEFORE INSERT OR UPDATE ON dev_dba.ingredients
    FOR EACH ROW
    EXECUTE FUNCTION dev_dba.update_timestamp();



CREATE TABLE dev_dba.all_recipes
(
	id bigserial NOT NULL,
	name TEXT NOT NULL,
	diet integer NOT NULL DEFAULT 0,
	instructions TEXT DEFAULT NULL,
	url TEXT DEFAULT NULL,
	cost numeric(5, 2) DEFAULT 0,
	portions integer DEFAULT 1,
	created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	updated timestamp with time zone,
	is_public boolean DEFAULT false,
	prep_time integer,
	cooking_time integer,
	liked integer,
	viewed integer,
	PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS dev_dba.all_recipes
    OWNER to dev_dba;

CREATE TABLE dev_dba.recipe_ingredients
(
	recipe_id bigint REFERENCES dev_dba.all_recipes(id),
	ingredient_id bigint REFERENCES dev_dba.ingredients(id),
	quantity numeric (6,2) NOT NULL,
	unit TEXT,
	PRIMARY KEY (recipe_id, ingredient_id)

);


-- ALTER TABLE IF EXISTS dev_dba.pending_recipes
--     OWNER to dev_dba;

-- CREATE INDEX idx_pending_recipes_user_id ON dev_dba.pending_recipes(user_id);
-- CREATE INDEX idx_pending_recipes_status ON dev_dba.pending_recipes(status);
-- CREATE INDEX idx_pending_recipes_submitted_at ON dev_dba.pending_recipes(submitted_at);
