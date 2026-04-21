SELECT 
    c.column_name, 
    c.data_type, 
    c.is_nullable,
    STRING_AGG(tc.constraint_type, ', ') AS constraint_types,
    STRING_AGG(tc.constraint_name, ', ') AS constraint_names
FROM information_schema.columns c
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.table_schema = c.table_schema 
    AND ccu.table_name = c.table_name 
    AND ccu.column_name = c.column_name
LEFT JOIN information_schema.table_constraints tc 
    ON tc.constraint_schema = ccu.constraint_schema 
    AND tc.constraint_name = ccu.constraint_name
WHERE c.table_schema = 'dev_dba' 
  AND c.table_name = 'users'
GROUP BY c.column_name, c.data_type, c.is_nullable, c.ordinal_position
ORDER BY c.ordinal_position;
