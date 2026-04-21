
ALTER TABLE IF EXISTS dev_dba.all_recipes
    ADD CONSTRAINT "Author_FK"
    FOREIGN KEY (author) REFERENCES dev_dba.users(name);

ALTER TABLE IF EXISTS public.all_recipes
    ADD CONSTRAINT "Public_Author_FK"
    FOREIGN KEY (author) REFERENCES dev_dba.users(name);

-- ALTER TABLE IF EXISTS dev_dba.users
    -- ADD CONSTRAINT "recipe_author"
    -- FOREIGN KEY (is_author) REFERENCES dev_dba.all_recipes(name) ON DELETE CASCADE;

UPDATE dev_dba.all_recipes
SET author = 'brunchio_admin';

ALTER TABLE IF EXISTS public.pending_recipes
     ADD CONSTRAINT "Pending_Recipe_Author_FK"
     FOREIGN KEY (author) REFERENCES dev_dba.users(name) ON DELETE CASCADE;