-- Insert the Portuguese-style recipe
WITH new_recipe AS (
    INSERT INTO dev_dba.all_recipes (
        diet,
		name,
        instructions,
        url,
        cost,
        portions
    )
    VALUES (
        1,  -- diet type (1 = standard, adjust as needed)
		'Shakshuka',
        E'1. **Prepare ingredients**:\n' ||
        '   Finely dice all ingredients, really small cuts\n' ||
        '2. **Sauté aromatics**:\n' ||
        '   - Heat olive oil in a large pan\n' ||
        '   - Brown the garlic, onion and the pepper\n' ||
        '   - Add the tomato and season, let it in low heat until the sauce is thickened\n\n' ||
        '3. **Add tomatoes and spices**:\n' ||
        '   - Add the tomato and season\n' ||
        '   - Salt to taste\n' ||
        '   - Simmer for 15-20 minutes until thickened\n\n' ||
        '4. **Add eggs**:\n' ||
        '   - Make wells in the sauce and crack eggs\n' ||
        '   - Cover and cook until eggs are set (5-7 minutes)\n\n' ||
        '5. **Serve**:\n' ||
        '   - Serve hot with Saloia bread (100g) on the side\n' ||
        '   - Garnish with fresh herbs if desired',
        'https://youtu.be/SjCkW-oAFQ8?si=8dk4eXJW1kk6ohr1&t=31',
        12.75,  -- estimated total cost
        4       -- serves 4 people
    )
    RETURNING id
)
INSERT INTO dev_dba.recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT
    new_recipe.id,
    i."ID",
    ing.quantity,
    ing.unit
FROM new_recipe
CROSS JOIN (
    VALUES
        ('Eggs', 2, 'units'),
        ('Onion', 0.115, 'kg'),
        ('Red Bell Pepper', 0.114, 'kg'),
        ('Tomato', 0.551, 'kg'),
        ('Garlic', 0.014, 'kg'),
        ('Rosemary', 0.002, 'kg'),
        ('Thyme', 0.004, 'kg'),
        ('Basil', 0.006, 'kg'),
        ('Chili Pepper', 0.011, 'kg'),
        ('Sweet Paprika', 0.010, 'kg'),
        ('Cumin', 0.004, 'kg'),
        ('Tomato Concentrate', 0.050, 'kg'),
        ('Saloia Bread', 0.100, 'kg')
) AS ing(name, quantity, unit)
JOIN dev_dba."Ingredients" i ON i."Name" = ing.name
RETURNING recipe_id;
