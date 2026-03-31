#!/bin/bash

DB_CONTAINER=${POSTGRES_CONTAINER:-brunchio_db}
DB_NAME=${POSTGRES_DB:-brunchio_db}
DB_USER=${POSTGRES_USER:-yourUser}
DB_PASSWORD=${POSTGRES_PW:-}

docker exec -i $DB_CONTAINER psql -h localhost -U $DB_USER -d $DB_NAME \
-c "\copy dev_dba.imported_recipes(recipe_name, ingredient_name, quantity, unit) FROM STDIN WITH (FORMAT csv, HEADER true)" \
< ./tools/utils/imported_recipes_db.csv


