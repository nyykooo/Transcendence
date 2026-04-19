-- CREATE OR REPLACE FUNCTION dev_dba.export_to_public()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     INSERT INTO public.all_recipes (id, name, diet, cost, is_public)
--     VALUES (NEW.id, NEW.name, COALESCE(NEW.diet, 0), NEW.cost, NEW.is_public)
--     ON CONFLICT (id) DO UPDATE 
--     SET name = EXCLUDED.name,
--         diet = EXCLUDED.diet,
--         cost = EXCLUDED.cost,
--         is_public = EXCLUDED.is_public;
    
--     RETURN NEW;
-- END;
-- $$;

-- CREATE OR REPLACE TRIGGER on_approval
-- AFTER UPDATE ON dev_dba.all_recipes
-- FOR EACH ROW
-- WHEN (NEW.is_public = 'true')
-- EXECUTE FUNCTION dev_dba.export_to_public();

-- CREATE OR REPLACE FUNCTION dev_dba.set_all_recipes_public()
-- RETURNS INTEGER
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     rows_updated INTEGER;
-- BEGIN
--     UPDATE dev_dba.all_recipes
--     SET is_public = true,
--         updated = CURRENT_TIMESTAMP  
--     WHERE is_public = false OR is_public IS NULL; 
    
--     GET DIAGNOSTICS rows_updated = ROW_COUNT;
    
--     RETURN rows_updated;
-- END;
-- $$;

-- SELECT dev_dba.set_all_recipes_public();