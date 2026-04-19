#!/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source $ROOT_DIR/.env

echo "DB_CONTAINER: $DB_CONTAINER"
echo "DB_USER: $DB_USER"
echo "DB_NAME: $DB_NAME"
echo "SUPERUSER: $SUPERUSER"

docker exec $DB_CONTAINER psql -h localhost -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO dev_dba.users (role, name, password, email, created_at, is_active)
VALUES (
  'admin', 
  crypt('${SUPERUSER}', gen_salt('bf')), 
  crypt('${SUPERUSER_PW}', gen_salt('bf')), 
  crypt('${SUPERUSER_MAIL}', gen_salt('bf')),
  NOW(),
  true
);"