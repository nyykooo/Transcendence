CREATE TABLE dev_dba.imported_recipes
(
	recipe_name TEXT NOT NULL,
	ingredient_name TEXT NOT NULL,
	quantity numeric(10, 2) NOT NULL CHECK (quantity >= 0),
	unit TEXT NOT NULL CHECK (unit IN ('g', 'ml', 'unit'))
);

ALTER TABLE IF EXISTS dev_dba.imported_recipes
    OWNER to dev_dba;