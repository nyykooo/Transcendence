CREATE VIEW "DBA_human".all_recipes_query_user AS
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
		SELECT array_agg(i."Name" ORDER BY i."Name")
		FROM unnest(r.ingredients) AS ing_id
		JOIN "DBA_human"."Ingredients" i ON ing_id = i."ID"
	) AS ingredients,
    cost,
    portions
FROM "DBA_human".all_recipes r;
