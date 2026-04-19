CREATE OR REPLACE PROCEDURE dev_dba.import_and_aggregate_recipes()
LANGUAGE plpgsql
AS $$
DECLARE
    v_recipe_name TEXT;
    v_ingredient_name TEXT;
    v_quantity NUMERIC;
    v_unit TEXT;
    v_recipe_id BIGINT;
    v_ingredient_id BIGINT;
BEGIN
    FOR v_recipe_name IN 
        SELECT DISTINCT recipe_name FROM dev_dba.imported_recipes
    LOOP
        INSERT INTO dev_dba.all_recipes (name, created_at)
        VALUES (v_recipe_name, CURRENT_TIMESTAMP)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id INTO v_recipe_id;
        
        FOR v_ingredient_name, v_quantity, v_unit IN
            SELECT ingredient_name, quantity, unit
            FROM dev_dba.imported_recipes
            WHERE recipe_name = v_recipe_name
        LOOP
            -- Fixed: Include all NOT NULL columns
            INSERT INTO dev_dba.ingredients (name, price_per_kg, unit)
            VALUES (v_ingredient_name, 0.00, v_unit)
            ON CONFLICT (name) DO UPDATE SET 
                unit = EXCLUDED.unit
            RETURNING id INTO v_ingredient_id;
            
            -- Get the ingredient ID if it already existed
            IF v_ingredient_id IS NULL THEN
                SELECT id INTO v_ingredient_id 
                FROM dev_dba.ingredients 
                WHERE name = v_ingredient_name;
            END IF;
            
            -- Insert into recipe_ingredients junction table
            INSERT INTO dev_dba.recipe_ingredients (recipe_id, ingredient_id, name ,  quantity, unit)
            VALUES (v_recipe_id, v_ingredient_id, v_ingredient_name ,v_quantity, v_unit)
            ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET
                quantity = EXCLUDED.quantity,
                unit = EXCLUDED.unit;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Import and aggregation completed successfully!';
END;
$$;

CALL dev_dba.import_and_aggregate_recipes();


CREATE OR REPLACE FUNCTION dev_dba.pricing_list()
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_ingredient_id BIGINT;
    v_recipe_id BIGINT;
    v_ppkg NUMERIC(7,2);
    v_unit TEXT;
    v_quantity NUMERIC(6,2);
    v_total_cost NUMERIC(10,2);
    v_cost NUMERIC(10,2);
BEGIN
    FOR v_recipe_id IN 
        SELECT DISTINCT recipe_id FROM dev_dba.recipe_ingredients
    LOOP
        v_total_cost := 0;
        
        FOR v_ingredient_id, v_quantity, v_ppkg IN
            SELECT ri.ingredient_id, ri.quantity, i.price_per_kg
            FROM dev_dba.recipe_ingredients ri
            INNER JOIN dev_dba.ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = v_recipe_id
        LOOP
            v_total_cost := v_total_cost + (v_ppkg * (v_quantity / 1000));
        END LOOP;
        
        UPDATE dev_dba.all_recipes 
        SET cost = v_total_cost
        WHERE id = v_recipe_id;
        
    END LOOP;
    
    RETURN;
END;
$$;

SELECT dev_dba.pricing_list();


CREATE OR REPLACE PROCEDURE update_recipe_ingredients_as_jsonb()
LANGUAGE plpgsql
AS $$
DECLARE
    recipe_record RECORD;
    ingredients_json JSONB;
BEGIN
    -- Loop through each recipe
    FOR recipe_record IN 
        SELECT DISTINCT 
            ar.id as recipe_id,
            ar.name as recipe_name
        FROM dev_dba.recipe_ingredients ri
        INNER JOIN dev_dba.all_recipes ar ON ri.recipe_id = ar.id
        ORDER BY ar.id
    LOOP
        -- Build JSONB array of ingredients for the current recipe
        SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'name', ri.name,
                'quantity', ri.quantity,
                'unit', ri.unit
            ) ORDER BY ri.name
        )
        INTO ingredients_json
        FROM dev_dba.recipe_ingredients ri
        WHERE ri.recipe_id = recipe_record.recipe_id;
        
        -- Update the recipe with the ingredients JSONB
        UPDATE dev_dba.all_recipes
        SET ingredients = ingredients_json
        WHERE id = recipe_record.recipe_id;
        
        -- RAISE NOTICE 'Updated recipe % (%) with % ingredients',
        --     recipe_record.recipe_id,
        --     recipe_record.recipe_name,
        --     JSONB_ARRAY_LENGTH(ingredients_json);
    END LOOP;
END;
$$;

CALL update_recipe_ingredients_as_jsonb();


