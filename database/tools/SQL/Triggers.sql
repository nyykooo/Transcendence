CREATE OR REPLACE FUNCTION dev_dba.export_to_public()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.all_recipes (id, name, diet, ingredients, cost, is_public)
    VALUES (NEW.id, NEW.name, COALESCE(NEW.diet, 'vegan'), NEW.ingredients,NEW.cost, NEW.is_public)
    ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name,
        diet = EXCLUDED.diet,
        cost = EXCLUDED.cost,
		ingredients = EXCLUDED.ingredients,
        is_public = EXCLUDED.is_public;
    
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER on_approval
AFTER UPDATE ON dev_dba.all_recipes
FOR EACH ROW
WHEN (NEW.is_public = 'true')
EXECUTE FUNCTION dev_dba.export_to_public();

CREATE OR REPLACE FUNCTION dev_dba.set_all_recipes_public()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    rows_updated INTEGER;
BEGIN
    UPDATE dev_dba.all_recipes
    SET is_public = true,
        updated = CURRENT_TIMESTAMP  
    WHERE is_public = false OR is_public IS NULL; 
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    
    RETURN rows_updated;
END;
$$;

SELECT dev_dba.set_all_recipes_public();



CREATE OR REPLACE FUNCTION replicate_all_recipes_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.all_recipes WHERE id = NEW.id) THEN

        UPDATE public.all_recipes
        SET 
            name = NEW.name,
            diet = NEW.diet,
            ingredients = NEW.ingredients,
			instructions = NEW.instructions,
			image = NEW.image,
			url = NEW.url,
            cost = NEW.cost,
			portions = NEW.portions,
            created_at = NEW.created_at,
            updated = NEW.updated,
            prep_time = NEW.prep_time,
			cooking_time = NEW.cooking_time,
			liked = NEW.liked,
			viewed = NEW.viewed,
            author = NEW.author
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_replicate_all_recipes_update
    AFTER UPDATE ON dev_dba.all_recipes
    FOR EACH ROW
    EXECUTE FUNCTION replicate_all_recipes_update();



CREATE OR REPLACE FUNCTION dev_dba.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $BODY$
BEGIN
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


SELECT 'Triggers created!' as message;
