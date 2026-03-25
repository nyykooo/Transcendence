#!/bin/bash

GREEN='\033[1;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

DB_CONTAINER=${POSTGRES_CONTAINER:-brunchio_db}
DB_NAME=${POSTGRES_DB:-brunchio_db}
DB_USER=${POSTGRES_USER:-yourUser}
DB_PASSWORD=${POSTGRES_PASSWORD:-}

PSQL_CMD="docker exec -i $DB_CONTAINER psql -h localhost -U $DB_USER -d $DB_NAME"

if [ -n "$DB_PASSWORD" ]; then
    export PGPASSWORD=$DB_PASSWORD
fi

wait_for_postgres() {
	echo "Checking PostgreSQL connection..."
    local attempt=1
    
    echo "Waiting for PostgreSQL to be ready Ctrl+C to stop..."
    
    while true; do
        if ! docker ps --format "{{.Names}}" | grep -q "^${DB_CONTAINER}$"; then
            echo "Waiting for container to start..."
            sleep 3
            continue
        fi

        if docker exec $DB_CONTAINER psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT 1" &>/dev/null; then
            return 0
        fi
        
        echo "Attempt $attempt: PostgreSQL not ready yet, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
}

run_sql() {
    
    wait_for_postgres
    
    if $PSQL_CMD < "$1"; then
        return 0
    else
        return 1
    fi
}

usage() {
    echo "Usage: $0 <insertion_file>.sql "
    exit 1
}

if [ $# -lt 1 ]; then
    echo "${RED}ERROR: no argument provided"
    usage
fi

run_sql "$1"