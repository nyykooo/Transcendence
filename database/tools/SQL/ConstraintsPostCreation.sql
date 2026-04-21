
ALTER TABLE IF EXISTS dev_dba.all_recipes
    ADD CONSTRAINT "Author_FK"
    FOREIGN KEY (author) REFERENCES dev_dba.users(name);

ALTER TABLE IF EXISTS public.all_recipes
    ADD CONSTRAINT "Public_Author_FK"
    FOREIGN KEY (author) REFERENCES dev_dba.users(name);

UPDATE dev_dba.all_recipes
SET author = 'brunchio_admin';