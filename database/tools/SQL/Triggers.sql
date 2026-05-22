CREATE OR REPLACE FUNCTION dev_dba.sync_all_recipes_to_public()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        DELETE FROM public.all_recipes
        WHERE id = OLD.id;
        RETURN OLD;
    END IF;

    INSERT INTO public.all_recipes (
        id,
        name,
        diet,
        ingredients,
        instructions,
        image,
        url,
        cost,
        portions,
        created_at,
        updated,
        is_public,
        prep_time,
        cooking_time,
        liked,
        viewed,
        author
    )
    VALUES (
        NEW.id,
        NEW.name,
        COALESCE(NEW.diet, 'vegan'),
        NEW.ingredients,
        NEW.instructions,
        NEW.image,
        NEW.url,
        NEW.cost,
        NEW.portions,
        NEW.created_at,
        NEW.updated,
        NEW.is_public,
        NEW.prep_time,
        NEW.cooking_time,
        NEW.liked,
        NEW.viewed,
        NEW.author
    )
    ON CONFLICT (id) DO UPDATE
    SET
        name = EXCLUDED.name,
        diet = EXCLUDED.diet,
        ingredients = EXCLUDED.ingredients,
        instructions = EXCLUDED.instructions,
        image = EXCLUDED.image,
        url = EXCLUDED.url,
        cost = EXCLUDED.cost,
        portions = EXCLUDED.portions,
        created_at = EXCLUDED.created_at,
        updated = EXCLUDED.updated,
        is_public = EXCLUDED.is_public,
        prep_time = EXCLUDED.prep_time,
        cooking_time = EXCLUDED.cooking_time,
        liked = EXCLUDED.liked,
        viewed = EXCLUDED.viewed,
        author = EXCLUDED.author;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_approval ON dev_dba.all_recipes;
CREATE TRIGGER on_approval
AFTER INSERT OR UPDATE OR DELETE ON dev_dba.all_recipes
FOR EACH ROW
EXECUTE FUNCTION dev_dba.sync_all_recipes_to_public();

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
