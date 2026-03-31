CREATE TABLE dev_dba.imported_recipes
(
	name TEXT NOT NULL,
	product TEXT NOT NULL,
	quantity integer,
	unit TEXT DEFAULT 'g',
	CONSTRAINT "Unique" UNIQUE (name)
);

ALTER TABLE IF EXISTS dev_dba.imported_recipes
    OWNER to dev_dba;