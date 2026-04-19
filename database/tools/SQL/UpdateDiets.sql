


CREATE OR REPLACE FUNCTION update_recipe_diets()
RETURNS void AS $$
DECLARE
    recipe_rec RECORD;
    diet_priority INTEGER;
    diet_result VARCHAR(50);
BEGIN
    FOR recipe_rec IN 
        SELECT 
            name,
            ingredients,
            diet as current_diet
        FROM dev_dba.all_recipes
    LOOP
        WITH ingredient_diets AS (
            SELECT DISTINCT
                COALESCE(m.diet_type, 'Vegan') as diet_type
            FROM jsonb_to_recordset(recipe_rec.ingredients) AS i(name TEXT)
            JOIN dev_dba.ingredients m ON m.name = i.name
        )
        SELECT COALESCE(
            MAX(CASE WHEN diet_type = 'Omnivorous' THEN 3
                     WHEN diet_type = 'Vegetarian' THEN 2
                     WHEN diet_type = 'Vegan' THEN 1
                     ELSE 1 END),
            1
        ) INTO diet_priority
        FROM ingredient_diets;
        
        diet_result := CASE 
            WHEN diet_priority = 3 THEN 'Omnivorous'
            WHEN diet_priority = 2 THEN 'Vegetarian'
            ELSE 'Vegan'
        END;
        
        IF recipe_rec.current_diet != diet_result THEN
            UPDATE dev_dba.all_recipes
            SET diet = diet_result
            WHERE name = recipe_rec.name;
            
            -- RAISE NOTICE 'Updated recipe "%" from "%" to "%"', 
            --              recipe_rec.name, 
            --              recipe_rec.current_diet, 
            --              diet_result;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


SELECT update_recipe_diets();
SELECT 'Diets updated!' AS message;