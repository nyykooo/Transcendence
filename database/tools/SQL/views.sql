CREATE VIEW dev_dba.all_recipes_query_user AS
SELECT
    name,
    CASE diet
        WHEN 0 THEN 'Vegan'
        WHEN 1 THEN 'Vegetarian'
        WHEN 2 THEN 'Meat Based'
        WHEN 3 THEN 'Gluten Free'
        ELSE 'Unknown'
    END AS diet_type,
	(
		SELECT array_agg(i.name ORDER BY i.name)
		FROM unnest(r.ingredients) AS ing_id
		JOIN dev_dba.ingredients i ON ing_id = i.id
	) AS ingredients,
    cost,
    portions
FROM dev_dba.all_recipes r;
