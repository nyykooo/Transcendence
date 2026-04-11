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
            INSERT INTO dev_dba.recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
            VALUES (v_recipe_id, v_ingredient_id, v_quantity, v_unit)
            ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET
                quantity = EXCLUDED.quantity,
                unit = EXCLUDED.unit;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Import and aggregation completed successfully!';
END;
$$;