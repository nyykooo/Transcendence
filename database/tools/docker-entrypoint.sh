#!/bin/bash
set -e

# Fix SSL certificate permissions for PostgreSQL
if [ -f "/var/lib/postgresql/ssl/server.key" ]; then
    chmod 600 /var/lib/postgresql/ssl/server.key
    chmod 644 /var/lib/postgresql/ssl/server.crt
    chown postgres:postgres /var/lib/postgresql/ssl/server.key /var/lib/postgresql/ssl/server.crt
fi

# Run the original entrypoint
exec docker-entrypoint.sh "$@"
