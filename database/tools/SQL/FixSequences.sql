-- Fix all_recipes sequence to match the max(id) in the table
SELECT setval(
    pg_get_serial_sequence('public.all_recipes', 'id'),
    COALESCE((SELECT MAX(id) FROM public.all_recipes), 0) + 1,
    false
);

-- Fix pending_recipes sequence to match the max(id) in the table
SELECT setval(
    pg_get_serial_sequence('public.pending_recipes', 'id'),
    COALESCE((SELECT MAX(id) FROM public.pending_recipes), 0) + 1,
    false
);
